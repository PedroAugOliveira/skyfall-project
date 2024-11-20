import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import withAuth from "./withAuth";


function Quick_scan() {
  const [url, setUrl] = useState("");
  const [scanResults, setScanResults] = useState(null);

  const handleScanClick = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/endpoints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url,
          vulns: "openredirect",
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        const endpoints = data.data.map((url) => ({ endpoint: url }));
        setScanResults(endpoints);
      } else {
        console.error("Failed to scan URL");
      }
    } catch (error) {
      console.error("Error scanning URL:", error);
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
                  Endpoint Parser
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
                  placeholder="Enter URL to scan"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                ></input>
                <div style={{ margin: "20px 0px" }}>
                  <MDButton
                    variant="gradient"
                    color="info"
                    size="lg"
                    onClick={handleScanClick}
                  >
                    Scan
                  </MDButton>
                </div>
              </div>
              <MDBox pt={3}>
                {scanResults && (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ borderCollapse: "collapse", width: "100%" }}>
                      <thead>
                        <tr>
                          <th
                            style={{
                              backgroundColor: "#007aff",
                              color: "white",
                              padding: "10px 20px",
                              textAlign: "left",
                              borderBottom: "1px solid #ddd",
                            }}
                          >
                            Found Endpoints
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


export default withAuth(Quick_scan);
