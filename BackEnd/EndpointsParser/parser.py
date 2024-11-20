#!/usr/bin/env python3
from .core import requester
from .core.extractor import Extractor
from .core import save_it
from .core import anchortags
from urllib.parse import unquote, urlparse
import json
import time
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

start_time = time.time()

# Declare final_uris as a global variable
final_uris = []

def init(domain, subs=None, level=None, exclude=None, output=None, placeholder=None, quiet=None, retries=None, vulns=None):
    global final_uris  # Declare the variable as global here

    # Prepare the URL for the Web Archive
    if subs == True or subs == "True":
        url = f"https://web.archive.org/cdx/search/cdx?url=*.{domain}/*&output=txt&fl=original&collapse=urlkey&page=/"
    else:
        url = f"https://web.archive.org/cdx/search/cdx?url={domain}/*&output=txt&fl=original&collapse=urlkey&page=/"

    # Find anchor links in the page
    alist = anchortags.FindLinksInPage(f'https://{domain}')

    retry = True
    response = None  

    # Attempt to connect to the Web Archive
    while retry and retries <= int(retries):
        response, retry = requester.connector(url)
        retries += 1
        
        # Check if the response was successful
        if response is not None:  # If we have a valid response
            break

    print(response)
    # If no valid response, call the crawler
    if response is None:
        print(f"Web Archive returned an error. Starting the crawler for the domain {domain}...")
        response = crawl_domain(domain)
        
    # Blacklist for extensions to exclude
    black_list = []
    if exclude:
        if "," in exclude:
            black_list = exclude.split(",")
            black_list = [f".{ext.strip()}" for ext in black_list]  # Clean each extension
        else:
            black_list.append(f".{exclude.strip()}")  # Clean single extension

    if exclude:
        print(f"\u001b[31m[!] URLs containing these extensions will be excluded from the results: {black_list}\u001b[0m\n")

    ex = Extractor()
    final_uris = ex.param_extract(response, level, black_list, placeholder)
    final_uris.extend(alist)
    final_uris = list(set(final_uris))  # Ensure unique URLs    

    if not quiet:
        print("\u001b[32;1m")
        print('\n'.join(final_uris))
        print("\u001b[0m")

    print(f"\n\u001b[32m[+] Total number of retries:  {retries - 1}\u001b[31m")
    print(f"\u001b[32m[+] Total unique URLs found: {len(final_uris)}\u001b[31m")
    print("\n\u001b[31m[!] Total execution time: %ss\u001b[0m" % str((time.time() - start_time))[:-12])

    if vulns:
        data = readFile(vulns)
        print(f"\u001b[32m[+] Potential endpoints for {vulns} are:\u001b[31m")
        vulnurl = ex.find_strings(final_uris, data["patterns"])
        print("\u001b[31m")
        print('\n'.join(vulnurl))
        return vulnurl

    if output:
        save_it.save_func(final_uris, output, domain)
        print(f"\u001b[32m[+] Output is saved here: \u001b[31m \u001b[36moutput/{output}\u001b[31m")
    else:
        print(f"\u001b[32m[+] Output not saved in any file.txt\u001b[31m")

    # Return final_uris in JSON format
    return final_uris

def crawl_domain(domain):
    """Crawls the specified domain and returns a list of unique full URLs."""
    allowed_domain = urlparse(domain).netloc
    visited_urls = set()
    urls_to_visit = [domain]

    def crawl_page(url):
        try:
            response = requests.get(url)
            response.raise_for_status()  # Raise an exception for HTTP errors
            soup = BeautifulSoup(response.content, "html.parser")
            full_urls = []
            for link in soup.find_all("a", href=True):
                next_url = urljoin(url, link["href"])  # Construct the full URL
                if urlparse(next_url).netloc == allowed_domain:
                    if next_url not in full_urls:  # Only add unique full URLs
                        full_urls.append(next_url)
            return full_urls
        except requests.exceptions.RequestException as e:
            print(f"Error crawling {url}: {e}")
            return []

    # Start crawling the site
    final_urls = []
    while urls_to_visit:
        current_url = urls_to_visit.pop(0)  # Dequeue the first URL

        if current_url in visited_urls:
            continue

        new_urls = crawl_page(current_url)
        visited_urls.add(current_url)
        final_urls.extend(new_urls)
        urls_to_visit.extend(new_urls)  # Add the new full URLs to the list to visit

    unique_urls = list(set(final_urls))
    return '\n'.join(unique_urls) + '\n'
    """Brute forces common PHP endpoints and returns them as a list."""
    common_php_files = [
        "login.php",
        "admin.php",
        "dashboard.php",
        "upload.php",
        "config.php",
        "register.php",
        "reset.php",
        "index.php"
    ]
    

    found_endpoints = []  # List to store found endpoints

    for php_file in common_php_files:
        url = urljoin(domain, php_file)  # Join the base URL with the endpoint
        print(url)
        try:
            response = requests.head(url)  # Use HEAD request to check existence without downloading
            if response.status_code == 200:
                print(f"\u001b[32m[+] Found PHP endpoint: {url}\u001b[0m")
                found_endpoints.append(url)  # Add to found_endpoints
            else:
                print(f"\u001b[31m[-] PHP endpoint not found: {url}\u001b[0m")
        except requests.exceptions.RequestException as e:
            print(f"Error checking {url}: {e}")

    return found_endpoints  # Return the list of found endpoints


def readFile(file):
    paths = {
        "openredirect": "EndpointsParser/profiles/redirect.json",
        "xss": "EndpointsParser/profiles/xss.json",
        "xxe": "EndpointsParser/profiles/xxe.json",
        "sqli": "EndpointsParser/profiles/sqli.json",
        "sqlipost": "EndpointsParser/profiles/sqlipost.json",
    }
    with open(paths[file]) as json_file:
        data = json.loads(json_file.read())
        return data
