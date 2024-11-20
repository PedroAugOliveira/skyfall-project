import re
import json
import time
import sqlite3
import asyncio
from rich import print_json
from .components import req
from .components import matcher
from .components.reader import Reader

# Configuração do banco de dados
def setup_db():
    conn = sqlite3.connect("./Database/scan.db")
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS scan_count (total INTEGER)''')
    cursor.execute('''CREATE TABLE IF NOT EXISTS scan_durations (
                        scan_id INTEGER PRIMARY KEY AUTOINCREMENT, 
                        url TEXT, 
                        start_time REAL, 
                        end_time REAL, 
                        duration REAL, 
                        status_code INTEGER, 
                        num_failures INTEGER,
                        num_redirects INTEGER, 
                        match_count INTEGER
                     )''')
    conn.commit()
    cursor.execute("SELECT total FROM scan_count")
    if cursor.fetchone() is None:
        cursor.execute("INSERT INTO scan_count (total) VALUES (0)")
        conn.commit()
    conn.close()


# Atualiza a contagem de scans no banco de dados
def update_db_scan_count(count):
    conn = sqlite3.connect("./Database/scan.db")
    cursor = conn.cursor()
    cursor.execute("UPDATE scan_count SET total=?", (count,))
    conn.commit()
    conn.close()

# Armazena a duração do scan no banco de dados
def store_scan_data(url, start_time, end_time, duration, status_code, num_failures, num_redirects, match_count):
    conn = sqlite3.connect("./Database/scan.db")
    cursor = conn.cursor()
    cursor.execute('''INSERT INTO scan_durations (
                        url, 
                        start_time, 
                        end_time, 
                        duration, 
                        status_code, 
                        num_failures, 
                        num_redirects, 
                        match_count
                      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)''', 
                      (url, start_time, end_time, duration, status_code, num_failures, num_redirects, match_count))
    conn.commit()
    conn.close()


class Scan:
    total_scan = 0

    def __init__(self, url, template):
        self.url = url
        self.template = template
        if not self.isValidUrl():
            print("Invalid URL")
            return

    @classmethod
    def increment_scan_count(cls):
        cls.total_scan += 1
        update_db_scan_count(cls.total_scan)

    @classmethod
    def get_total_scan(cls):
        return cls.total_scan

    @classmethod
    def initialize_scan_count(cls):
        conn = sqlite3.connect("./Database/scan.db")
        cursor = conn.cursor()
        cursor.execute("SELECT total FROM scan_count")
        result = cursor.fetchone()
        if result:
            cls.total_scan = result[0]
        conn.close()

    def main(self):
        start_time = time.time()  # Hora de início do scan
        self.increment_scan_count()
        
        num_failures = 0
        num_redirects = 0
        match_count = 0
        status_code = None
        
        try:
            r = Reader(self.template)
            self.headers, self.payloads, self.method, self.redirects = r.reader()

            # Realiza o scan e coleta as respostas
            requester = req.Requester(self.url, self.template, self.headers, self.payloads, self.method, self.redirects)
            self.rdata, self.rbody = requester.req()

            # Captura o status_code da resposta
            status_code = self.rdata.status_code if hasattr(self.rdata, 'status_code') else None
            
            # Captura o número de redirecionamentos
            num_redirects = len(self.redirects) if self.redirects else 0

            # Captura os matchers
            self.matchtype, self.part, self.key, self.regex, self.code, self.matchCondition, self.identity, self.info, self.severity = r.readMatchers()
            
            # Processa as correspondências (matchers)
            matcher_obj = matcher.Matchers(self.matchCondition, self.matchtype, self.part, self.key, self.regex, self.code, self.payloads, self.rbody, self.rdata, self.url, self.identity, self.info, self.severity)
            _json = matcher_obj.forAPI()

            # Conta o número de matches encontrados
            match_count = len(_json.get('matches', []))

        except Exception as e:
            # Se houver falhas durante o scan, incrementa o contador de falhas
            num_failures += 1
            print(f"Scan failed: {e}")

        end_time = time.time()  # Hora de término do scan
        duration = end_time - start_time  # Tempo total do scan
        
        # Armazena os dados do scan no banco de dados
        store_scan_data(self.url, start_time, end_time, duration, status_code, num_failures, num_redirects, match_count)
        
        return json.dumps(_json, indent=4)



    def isValidUrl(self):
        regex = re.compile(
            r'^(?:http|ftp)s?://'  # http:// or https://
            r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?)|'  # domain...
            r'localhost|'  # localhost...
            r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'  # ...or ip
            r'(?::\d+)?'  # optional port
            r'(?:/?|[/?]\S+)$', re.IGNORECASE)

        return re.match(regex, self.url) is not None

# Configura o banco de dados e inicializa a contagem de scans
setup_db()
Scan.initialize_scan_count()
