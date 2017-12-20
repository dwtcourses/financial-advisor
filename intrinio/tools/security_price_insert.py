import csv
import requests
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

def get_price(ticker, limit, intrinio_cred):
    """
    Get historical price data mapped to SQL columns

    Args:
        ticker : ticker symbol
        intrinio_cred : dictionary with intrinio credentials

    Returns:
        list of prices in dict format mapped to SQL columns
    """
    CLOSE_PRICE_ENDPOINT = 'https://api.intrinio.com/historical_data'
    page_number = 1
    result = {}
    prices = []
    while page_number < min(result.get('total_pages', float('inf')), limit):
        # Request data
        url = CLOSE_PRICE_ENDPOINT
        auth = (intrinio_cred['API_USER'], intrinio_cred['API_KEY'])
        payload = {
            'identifier': ticker,
            'item': 'close_price',
            'page_number': page_number
        }
        result = requests.get(url, params=payload, auth=auth).json()
        # Conver to SQL column names
        try:
            prices.extend([{'end_of_date': datapoint['date'], 'price': datapoint['value']} for datapoint in result['data']])
        except:
            break
        page_number += 1

    return prices


def main():
    creds_list = [
        '../intrinio_credentials.json',
        '../intrinio_credentials1.json',
        '../intrinio_credentials2.json',
        '../intrinio_credentials3.json',
        '../intrinio_credentials4.json',
        '../intrinio_credentials5.json',
        '../intrinio_credentials6.json',
        '../intrinio_credentials7.json',
        '../intrinio_credentials8.json',
        '../intrinio_credentials9.json',
        '../intrinio_credentials10.json',
        '../intrinio_credentials11.json',
        '../intrinio_credentials12.json',
        '../intrinio_credentials13.json',
        '../intrinio_credentials14.json',
        '../intrinio_credentials15.json',
        '../intrinio_credentials16.json',
        '../intrinio_credentials17.json',
        '../intrinio_credentials18.json',
        '../intrinio_credentials19.json',
        '../intrinio_credentials20.json',
    ]
    creds_idx = 0

    # Load credentials for Intrinio API
    intrinio_cred = load_json(creds_list[creds_idx])

    # Open database connection using postgres configuration file
    postgres_config = load_json('../postgres_config.json')
    conn = open_database_connection(postgres_config)

    # Retrieve all securities
    with open('../data/securities.csv', newline='') as csvfile:
        security_reader = csv.reader(csvfile, delimiter=',', quotechar='"')
        for row in security_reader:
            # Get ticker to search
            ticker = row[0]

            while creds_idx < len(creds_list):
                try:
                    limit = 2
                    prices = get_price(ticker, limit, intrinio_cred)
                    break
                except:
                    print('Retry same one...')
                    creds_idx += 1
                    intrinio_cred = load_json(creds_list[creds_idx])


            with conn.cursor() as cur:
                cur.execute("SELECT figi_id FROM security WHERE ticker = '{ticker}'".format(ticker=ticker))
                result = cur.fetchone()
                if result is not None:
                    figi_id = result[0]
                    # Insert values into the database
                    for price in prices:
                        try:
                            cur.execute("INSERT INTO price VALUES('{figi_id}', '{end_of_date}', {price});".format(figi_id=figi_id, **price))
                        except psycopg2.IntegrityError as e:
                            pass
                            # print("Integrity error {}:\n{}".format(e, price))

if __name__ == '__main__':
    main()