import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import CircularProgress from "@mui/material/CircularProgress";

import ScanDetails from './ScanDetails';

import { useTranslation } from 'react-i18next';

import withAuth from "./withAuth";

function CustomScan() {
  const [url, setUrl] = useState("");
  const [vulnerabilities, setVulnerabilities] = useState({});
  const [message, setMessage] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();


  const handleVulnerabilityChange = (event) => {
    setVulnerabilities({
      ...vulnerabilities,
      [event.target.name]: event.target.checked,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const selectedVulns = Object.keys(vulnerabilities).filter(
      (key) => vulnerabilities[key]
    );
  
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    if (!urlRegex.test(url)) {
      alert(t("Invalid URL provided. Please enter a valid URL."));
      return;
    }
  
    if (selectedVulns.length === 0) {
      alert(t("Please select at least one vulnerability."));
      return;
    }
  
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, vuln: selectedVulns.join(",") }),
        credentials: "include",
      });
  
      const data = await response.json();
      setMessage(data.message);
  
      if (data.status === "success") {
        setResults(data.results);
      } else {
        setMessage(t("No vulnerability found."));
        setResults(null);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage(t("An error occurred. Please try again."));
      setResults(null);
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
                  {t("Custom Scan")}
                </MDTypography>
              </MDBox>
              <div style={{ margin: "30px 20px" }}>
                <form onSubmit={handleSubmit}>
                  <input
                    style={{
                      width: "50%",
                      borderRadius: "12px 12px",
                      padding: "10px",
                      fontSize: "16px",
                    }}
                    placeholder={t("Enter URL to scan")}
                    value={url}
                    onChange={(event) => setUrl(event.target.value)}
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
                      type="submit"
                      variant="gradient"
                      color="info"
                      size="lg"
                      disabled={loading}
                    >
                      {loading ? <CircularProgress size={24} color="inherit" /> : t('Scan')}
                    </MDButton>
                  </div>
                </form>
                {message && (
                  <div style={{ marginTop: "10px" }}>
                    <MDTypography color={results ? "success" : "error"}>
                      {message}
                    </MDTypography>
                  </div>
                )}
                {results && <ScanDetails results={results} />}
              </div>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default withAuth(CustomScan);
