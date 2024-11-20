import json
import sqlite3
from core.scan import Scan
from EndpointsParser.parser import init
from SubdomainScanner.subdomains import Subdomains
from flask import Flask, request, jsonify, Response, redirect, url_for,session
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from auth import db, User
from flask_session import Session
from flask_cors import CORS  # Import CORS
from flask import make_response
from functools import wraps
import logging

app = Flask(__name__)
CORS(app, supports_credentials=True)  # Enable CORS for all routes with credentials support


  # Enable CORS for all routes

app.config['SECRET_KEY'] = 'mysecretkey'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///C:/projetos/SkyFall-Project/BackEnd/Database/users.db'
app.config['SQLALCHEMY_POOL_SIZE'] = 10  # Número máximo de conexões no pool
app.config['SQLALCHEMY_POOL_TIMEOUT'] = 10  # Tempo máximo para aguardar uma conexão disponível (em segundos)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Desativa o rastreamento de modificações para economizar memória

app.config['SESSION_TYPE'] = 'filesystem'  # Add this line to configure the session type
Session(app)  # Add this line to initialize Flask-Session

# Initialize Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'signin'

db.init_app(app)

# Configuring logging
logging.basicConfig(filename='server.log', level=logging.INFO)
file_handler = logging.FileHandler('server.log')
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
file_handler.setFormatter(formatter)
app.logger.addHandler(file_handler)

# Configuring database
DATABASE = 'Database/api.db'

def get_db():
    conn = sqlite3.connect(DATABASE)  # connect to database
    conn.row_factory = sqlite3.Row
    return conn


@app.before_first_request
def setup_db():
    with app.app_context():
        db.create_all()


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


def api_login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if current_user.is_authenticated:
            return f(*args, **kwargs)
        else:
            response = jsonify({"status": "error", "message": "Authentication required"})
            response.status_code = 401
            return response

    return decorated_function


@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    return response




@app.route('/signin', methods=['POST', 'OPTIONS'])
def signin():
    # Check if the user is already logged in
    if current_user.is_authenticated:
        response = jsonify({"status": "success", "message": "Already logged in"})
        response.headers["Access-Control-Allow-Origin"] = "http://localhost:3000" # Add the CORS header
        return response, 200

    # Handle OPTIONS request for CORS
    if request.method == 'OPTIONS':
        response = make_response("", 204)
        response.headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
        response.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        response.headers["Access-Control-Allow-Credentials"] = "true"
        return response

    # Handle POST request for sign-in
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if user and user.check_password(data['password']):
        login_user(user)
        session['user_id'] = user.id  # Store user_id in session
        response = jsonify({"status": "success", "message": "Logged in successfully"})
        response.headers["Access-Control-Allow-Origin"] = "http://localhost:3000" # Add the CORS header
        return response, 200
    else:
        response = jsonify({"status": "error", "message": "Invalid email or password"})
        response.headers["Access-Control-Allow-Origin"] = "http://localhost:3000" # Add the CORS header
        response.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        response.headers["Access-Control-Allow-Credentials"] = "true"
        return response, 401




@app.route('/api/check-auth')
def check_auth():
    if current_user.is_authenticated:
        return jsonify({"status": "success", "user_id": current_user.id}), 200
    else:
        return jsonify({"status": "error", "message": "User not authenticated"}), 401



@app.route('/signout', methods=['POST'])
@login_required
def signout():   
    logout_user()
    session.pop('user_id', None)  # Remove user_id from session
    return jsonify({"status": "success", "message": "Logged out successfully"}), 200

    

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data['email']
    password = data['password']

    print(f"Signup attempt for email: {email}")  # Add this line

    user = User.query.filter_by(email=email).first()

    if user:
        print(f"User already exists: {user}")  # Add this line
        return jsonify({"status": "error", "message": "Email already exists"}), 409
    
    new_user = User(email=email)
    new_user.set_password(password)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"status": "success", "message": "User created successfully"}), 201


HTTP_METHODS = ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'CONNECT', 'OPTIONS', 'TRACE', 'PATCH']


@app.route('/', methods=HTTP_METHODS)
def index():
    return redirect(url_for('base'))

@app.route('/base', methods=HTTP_METHODS)
@login_required
def base():
    with open('version.conf') as f:
        version = f.read()
    return {
        "Server": "SkyFall API server",
        "Version": version
    }



@app.route('/api/subdomains', methods=['POST','GET'])
@api_login_required
def subdomains():
    if request.method == 'POST':
        try:
            content_type=request.headers.get('Content-Type')
            if content_type == 'application/json':
                data=request.json
            else:
                data=request.form.to_dict() 
            if data==None or data=={}:
                return {
                    "status": "error",
                    "message": "No data provided"
                },500
            
            if not data.get('url'):
                return {
                    "status": "error",
                    "message": "No url provided"
                },500
            elif not data.get('aggressive'):
                aggressive=False
            elif data.get('aggressive')=='true':
                aggressive=True
            elif data['url']=="": 
                return {
                    "status": "error",
                    "message": "No url provided"
                },500
            # try:
            #     subdomains = Shodan(data['url']).SearchDomains()
            # except:
            subdomains = Subdomains(data["url"]).forAPI()
            return {
                "status": "success",
                "message": "Subdomains found",
                "data": subdomains
            },200
        except Exception as E:
            return {
                "status" : "error",
                "Details" : f'Invalid Request. Error: {E}'
            }, 500
    elif request.method == 'GET':
        with open('Found_Subdomains.json') as f:
            data = json.load(f)
        return {
            "status": "success",
            "message": "Subdomains found",
            "data": data
        },200



@app.route('/api/endpoints', methods=['POST'])
@api_login_required
def endpoints():
    try:
        content_type=request.headers.get('Content-Type')
        if content_type == 'application/json':
            data=request.json
        else:
            data=request.form.to_dict()
        # check if any of the parameters are missing or none
        if data==None or data=={}:
            return {
                "status": "error",
                "message": "No data provided"
            },500
        if not data.get('url') or data['url']=="":
            return {
                "status": "error",
                "message": "No url provided"
            },500
        # defining the default values for optional parameters
        values={
            'subs':True,
            'level':None,
            'exclude':None,
            'output':None,
            'placeholder':"",
            'quiet':None,
            'retries':3,
            'vulns':None
        }
        # parse optional parameters like subs=None,level=None,exclude=None,output=None,placeholder=None,quiet=None,retries=None,vulns=None
        if data.get('subs') and data['subs']=='false':
            # update the value of subs in values
            values['subs']=data['subs']
        if data.get('level'):
            values['level']=data['level']
        if data.get('exclude'):
            values['exclude']=data['exclude']
        if data.get('output'):
            values['output']=data['output']
        if data.get('placeholder'):
            values['placeholder']=data['placeholder']
        if data.get('quiet'):   
            values['quiet']=data['quiet']
        # making sure user doesn't enter a negative value for retries or a value greater than 5
        if data.get('retries') and int(data['retries'])>0 and int(data['retries'])<=5:
            values['retries']=data['retries']

        # making sure that vulns if from ['openredirect','xss','sqli','xxe']
        if data.get('vulns') and data['vulns'] in ['openredirect','xss','sqli','xxe','xss','sqlipost']:
            values['vulns']=data['vulns']
        # calling the init function from parser.py
        data=init(
            data['url'],
            subs=values['subs'],
            level=values['level'],
            exclude=values['exclude'],
            output=values['output'],
            placeholder=values['placeholder'],
            quiet=values['quiet'],
            retries=values['retries'],
            vulns=values['vulns']
        )
        response = make_response({
            "status": "success",
            "message": "Endpoints found",
            "data": data
        },200)
        response.headers["Access-Control-Allow-Origin"] = "http://localhost:3000"  # Add the header
        return response
    except Exception as E:
        return {
            "status" : "error",
            "Details" : f'Invalid Request. Error: {E}'
        }, 500

    
@app.route('/api/scan', methods=['POST'])
@api_login_required
def scan():
    content_type = request.headers.get('Content-Type')
    if content_type == 'application/json':
        data = request.json
    else:
        data = request.form.to_dict()
    if data is None or data == {}:
        return {
            "status": "error",
            "message": "No data provided"
        }, 500
    if not data.get('url') or data['url'] == "":
        return {
            "status": "error",
            "message": "No url provided"
        }, 500
    if not data.get('vuln') or data['vuln'] == "":
        return {
            "status": "error",
            "message": "No vulnerabilities specified"
        }, 500

    path = {
        'openredirect': 'core/blueprints/openredirect.json',
        'xxe': 'core/blueprints/xxe.json',
        "sqli": "core/blueprints/sqli.json",
        "sqlipost": "core/blueprints/sqlipost.json",
        "xss": "core/blueprints/xss.json"
    }

    vuln_list = [v.strip() for v in data['vuln'].split(',')]

    for vuln in vuln_list:
        if vuln not in path:
            return {
                "status": "error",
                "message": f"Invalid vulnerability specified: {vuln}"
            }, 500

    results = []
    for vuln in vuln_list:
        res = Scan(data['url'], path[vuln]).main()
        res_data = json.loads(res)
        if res_data.get("vulnerability"):
            update_vulnerability_count(vuln)  # Update vulnerability count when a vulnerability is found
        results.append({"vuln": vuln, "data": res_data})

    Scan.increment_scan_count()

    return {
        "status": "success",
        "message": "Scan completed",
        "results": results
    }, 200




@app.route('/api/deepscan', methods=['POST'])
@api_login_required
def deepscan():
    content_type = request.headers.get('Content-Type')
    
    # Captura os dados dependendo do tipo de conteúdo
    if content_type == 'application/json':
        data = request.json
    else:
        data = request.form.to_dict()

    # Verifica se os dados foram enviados corretamente
    if data is None or data == {}:
        return {
            "status": "error",
            "message": "No data provided"
        }, 500

    if not data.get('url') or data['url'] == "":
        return {
            "status": "error",
            "message": "No URL provided"
        }, 500

    if not data.get('vuln') or data['vuln'] == "":
        return {
            "status": "error",
            "message": "No vulnerabilities specified"
        }, 500

    # Lista de vulnerabilidades permitidas
    allowed_vulns = ['openredirect', 'xss', 'sqli', 'xxe', 'sqlipost']
    
    # Separação e validação das vulnerabilidades enviadas
    if data.get('vuln'):
        vulns = [v.strip() for v in data['vuln'].split(',')]
        invalid_vulns = [v for v in vulns if v not in allowed_vulns]

        if invalid_vulns:
            return {
                "status": "error",
                "message": f"Invalid value(s) for vulns: {', '.join(invalid_vulns)}"
            }, 500

    # Caminhos para os scans de cada vulnerabilidade
    path = {
        'openredirect': 'core/blueprints/openredirect.json',
        'xxe': 'core/blueprints/xxe.json',
        "sqli": "core/blueprints/sqli.json",
        "sqlipost": "core/blueprints/sqlipost.json",
        "xss": "core/blueprints/xss.json"
    }

    # Parâmetros para o scan
    values = {
        'subs': True,
        'level': None,
        'exclude': None,
        'output': None,
        'placeholder': "",
        'quiet': None,
        'retries': 3,
        'vulns': None
    }

    results = []

    # Loop para rodar o scan em cada vulnerabilidade separadamente
    for vuln in vulns:
        # Inicializa os endpoints para a vulnerabilidade atual
        vuln_endpoints = init(
            data['url'],
            subs=values['subs'],
            level=values['level'],
            exclude=values['exclude'],
            output=values['output'],
            placeholder=values['placeholder'],
            quiet=values['quiet'],
            retries=values['retries'],
            vulns=vuln  # Envia a vulnerabilidade específica para inicializar seus endpoints
        )

        # Roda o scan para cada endpoint relacionado a essa vulnerabilidade
        for endpoint in vuln_endpoints:
            res = Scan(endpoint, path[vuln]).main()  # Roda o scan para o endpoint atual e a vulnerabilidade específica
            res_data = json.loads(res)
            if res_data.get("vulnerability"):
                update_vulnerability_count(vuln)
            results.append({"vuln": vuln, "data": res_data})

    # Incrementa o contador de scans
    Scan.increment_scan_count()

    return {
        "status": "success",
        "message": "Scan completed",
        "results": results
    }, 200


vulnerability_counts = {
    "sqli": 0,
    "xxe": 0,
    "xss": 0,
    "openredirect": 0,
    "sqlipost" : 0
}



def update_vulnerability_count(vuln_type):
    conn = sqlite3.connect('Database/scan.db')
    cursor = conn.cursor()

    # Create the table if it doesn't exist
    cursor.execute('''CREATE TABLE IF NOT EXISTS vulnerability_counts (
        vuln_type TEXT PRIMARY KEY,
        count INTEGER DEFAULT 0
    );''')

    # Check if the vulnerability type exists in the table
    cursor.execute("SELECT count FROM vulnerability_counts WHERE vuln_type = ?", (vuln_type,))
    row = cursor.fetchone()

    if row is None:
        # Insert the vulnerability type with an initial count of 1
        cursor.execute("INSERT INTO vulnerability_counts (vuln_type, count) VALUES (?, 1)", (vuln_type,))
    else:
        # Update the count for the vulnerability type
        cursor.execute("UPDATE vulnerability_counts SET count = count + 1 WHERE vuln_type = ?", (vuln_type,))

    conn.commit()
    conn.close()



# Analytics 
@app.route("/total_scans", methods=["GET"])
@api_login_required
def get_total_scans():
    return jsonify({"total_scans": Scan.get_total_scan()})


@app.route('/total_users', methods=['GET'])
@api_login_required
def get_total_users():
    total_users = User.query.count()
    return jsonify({"total_users": total_users})

@app.route('/total_revenue', methods=['GET'])
@api_login_required
def get_total_revenue():
    return jsonify({"total_revenue": 0})

@app.route('/total_followers', methods=['GET'])
@api_login_required
def get_total_followers():
    return jsonify({"total_followers": 0})


@app.route('/scan_durations', methods=['GET'])
@api_login_required
def get_scan_durations():
    conn = sqlite3.connect("Database/scan.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM scan_durations")
    result = cursor.fetchall()
    conn.close()

    # Prepare a lista de dicionários para cada scan
    scan_durations = [
        {
            "scan_id": scan_id,
            "url": url,
            "start_time": start_time,
            "end_time": end_time,
            "duration": duration,
            "status_code": status_code,
            "num_failures": num_failures,
            "num_redirects": num_redirects,
            "match_count": match_count
        }
        for scan_id, url, start_time, end_time, duration, status_code, num_failures, num_redirects, match_count in result
    ]
    
    return jsonify({"scan_durations": scan_durations})



@app.route('/api/vulnerability_count', methods=['GET'])
@api_login_required
def get_vulnerability_count():
    conn = sqlite3.connect('Database/scan.db')
    cursor = conn.cursor()

    cursor.execute("SELECT vuln_type, count FROM vulnerability_counts")
    rows = cursor.fetchall()

    vulnerability_counts = {row[0]: row[1] for row in rows}

    conn.close()

    return {
        "status": "success",
        "message": "Vulnerability count retrieved",
        "counts": vulnerability_counts
    }, 200
