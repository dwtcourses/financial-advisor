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


def security_row_to_sql_columns(row, ticker_to_id):
    """
    Convert row from security CSV to SQL columns

    Args:
        comp_json : raw row from securities csv download
        ticker_to_id : mapping from ticker to company_id
    Returns:
        dictionary mapping SQL columns to values, using dollar escaping for postgres
    """
    return {
        'figi_id': '$${}$$'.format(row[3]),
        'security_name': '$${}$$'.format(row[5]),
        'ticker': '$${}$$'.format(row[0]),
        'security_type': '$${}$$'.format(row[7]),
        'exchange': '$${}$$'.format(row[8]),
        'company_id': '$${}$$'.format(ticker_to_id[row[0]]) if row[0] in ticker_to_id else 'NULL'
    }

def main():
    # Open database connection using postgres configuration file
    postgres_config = load_json('../postgres_config.json')
    conn = open_database_connection(postgres_config)

    ticker_to_id = load_json('../data/ticker_to_id.json')

    # Retrieve all securities
    with open('../data/securities.csv', newline='') as csvfile:
        security_reader = csv.reader(csvfile, delimiter=',', quotechar='"')
        for row in security_reader:
            # Get id to use in insertion
            company_id = ticker_to_id.get(row[0], None)

            # Map fields to SQL column names
            security_item = security_row_to_sql_columns(row, ticker_to_id)

            with conn.cursor() as cur:
                # Insert values into the database
                try:
                    cur.execute("INSERT INTO security VALUES({figi_id}, {security_name}, {ticker}, {security_type}, {exchange}, {company_id});".format(**security_item))
                except psycopg2.IntegrityError as e:
                    print("Integrity error {}:\n{}".format(e, security_item))

if __name__ == '__main__':
    main()