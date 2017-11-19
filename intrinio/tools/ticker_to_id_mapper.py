import csv
import requests
from requests.auth import HTTPBasicAuth
import json
import psycopg2
import time
import json

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

def main():
    # Open database connection using postgres configuration file
    postgres_config = load_json('../postgres_config.json')
    conn = open_database_connection(postgres_config)

    # Retrieve all companies
    mapping = {}
    with open('../data/companies.csv', newline='') as csvfile:
        company_reader = csv.reader(csvfile, delimiter=',', quotechar='"')
        for row in company_reader:
            # Get company ID based on company name
            company_name = row[1]

            with conn.cursor() as cur:
                cur.execute("SELECT * FROM company WHERE company_name=$${company_name}$$;".format(company_name=company_name))
                res = cur.fetchone()
                if res is not None:
                    mapping[row[0]] = res[0]
    # Write result to file
    with open('ticker_to_id.json', 'w') as outfile:
        json.dump(mapping, outfile)

if __name__ == '__main__':
    main()