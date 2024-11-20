import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import withAuth from "./withAuth";
import ErrorBoundary from "./ErrorBoundary";

import { useTranslation } from "react-i18next";

const headerCellStyle = {
  padding: "12px 24px",
  borderBottom: "1px solid #e0e0e0",
  backgroundColor: "#800080",
  fontWeight: "bold",
  color: "white",
};

function SubdomainScan() {
  const [url, setUrl] = useState("");
  const [scanResults, setScanResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { t } = useTranslation();

  const handleScanClick = async () => {
    // Check if the URL is valid
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    if (!urlRegex.test(url)) {
      alert(t("Invalid URL provided. Please enter a valid URL."));
      return;
    }

    const formattedUrl = url.substring(url.indexOf("//") + 2);

    setIsLoading(true); // Ativa o spinner

    try {
      const response = await fetch("http://localhost:5000/api/subdomains", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: formattedUrl, // Use the formatted URL here
          aggressive: true,
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        const formattedData = data.data.map((item) => ({
          ip_address: item.subdomain,
          subdomain: item.ip_address,
          server: item.server,
          code: item.code,
        }));
        setScanResults(formattedData);
      } else {
        // Handle API errors
        console.error("Error scanning URL:", data);
        alert(t(`Error: ${data.message}`));
      }
    } catch (error) {
      console.error("Error scanning URL:", error);
    } finally {
      setIsLoading(false); // Desativa o spinner
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
                  {t("Subdomain Scan")}
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
                <div style={{ margin: "20px 0px" }}>
                  <MDButton
                    variant="gradient"
                    color="info"
                    size="lg"
                    onClick={handleScanClick}
                    disabled={isLoading} // Desativa o botão enquanto carrega
                  >
                    {isLoading ? <CircularProgress size={24} color="inherit" /> : t('Scan')}
                  </MDButton>
                </div>
              </div>
              <MDBox pt={3} textAlign="center">
                {scanResults && !isLoading && (
                  <div style={{ overflowX: "auto" }}>
                    <ErrorBoundary>
                      <table style={{ borderCollapse: "collapse", width: "100%" }}>
                        <thead>
                          <tr>
                            <th style={headerCellStyle}>{t("IP Address")}</th>
                            <th style={headerCellStyle}>{t("Subdomain")}</th>
                            <th style={headerCellStyle}>{t("Server")}</th>
                            <th style={headerCellStyle}>{t("Code")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {scanResults.map((result) => (
                            <tr key={result.ip_address}>
                              <td style={{ padding: "12px 24px", borderBottom: "1px solid #e0e0e0" }}>
                                {result.ip_address}
                              </td>
                              <td style={{ padding: "12px 24px", borderBottom: "1px solid #e0e0e0" }}>
                                {result.subdomain}
                              </td>
                              <td style={{ padding: "12px 24px", borderBottom: "1px solid #e0e0e0" }}>
                                {result.server}
                              </td>
                              <td style={{ padding: "12px 24px", borderBottom: "1px solid #e0e0e0" }}>
                                {result.code}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </ErrorBoundary>
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

export default withAuth(SubdomainScan);
