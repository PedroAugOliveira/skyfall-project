import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import withAuth from "./withAuth";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";

import ScanDetails from './ScanDetails';

import { useTranslation } from 'react-i18next';

function DeepScan() {
  const [url, setUrl] = useState("");
  const [scanResults, setScanResults] = useState(null);
  const [vulnerabilities, setVulnerabilities] = useState({});
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();

  const handleVulnerabilityChange = (event) => {
    setVulnerabilities({
      ...vulnerabilities,
      [event.target.name]: event.target.checked,
    });
  };

  const selectedVulns = Object.keys(vulnerabilities).filter(
    (key) => vulnerabilities[key]
  );

  const headerCellStyle = {
    padding: "12px 24px",
    borderBottom: "1px solid #e0e0e0",
    backgroundColor: "#800080",
    fontWeight: "bold",
    color: "white",
  };

  const handleScanClick = async () => {
    // Check if the URL is valid
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    if (!urlRegex.test(url)) {
      alert(t("Invalid URL provided. Please enter a valid URL."));
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/deepscan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url,
          vuln: selectedVulns.join(","),
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        setScanResults(data.results);
      } else {
        // Handle API errors
        console.error("Error scanning URL:", data);
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error scanning URL:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  {t("Deep Scan")}
                </MDTypography>
              </MDBox>
              <div style={{ margin: "30px 20px 0 20px" }}>
                <input
                  style={{
                    width: "50%",
                    borderRadius: "12px 12px",
                    padding: "10px",
                    fontSize: "16px",
                  }}
                  placeholder={t("Enter URL to scan")}
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={vulnerabilities.xxe || false}
                      onChange={handleVulnerabilityChange}
                      name="xxe"
                      color="primary"
                    />
                  }
                  label={t("XML External Entity (XXE)")}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={vulnerabilities.sqli || false}
                      onChange={handleVulnerabilityChange}
                      name="sqli"
                      color="primary"
                    />
                  }
                  label={t("SQL injection (SQLi)")}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={vulnerabilities.sqlipost || false}
                      onChange={handleVulnerabilityChange}
                      name="sqlipost"
                      color="primary"
                    />
                  }
                  label={t("SQLi (POST)")}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={vulnerabilities.openredirect || false}
                      onChange={handleVulnerabilityChange}
                      name="openredirect"
                      color="primary"
                    />
                  }
                  label={t("Open Redirect")}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={vulnerabilities.xss || false}
                      onChange={handleVulnerabilityChange}
                      name="xss"
                      color="primary"
                    />
                  }
                  label={t("Cross-Site Scripting (XSS)")}
                />
                <div style={{ margin: "20px 0px" }}>
                  <MDButton
                    variant="gradient"
                    color="info"
                    size="lg"
                    onClick={handleScanClick}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : t('Scan')}
                  </MDButton>
                </div>
              </div>
              <MDBox pt={3}>
                {scanResults && (
                  <div style={{ marginLeft: '20px' }}>
                    <ScanDetails results={scanResults} />
                  </div>
                )}

                {scanResults && (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ borderCollapse: "collapse", width: "100%" }}>
                      <thead>
                        <tr>
                          <th style={headerCellStyle}>{t("Vulnerability")}</th>
                          <th style={headerCellStyle}>{t("Identity")}</th>
                          <th style={headerCellStyle}>{t("URL")}</th>
                          {/* Exibe os títulos das colunas apenas se houver dados correspondentes */}
                          {scanResults.some((result) => result.data.status_code_match !== undefined) && (
                            <th style={headerCellStyle}>{t("Status Code Match")}</th>
                          )}
                          {scanResults.some((result) => result.data.header_match !== undefined) && (
                            <th style={headerCellStyle}>{t("Header Match")}</th>
                          )}
                          {scanResults.some((result) => result.data.body_match !== undefined) && (
                            <th style={headerCellStyle}>{t("Body Match")}</th>
                          )}
                          <th style={headerCellStyle}>{t("Vulnerable")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {scanResults.map((result, index) => {
                          const rowCellStyle = {
                            padding: "10px 20px",
                            borderBottom: index === scanResults.length - 1 ? "none" : "1px solid #ddd",
                          };

                          return (
                            <tr key={index}>
                              <td style={rowCellStyle}>{result.vuln}</td>
                              <td style={rowCellStyle}>{result.data.identity}</td>
                              <td style={rowCellStyle}>{result.data.url}</td>

                              {/* Exibe célula de Status Code Match se o cabeçalho estiver presente */}
                              {scanResults.some((result) => result.data.status_code_match !== undefined) && (
                                <td style={rowCellStyle}>
                                  {result.data.status_code_match !== undefined
                                    ? result.data.status_code_match
                                      ? t("Yes")
                                      : t("No")
                                    : "-"}
                                </td>
                              )}

                              {/* Exibe célula de Header Match se o cabeçalho estiver presente */}
                              {scanResults.some((result) => result.data.header_match !== undefined) && (
                                <td style={rowCellStyle}>
                                  {result.data.header_match !== undefined
                                    ? result.data.header_match
                                      ? t("Yes")
                                      : t("No")
                                    : "-"}
                                </td>
                              )}

                              {/* Exibe célula de Body Match se o cabeçalho estiver presente */}
                              {scanResults.some((result) => result.data.body_match !== undefined) && (
                                <td style={rowCellStyle}>
                                  {result.data.body_match !== undefined
                                    ? result.data.body_match
                                      ? t("Yes")
                                      : t("No")
                                    : "-"}
                                </td>
                              )}

                              <td style={rowCellStyle}>
                                {result.data.vulnerability ? t("Yes") : t("No")}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default withAuth(DeepScan);
