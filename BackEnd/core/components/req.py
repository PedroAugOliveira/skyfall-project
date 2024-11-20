import urllib3
from urllib.parse import urlparse
from concurrent.futures import ThreadPoolExecutor, as_completed


class Requester:
    def __init__(self, url, template, headers, payloads, method, redirects):
        self.url = url
        self.template = template
        self.headers = headers
        self.payloads = payloads
        self.method = method
        self.redirects = redirects

    def send_request(self, http, payload):
        response = None

        try:
            if self.method == "GET":
                full_url = f"{self.url}{payload}"
                response = http.request('GET', full_url, headers=self.headers, redirect=self.redirects, timeout=5)

            elif self.method == "POST":
                p = urlparse(self.url)
                hostname = p.hostname
                self.headers['Host'] = hostname
                response = http.request('POST', self.url, headers=self.headers, body=payload, redirect=self.redirects, timeout=5)

        except (urllib3.exceptions.MaxRetryError, urllib3.exceptions.SSLError):
            http = urllib3.PoolManager(cert_reqs='CERT_NONE')
            response = http.request('POST', self.url, headers=self.headers, body=payload, redirect=self.redirects, timeout=5)

        except urllib3.exceptions.RequestError as e:
            print("A request error occurred:", e)

        except urllib3.exceptions.TimeoutError as e:
            print("The request timed out:", e)

        except urllib3.exceptions.ProtocolError as e:
            print("A protocol error occurred:", e)

        except urllib3.exceptions.DecodeError as e:
            print("An error occurred while decoding the response:", e)

        except urllib3.exceptions.SSLError as e:
            print("An SSL certificate verification error occurred:", e.reason)

        except urllib3.exceptions.HTTPError as e:
            print("An HTTP error occurred:", e)

        except Exception as e:
            print("An unknown error occurred:", e)

        return payload, response

    def req(self):
        responses = {}
        http = urllib3.PoolManager()

        with ThreadPoolExecutor(max_workers=50) as executor:
            future_responses = {executor.submit(self.send_request, http, payload): payload for payload in self.payloads}

            for future in as_completed(future_responses):
                try:
                    payload, response = future.result()
                    if response:
                        responses[payload] = {"headers": dict(response.headers.items()), "status": response.status, "data": response.data}
                except Exception as e:
                    print("An error occurred:", e)

        try:
            return responses, response.data
        except:
            return responses, None
