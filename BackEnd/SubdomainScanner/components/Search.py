import requests
import urllib
from urllib.parse import urlparse
from requests_html import HTMLSession


class Search:
    """
    This class is used to scrape subdomains from Google, Bing and DuckDuckGo.
    """

    def __init__(self, url):
        self.url = url
        self.subdomains = []


    @staticmethod
    def return_source_code(query):
        """
        Return the source code for the provided URL. 

        Args: 
            url (string): URL of the page to scrape.

        Returns:
            response (object): HTTP response object from requests_html. 
        """

        try:
            session = HTMLSession()
            response = session.get(query)
            return response  # returns 200 if OK

        except requests.exceptions.RequestException as e:
            print(e)


    def scrape_google(self):
        query = urllib.parse.quote_plus(self.url)
        link = f'https://www.google.com/search?client=firefox-b-d&q=site:{query}'
        response = self.return_source_code(link)
        # getting all the links from search result
        links = list(response.html.absolute_links)
        return links



    def scrape_bing(self):
        query = urllib.parse.quote_plus(self.url)
        link = f'https://www.bing.com/search?q=site:{query}'
        response = self.return_source_code(link)
        links = list(response.html.absolute_links)
        return links


    def scrape_duckduckgo(self):
        query = urllib.parse.quote_plus(self.url)
        link = f'https://duckduckgo.com/html/?q=site:{query}'
        response = self.return_source_code(link)
        links = list(response.html.absolute_links)
        return links


    def extract_subdomains(self, urls):
        subdomains = set()  # use a set to remove duplicates
        for url in urls:
            parsed_url = urlparse(url)
            if parsed_url.netloc.endswith(self.url):  # check if the domain is of self.url
                subdomains.add(parsed_url.netloc)  # add the domain to the set
        return list(subdomains)


    def all(self):
        # scrape subdomains from google
        self.subdomains += self.scrape_google()
        # scrape subdomains from bing
        self.subdomains += self.scrape_bing()
        # scrape subdomains from duckduckgo
        self.subdomains += self.scrape_duckduckgo()
        # remove duplicates and sort the list
        self.subdomains = sorted(set(self.subdomains))
        return self.subdomains


    def domains(self):
       return self.extract_subdomains(self.all())


