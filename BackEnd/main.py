import argparse
from rich import console
from utils.logger import Logger
from EndpointsParser.parser import init
from EndpointsParser.core import * 
from SubdomainScanner.subdomains import Subdomains
from core.scan import Scan
from rich import print_json


c=console.Console()


class Argparse():
    """
    This class is used to parse the arguments from the command line
    """
    def __init__(self):
      logger = Logger()
      self.parser=argparse.ArgumentParser(logger.banner(),formatter_class=argparse.RawTextHelpFormatter)
      subparser=self.parser.add_subparsers(dest="command",required=True)

      # Subdomain Scanner parsing
      subdomain_parser=subparser.add_parser("subdomain",help="Subdomain Scanner")
      subdomain_parser.add_argument("-s","--subdomains",help="Find Subdomains of a website",action="store",type=str,required=True)
      subdomain_parser.add_argument("-u","--url",help="URL of the website",action="store",type=str)

      # for Endpoint Parser
      endpoint_parser=subparser.add_parser("endpoints",help="Endpoint Parser")
      endpoint_parser.add_argument('-u','--url' , help = 'Domain name of the taget [ex : hackerone.com]' , required=True)
      endpoint_parser.add_argument('-s' ,'--subs' , help = 'Set False for no subs [ex : --subs False ]' , default=True)
      endpoint_parser.add_argument('-l','--level' ,  help = 'For nested parameters [ex : --level high]')
      endpoint_parser.add_argument('-e','--exclude', help= 'extensions to exclude [ex --exclude php,aspx]')
      endpoint_parser.add_argument('-o','--output' , help = 'Output file name [by default it is \'domain.txt\']')
      endpoint_parser.add_argument('-p','--placeholder' , help = 'The string to add as a placeholder after the parameter name.', default = "")
      endpoint_parser.add_argument('-q', '--quiet', help='Do not print the results to the screen', action='store_true')
      endpoint_parser.add_argument('-r', '--retries', help='Specify number of retries for 4xx and 5xx errors', default=3)
      endpoint_parser.add_argument('-v','--vulns', help='Find Vulnerabilities in the endpoints', choices=['openredirect','xss','sqli','xxe'],default=None)

      # for Vulnerability Scanner core
      vuln_parser=subparser.add_parser("core",help="Vulnerability Scanner core")
      vuln_parser.add_argument("-u","--url",help="URL of the website",action="store",type=str,required=True)
      vuln_parser.add_argument("-v","--vulns",help="Find Vulnerabilities in the endpoints", choices=['openredirect','xss','sqli','xxe'],required=True)
      vuln_parser.add_argument("-o","--output",help="Output file name [by default it is \'domain.txt\']",action="store",type=str)
      vuln_parser.add_argument("-p","--payload",help="Payload to test the vulnerability",action="store",type=str)
      

    def validateURL(self,url):
      import re
      r = re.compile(
        r'^(https?://)'  # http:// or https://
        r'([a-zA-Z0-9.-]+)'  # domain...
        r'(\.[a-zA-Z]{2,6})'  # ...with a TLD of 2 to 6 chars
        r'(:[0-9]{1,5})?'  # optional port
        r'(\/[-a-zA-Z0-9@:%._\+~#?&//=]*)?$'  # optional path
      )
  
      if (re.search(r, url)):
          return True
      else:
          return False




def main():
  arg=Argparse()
  args=arg.parser.parse_args()

  #for subdomain enumeration
  if args.command=="subdomain":
    if args.subdomains:
      if arg.validateURL(args.subdomains):
        if args.subdomains.startswith("http://"):
          args.subdomains=args.subdomains.replace("http://","")
          Subdomains(args.subdomains).main()
        elif args.subdomains.startswith("https://"):
          args.subdomains=args.subdomains.replace("https://","")
          Subdomains(args.subdomains).main()
      else:
        c.print("[!] Invalid URL entered",style="bold red")
        c.print("[>] Example : example.com or http://example.com",style="bold green")
 

  # #for endpoint parsing
  elif args.command=="endpoints":
    init(args.url, args.subs, args.level, args.exclude, args.output, args.placeholder, args.quiet, args.retries,args.vulns)

  elif args.command=="core":
    _path={
      "openredirect":"core/blueprints/openredirect.json",
      "xss":"core/blueprints/xss.json",
      "xss":"core/blueprints/xss.json",
      "sqli":"core/blueprints/sqli.json",
      "xxe":"core/blueprints/xxe.json",
      "sqlipost":"core/blueprints/sqlipost.json"
    }
    res=Scan(args.url,_path[args.vulns]).main()
    print_json(res)



if __name__=='__main__':
    main()
