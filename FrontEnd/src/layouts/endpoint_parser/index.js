import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import withAuth from "./withAuth";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";

import { useTranslation } from 'react-i18next';

function EndpointParser() {
  const [url, setUrl] = useState("");
  const [scanResults, setScanResults] = useState(null);
  const [vulnerability, setVulnerability] = useState("");
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();

  const handleScanClick = async () => {
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    if (!urlRegex.test(url)) {
      alert(t("Invalid URL provided. Please enter a valid URL."));
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/endpoints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url,
          vulns: vulnerability,
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        const endpoints = data.data.map((url) => ({ endpoint: url }));
        setScanResults(endpoints);
      } else {
        console.error("Error scanning URL:", data);
        alert(t(`Error: ${data.message}`));
      }
    } catch (error) {
      console.error("Error scanning URL:", error);
    } finally {
      setLoading(false); // Para o spinner
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
                  {t('Endpoint Parser')}
                </MDTypography>
              </MDBox>
              <div style={{ margin: "30px 20px" }}>
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
                ></input>
                <FormControl
                  variant="standard"
                  style={{ marginLeft: "20px", marginBottom: "20px" }}
                >
                  <InputLabel id="vulnerability-label">{t('Vulnerability')}</InputLabel>
                  <Select
                    labelId="vulnerability-label"
                    id="vulnerability-select"
                    value={vulnerability}
                    onChange={(e) => setVulnerability(e.target.value)}
                    style={{ minWidth: '100px' }}
                  >
                    <MenuItem value="">{t('Clear')}</MenuItem>
                    <MenuItem value="openredirect">{t('Open Redirect')}</MenuItem>
                    <MenuItem value="sqli">{t('SQLi')}</MenuItem>
                    <MenuItem value="sqlipost">{t('SQLi POST')}</MenuItem>
                    <MenuItem value="xxe">{t('XXE')}</MenuItem>
                    <MenuItem value="xss">{t('XSS')}</MenuItem>
                  </Select>
                </FormControl>
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
                  <div style={{ overflowX: "auto" }}>
                    <table
                      style={{ borderCollapse: "collapse", width: "100%" }}
                    >
                      <thead>
                        <tr>
                          <th
                            style={{
                              backgroundColor: "#800080",
                              color: "white",
                              padding: "10px 20px",
                              textAlign: "left",
                              borderBottom: "1px solid #ddd",
                            }}
                          >
                            {t('Found Endpoints')}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {scanResults.map((result, index) => (
                          <tr key={index}>
                            <td
                              style={{
                                padding: "10px 20px",
                                borderBottom:
                                  index === scanResults.length - 1
                                    ? "none"
                                    : "1px solid #ddd",
                              }}
                            >
                              {result.endpoint}
                            </td>
                          </tr>
                        ))}
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

export default withAuth(EndpointParser);
