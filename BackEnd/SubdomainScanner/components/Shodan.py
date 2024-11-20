SHODAN_API_key = 'your_shodan_api_key'
VIRUSTOTAL_API = 'your_virustotal_api_key'

import requests


class Shodan:
    def __init__(self,url):
        self.url=url


    def shodan_search(self,api=SHODAN_API_key):
        # use Shodan API to search for subdomains and return a list of subdomains
        subdomains = []
        try:
           r = requests.get('https://api.shodan.io/dns/domain/'+self.url+'?key='+api)
           subdomains = r.json()['subdomains'] 
        except Exception as e:
            return []
        return subdomains


    def virus_total(self, api=VIRUSTOTAL_API):
        try:
            response=requests.get(f'https://www.virustotal.com/vtapi/v2/domain/report?apikey={api}&domain={self.url}')
            response=response.json()
            subdomains=response['subdomains']
            return subdomains
        except Exception as e:
            return []




