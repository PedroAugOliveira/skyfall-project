import socket
import requests
import json
import sqlite3
from rich.table import Table
from rich import print_json
from rich.console import Console
from .components.Search import Search
from .components.Shodan import Shodan



class Subdomains:
    def __init__(self,url):
        self.url=url
        self.db_conn = sqlite3.connect('././Database/subdomains.db')
        self.create_table_if_not_exists()
        
    def get_http_status_code(self, domain):
        try:
            response = requests.get(f'http://{domain}',timeout=2)
            return response.status_code
        except:
            return 'N/A'


    def get_server(self, domain):
        try:
            response = requests.get(f'http://{domain}',timeout=2)
            server = response.headers['Server']
            return server
        except:
            return 'N/A'


    def listOfSubdomains(self,*lists):
        # Create an empty set to store the unique values
        unique_values = set()
        
        # Iterate over all of the lists and add their values to the set
        for lst in lists:
            unique_values.update(lst)
        
        # Convert the set back to a list and return it
        return list(unique_values)


    def process_subdomain(self, subdomain):
        try:
            ip_address = socket.gethostbyname(subdomain)
            code = self.get_http_status_code(subdomain)
            server = self.get_server(subdomain)
        except:
            ip_address = 'N/A'
            code = 'N/A'
            server = 'N/A'

        output = (ip_address, str(code), subdomain, server)
        return output
    

    def main(self):
        from rich.live import Live
        list1=Search(self.url).domains()
        list2=Shodan(self.url).shodan_search()
        list3=Shodan(self.url).virus_total()
        subdomains=self.listOfSubdomains(list1,list2,list3)
        # Create the table and add the headings
        table = Table(show_header=True, header_style="bold red")
        table.add_column("Ip address", style="bold white", width=15)
        table.add_column("Code", style="bold white", width=4)
        table.add_column("Subdomain", style="bold white", width=35)
        table.add_column("Server", style="bold white", width=30)

        with Live(table, refresh_per_second=3):
            for subdomain in subdomains:
                result = self.process_subdomain(subdomain)
                table.add_row(*result)


    def create_table_if_not_exists(self):
        query = '''CREATE TABLE IF NOT EXISTS subdomains (
                        id INTEGER PRIMARY KEY,
                        url TEXT,
                        subdomain TEXT,
                        ip_address TEXT,
                        code TEXT,
                        server TEXT
                    )'''
        self.db_conn.execute(query)
        self.db_conn.commit()
        
        
    def insert_subdomains(self, subdomains):
        for subdomain in subdomains:
            ip_address, code, subdomain, server = self.process_subdomain(subdomain)
            query = f"INSERT INTO subdomains(url, subdomain, ip_address, code, server) VALUES ('{self.url}', '{subdomain}', '{ip_address}', '{code}', '{server}')"
            self.db_conn.execute(query)
        self.db_conn.commit()


    def get_subdomains_from_db(self):
        query = f"SELECT * FROM subdomains WHERE url='{self.url}'"
        cursor = self.db_conn.execute(query)
        rows = cursor.fetchall()
        subdomain_data = []
        for row in rows:
            subdomain_data.append({
                "ip_address": row[2],
                "code": row[3],
                "subdomain": row[4],
                "server": row[5]
            })
        return subdomain_data


    def forAPI(self):
        query = f"SELECT COUNT(*) FROM subdomains WHERE url='{self.url}'"
        cursor = self.db_conn.execute(query)
        count = cursor.fetchone()[0]
        if count == 0:
            list1=Search(self.url).domains()
            list2=Shodan(self.url).shodan_search()
            list3=Shodan(self.url).virus_total()
            subdomains=self.listOfSubdomains(list1,list2,list3)
            self.insert_subdomains(subdomains)
            subdomains=self.get_subdomains_from_db()
        else:
            subdomains = self.get_subdomains_from_db()
        return subdomains
    
