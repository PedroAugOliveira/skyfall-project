# 🛰️ Skyfall - Web Vulnerability Scanner com Chaos Engineering

**Skyfall** é uma ferramenta de **teste de penetração em aplicações web**, desenvolvida como Trabalho de Conclusão de Curso no curso de Ciência da Computação da FIB (Faculdades Integradas de Bauru). O projeto propõe uma abordagem inovadora ao integrar princípios da **Chaos Engineering** aos testes de segurança baseados no **OWASP Top 10**, visando fortalecer a resiliência de sistemas web.

---

## 📌 Objetivo

Desenvolver uma plataforma acessível para análise de segurança em aplicações web, capaz de identificar e explorar vulnerabilidades comuns (como XSS, SQLi, IDOR) e simular cenários de falha de maneira controlada, por meio da integração de práticas de Chaos Engineering.

---

## 🧩 Funcionalidades

- 🔍 **Scanner de Subdomínios** com uso de motores de busca e Shodan.
- 🧠 **Endpoint Parser** baseado em crawling e Web Archive.
- 🧪 **Deep Scan e Custom Scan** com payloads personalizados baseados em blueprints OWASP.
- 🧯 **Chaos Simulation** para simular falhas controladas e testar resiliência.
- 📄 Geração de relatórios técnicos e executivos em **PDF** e **CSV**.
- 🔐 Módulo de classificação e detalhamento de vulnerabilidades com base em **CWE**, **CAPEC** e severidade.

---

## 🧠 Tecnologias Utilizadas

### Backend
- **Python** (Flask)
- Web Scraping (BeautifulSoup, Requests)
- API Shodan
- Regex para análise de respostas
- PDF/CSV export

### Frontend
- **React.js**
- Recharts para visualização de métricas
- Axios para comunicação API

### Segurança e Metodologias
- **OWASP Top 10 / WSTG**
- **Chaos Engineering** (Chaos Monkey-inspired simulations)
- CWE / CAPEC
- Expressões regulares para reconhecimento de vulnerabilidades
- LGPD Compliance (criptografia de dados sensíveis)

---
