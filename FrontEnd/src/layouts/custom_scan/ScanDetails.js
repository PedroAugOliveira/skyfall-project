import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { CSVLink } from "react-csv";
import MDButton from "components/MDButton";
import jsPDF from "jspdf";
import "jspdf-autotable";

function ScanDetails({ results }) {
  if (!results || results.length === 0) {
    return null;
  }

  const exportPDF = () => {
    const doc = new jsPDF();
  
    doc.setLineWidth(1);
  
    // Cabeçalho geral
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(128, 0, 128);
    doc.text("SkyFall Vulnerability Report", 14, 20);
  
    const currentTime = new Date();
    const formattedTime = currentTime.toLocaleString();
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Report Generated: ${formattedTime}`, 14, 30);
  
    let currentPageY = 40;
  
    const checkNewPage = (additionalHeight) => {
      if (currentPageY + additionalHeight > 287) {
        doc.addPage();
        currentPageY = 20;
      }
    };
  
    // Função para formatar os parâmetros (remover underscores e capitalizar)
    const formatParameterName = (param) => {
      return param
        .replace(/_/g, ' ')            // Substitui underscores por espaços
        .replace(/\b\w/g, (l) => l.toUpperCase()); // Capitaliza a primeira letra de cada palavra
    };
  
    // Função para obter a descrição e mitigação com links de referência OWASP
    const getVulnerabilityInfo = (identity) => {
      const descriptions = {
        xss: {
          description: "Cross-Site Scripting (XSS) allows attackers to inject scripts into web applications, enabling them to execute malicious scripts in users' browsers.",
          mitigation: "To mitigate XSS, ensure input validation and output encoding, and use Content Security Policies (CSP).",
          reference: "https://owasp.org/www-community/attacks/xss/"
        },
        sqli: {
          description: "SQL Injection (SQLi) allows attackers to manipulate SQL queries, potentially gaining unauthorized access to the database.",
          mitigation: "Use parameterized queries and prepared statements to prevent SQL injection attacks.",
          reference: "https://owasp.org/www-community/attacks/SQL_Injection"
        },
        "sqli-post": {
          description: "SQL Injection via POST requests functions similarly to regular SQLi but specifically targets POST data in web forms.",
          mitigation: "Prevent SQLi by sanitizing and validating POST data and using prepared statements.",
          reference: "https://owasp.org/www-community/attacks/SQL_Injection"
        },
        xxe: {
          description: "XML External Entity (XXE) injection allows attackers to interfere with the processing of XML data.",
          mitigation: "Disable XML external entities and validate XML input to mitigate XXE attacks.",
          reference: "https://owasp.org/www-community/vulnerabilities/XML_External_Entity_(XXE)_Processing"
        },
        "open redirect": {
          description: "Open Redirects allow attackers to redirect users to malicious websites by exploiting vulnerable redirect functionality.",
          mitigation: "Validate and sanitize URLs before redirecting to external websites.",
          reference: "https://owasp.org/www-community/attacks/Unvalidated_Redirects_and_Forwards_Cheat_Sheet"
        },
        other: {
          description: "Other unspecified vulnerabilities may include uncommon or less documented security issues.",
          mitigation: "Follow best security practices, such as input validation and secure coding techniques.",
          reference: "https://owasp.org/www-project-top-ten/"
        }
      };
  
      return descriptions[identity.toLowerCase()] || descriptions["other"];
    };
  
    // Agrupamento de vulnerabilidades por 'identity'
    const groupedResults = results.reduce((acc, result) => {
      const identity = result.data.identity || "Other"; // Agrupa por 'identity', ou "Other" se não tiver
      if (!acc[identity]) {
        acc[identity] = [];
      }
      acc[identity].push(result);
      return acc;
    }, {});
  
    // Iterar sobre cada tipo de vulnerabilidade (agrupado por 'identity')
    Object.keys(groupedResults).forEach((identity) => {
      checkNewPage(40); // Verifica se há espaço para uma nova seção
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(186, 85, 211); // Roxo Claro
      doc.text(`Vulnerability Type: ${identity}`, 14, currentPageY);
      currentPageY += 10;
  
      // Obter descrição e mitigação para a vulnerabilidade
      const vulnInfo = getVulnerabilityInfo(identity);
  
      // Definir a largura máxima do texto (190 é a largura total da página menos as margens de 10)
      const pageWidth = 190;
  
      // Descrição única da vulnerabilidade
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0); // Preto
      doc.text(vulnInfo.description, 14, currentPageY, { maxWidth: pageWidth });
      currentPageY += 10;
  
      // Mitigação única da vulnerabilidade
      doc.setFont("helvetica", "bold");
      doc.text("Mitigation: ", 14, currentPageY);
      doc.setFont("helvetica", "normal");
      doc.text(vulnInfo.mitigation, 38, currentPageY, { maxWidth: pageWidth });
      currentPageY += 10;
  
      // Link de referência OWASP
      doc.setTextColor(30, 144, 255); // Azul para o link
      doc.textWithLink("More information at OWASP", 14, currentPageY, { url: vulnInfo.reference });
      currentPageY += 20;
  
      groupedResults[identity].forEach((result) => {
        checkNewPage(60); // Verifica se há espaço suficiente para cada vulnerabilidade
  
        // Título da vulnerabilidade específica
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 0, 0);
        doc.text(`Vulnerability: ${result.vuln}`, 14, currentPageY);
        currentPageY += 10;
  
        // Criticidade
        doc.setFont("helvetica", "bold");
        doc.text("Severity: ", 14, currentPageY);
        doc.setFont("helvetica", "normal");
  
        // Verificar cor da severidade com base no 'identity' e nível de criticidade
        const severity = result.data.severity || "N/A";
        if (["xss", "sqli", "sqli-POST", "xxe", "xss"].includes(identity.toLowerCase())) {
          doc.setTextColor(255, 0, 0); // Vermelho se for 'high' e o identity for um dos especificados
          doc.text("high", 45, currentPageY);
        } else if (identity.toLowerCase() === "open redirect") {
          doc.setTextColor(0, 128, 0); // Verde se for 'low' e identity for 'Open Redirect'
          doc.text("low", 45, currentPageY);
        } else {
          doc.setTextColor(255, 0, 0); // Vermelho se for 'high' e o identity for um dos especificados
          doc.text("high", 45, currentPageY);
        }
  
        currentPageY += 10;
  
        // Adiciona uma tabela com os parâmetros adicionais da vulnerabilidade
        const tableRows = [
          ["Parameter", "Value"],
          ...Object.entries(result.data).map(([key, value]) => [
            formatParameterName(key), // Formata o nome do parâmetro
            typeof value === "boolean" ? (value ? "Yes" : "No") : value,
          ]),
        ];
  
        doc.autoTable({
          startY: currentPageY,
          headStyles: { fillColor: "#1976d2", textColor: "#fff", fontStyle: "bold" },
          bodyStyles: { textColor: "#333" },
          margin: { top: 20 },
          tableWidth: 185,
          body: tableRows,
          alternateRowStyles: { fillColor: "#f0f0f0" }, // Cor alternada nas linhas
        });
  
        // Atualiza o Y após a tabela
        currentPageY = doc.previousAutoTable.finalY + 10;
      });
  
      currentPageY += 20; // Espaço entre tipos de vulnerabilidades
    });
  
    doc.save("SkyFall_Vulnerability_Report.pdf");
  };
  
  
  

  const csvData = [
    [
      "Vulnerability",
      "Identity",
      "Severity",
      "Info",
      "URL",
      "Header Match",
      "Body Match",
      "Status Code Match",
      "Vulnerability",
    ],
    ...results.map((result) => [
      result.vuln,
      result.data.identity || "",
      result.data.severity || "",
      result.data.info || "",
      result.data.url || "",
      result.data.header_match !== undefined
        ? result.data.header_match
          ? "Yes"
          : "No"
        : "",
      result.data.body_match !== undefined
        ? result.data.body_match
          ? "Yes"
          : "No"
        : "",
      result.data.status_code_match !== undefined
        ? result.data.status_code_match
          ? "Yes"
          : "No"
        : "",
      result.data.vulnerability !== undefined
        ? result.data.vulnerability
          ? "Yes"
          : "No"
        : "",
    ]),
  ];
  

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Scan Details
      </Typography>
      <Box sx={{ mb: 2 }}>
        <CSVLink
          data={csvData}
          filename="scan_results.csv"
          style={{ marginRight: "8px" }}
        >
          <MDButton
            variant="contained"
            style={{ backgroundColor: "#800080", color: "#fff" }} // Roxo
            size="small"
          >
            Export to CSV
          </MDButton>
        </CSVLink>
        <MDButton
          variant="contained"
          style={{ backgroundColor: "#800080", color: "#fff" }} // Roxo
          size="small"
          onClick={exportPDF}
        >
          Export to PDF
        </MDButton>
      </Box>
    </Box>
  );
}

export default ScanDetails;
