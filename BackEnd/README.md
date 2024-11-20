

## Features

-   Intuitive **command-line interface** for quick vulnerability assessment
-   Web-based **user interface** for an easy-to-use experience
-   **Flask-based API** for automated vulnerability scanning
-   Efficient **subdomain scanner** to discover hidden or non-obvious subdomains
-   Accurate **endpoint parser** to identify endpoints with injectable parameters
-   Powerful **vulnerability scanner** that tests for **open redirect**, **reflected and stored XSS**, **SQL injection (union and blind)**, and **XML external entity (XXE)** vulnerabilities
-   Flexible and extensible architecture that supports additional vulnerability assessments

## Architecture

SkyFall is designed with a modular and extensible architecture that enables the development of different components, each focused on specific tasks. The tool is composed of the following components:

### Subdomain Scanner

The **subdomain scanner** component of SkyFall takes a URL and returns its endpoints. It scans the specified domain for subdomains, using a combination of brute-force and dictionary-based techniques to discover hidden or non-obvious subdomains.

#### Subcomponents:

-   `search.py`
-   `shodan.py`
-   `subdomains.py`

```
🗂️ Subdomain Scanner
├─ 📁 components
│   ├── 🐍 Search.py
│   └── 🐍 Shodan.py
└─ 🐍 subdomains.py
```

### Endpoint Parser

The **endpoint parser** component of SkyFall takes a URL and provides a list of injectable endpoints. It analyzes the endpoints discovered by the subdomain scanner and identifies any that are vulnerable to attack.

#### Subcomponents:

-   `anchortags.py`
-   `extractor.py`
-   `requester.py`
-   `save_it.py`
-   `potential.json`
-   `redirect.json`
-   `parser.py`

```
🗂️ Endpoint Parser
├─ 📁 components
│   ├── 🐍 anchortags.py
│   ├── 🐍 extractor.py
│   ├── 🐍 requester.py
│   └── 🐍 save_it.py
├─ 📁 profiles
│   ├── 📄 potential.json
│   └── 📄 redirect.json
└─ 🐍 parser.py
```

### core

The **core** component of SkyFall is the core of the tool. It is responsible for vulnerability scanning and detection. The core takes a list of injectable endpoints and tests them for known vulnerabilities, including **open redirects**, **reflected and stored XSS**, **SQL injection (union and blind)**, and **XML external entity (XXE)**. The core generates a report that details any vulnerabilities found, including the affected pages, the severity of the vulnerability, and recommendations for remediation.

#### Subcomponents:

-   `blueprint` folder
-   `components` folder:
    -   `reader.py`
    -   `req.py`
    -   `matcher.py`
-   `scan.py`

```
🗂️ core
├─ 📁 Blueprint folder
│   ├── 📄 open_redirect.json
│   ├── 📄 reflected_xss.json
│   ├── 📄 stored_xss.json
│   ├── 📄 sqli_blind.json
│   ├── 📄 sqli_union.json
│   └── 📄 xxe.json
├─ 📁 Components folder
│   ├── 🐍 reader.py
│   ├── 🐍 req.py
│   └── 🐍 matcher.py
└─ 🐍 scan.py
```
### Command-Line Interface

The **command-line interface** provides a way to interact with SkyFall using the command line. It allows users to specify a target URL and select which vulnerabilities to scan for. The command-line interface is built using the `argparse` module and can be accessed by running `python3 main.py` in the command line. Users can specify the target URL and choose which vulnerabilities to scan for using command-line arguments. Once the scan is complete, the command-line interface displays a summary of the vulnerabilities found.

### Flask-Based API

The **Flask-based API** provides a way to interact with SkyFall programmatically. It accepts HTTP requests and returns JSON responses containing information about the vulnerabilities found. The API has several endpoints, including:
-   `/base` - Returns version information about SkyFall.
-   `/signin` - Allows users to sign in to the SkyFall system using their credentials.
-   `/signup` - Allows users to sign up for the SkyFall system by providing their credentials.
-   `/signout` - Allows users to sign out of the SkyFall system.
-   `/api/subdomains` - Returns all the subdomains found for a given URL.
-   `/api/endpoints` - Returns all the endpoints with injectable parameters found for a given URL.
-   `/api/scan` - Initiates a vulnerability scan for a given URL and returns the results in JSON format. Users can specify which vulnerabilities to scan for by providing command-line arguments.

```
🗂️ Flask-Based API
├── 🐍 app.py
├── 🐍 auth.py
├── 📄 server.log
└── 🗂️ Database
    ├── api.db
    ├── subdomains.db
    └── users.db
```

### Tree diagram

```
🌐 SkyFall
├─ 🗂️ Subdomain Scanner
│   ├── 📁 components
│   │   ├── 🐍 Search.py
│   │   └── 🐍 Shodan.py
│   └── 🐍 subdomains.py
├─ 🗂️ Endpoint Parser
│   ├── 📁 components
│   │   ├── 🐍 anchortags.py
│   │   ├── 🐍 extractor.py
│   │   ├── 🐍 requester.py
│   │   └── 🐍 save_it.py
│   ├── 📁 profiles
│   │   ├── 📄 potential.json
│   │   └── 📄 redirect.json
│   └── 🐍 parser.py
├─ 🗂️ core
│   ├── 📁 Blueprint folder
│   │   ├── 📄 open_redirect.json
│   │   ├── 📄 reflected_xss.json
│   │   ├── 📄 stored_xss.json
│   │   ├── 📄 sqli_blind.json
│   │   ├── 📄 sqli_union.json
│   │   └── 📄 xxe.json
│   ├── 📁 Components folder
│   │   ├── 🐍 reader.py
│   │   ├── 🐍 req.py
│   │   └── 🐍 matcher.py
│   └── 🐍 scan.py
├─ 🗂️ Command-Line Interface
│   └── 🐍 main.py
├─ 🗂️ Flask-Based API
│   ├── 🐍 app.py
│   ├── 🐍 auth.py
│   ├── 📄 server.log
├─ 🗂️ React-Based Front-End
└─ 🗂️ Database
    ├── api.db
    ├── subdomains.db
    └── users.db

```



