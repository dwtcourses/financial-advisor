import csv
import requests
from requests.auth import HTTPBasicAuth
import json
import psycopg2
import time

def open_database_connection(postgres_config):
    """
    Open a database connection with autocommit property.

    Args:
        postgres_config : dictionary of postgres configuration
    Returns:
        connection object
    """
    conn = psycopg2.connect(
        host=postgres_config['host'],
        port=postgres_config['port'],
        dbname=postgres_config['database'],
        user=postgres_config['user'],
        password=postgres_config['password']
    )
    conn.set_session(autocommit=True)
    return conn

def load_json(json_file_path):
    """
    Load a json file and return the dictionary.

    Args:
        json_file_path : path of the json file to load
    Returns:
        dictionary of key value pairs of the json file
    """
    with open(json_file_path) as json_file:
        json_dict = json.loads(json_file.read())
    return json_dict

def company_to_sql_columns(comp_json):
    """
    Convert JSON obtained from Intrinio get request to SQL column keys.

    Args:
        comp_json : raw JSON obtained from intrinio companies API.
    Returns:
        dictionary mapping SQL columns to values, using dollar escaping for postgres
    """
    def get_field(field):
        """ Return 'NULL' if field is None. """
        return '$${}$$'.format(comp_json[field]) if comp_json[field] else 'NULL'

    return {
        'company_id': get_field('cik'),
        'company_name': get_field('name'),
        'ceo_name': get_field('ceo'),
        'company_description': get_field('short_description'),
        'hq_address': get_field('business_address'),
        'num_employees': get_field('employees'),
        'sector': get_field('sector'),
        'industry': get_field('industry_category')
    }

def main():
    # Load credentials for Intrinio API
    intrinio_cred = load_json('../intrinio_credentials.json')

    # Open database connection using postgres configuration file
    postgres_config = load_json('../postgres_config.json')
    conn = open_database_connection(postgres_config)

    # Retrieve all companies
    with open('../data/companies.csv', newline='') as csvfile:
        company_reader = csv.reader(csvfile, delimiter=',', quotechar='"')
        max_iters = 2300
        for row in company_reader:
            # Get ticker to use in GET request
            ticker = row[0]

            # Get company information
            comp_json = requests.get('https://api.intrinio.com/companies?identifier={}'.format(ticker), auth=HTTPBasicAuth(intrinio_cred['API_USER'], intrinio_cred['API_KEY'])).json()

            # Map fields to SQL column names
            comp_item = company_to_sql_columns(comp_json)

            # If company id is NULL, do not insert
            if comp_item['company_id'] == 'NULL':
                print(comp_item)
            else:
                with conn.cursor() as cur:
                    # Insert values into the database
                    try:
                        cur.execute("INSERT INTO company VALUES({company_id}, {company_name}, {ceo_name}, {company_description}, {hq_address}, {num_employees}, {sector}, {industry});".format(**comp_item))
                        # Check if successfully inserted
                        cur.execute("SELECT * FROM company WHERE company_id={company_id};".format(company_id=comp_item['company_id']))
                        if len(cur.fetchone()) == 0:
                            print("Error inserting company\n{}".format(comp_item))
                    except psycopg2.IntegrityError as e:
                        print("Integrity error {}:\n{}".format(e, comp_item))
            if max_iters == 0:
                print("Waiting...")
                time.sleep(11 * 60)
                print("Resuming...")
            max_iters = (max_iters + 1) % 2300

if __name__ == '__main__':
    main()