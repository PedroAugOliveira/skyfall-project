import { useState } from "react";

// react-router-dom components
import { Link, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";
import Alert from "@mui/material/Alert";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpg";

function Basic() {
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    const API_URL = "http://localhost:5000";

    try {
      const response = await fetch(`${API_URL}/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      console.log("Response:", response); // Add this line

      const data = await response.json();

      console.log("Data:", data); // Add this line

      if (data.status === "success") {
        const cookies = response.headers.get("set-cookie");
        if (cookies) {
          const sessionId = cookies
            .split(";")
            .find((cookie) => cookie.startsWith("session"))
            .split("=")[1];
          localStorage.setItem("sessionId", sessionId);
        }

        setSuccess(true);
        setError(false);
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        setError(true);
        setSuccess(false);
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.error("Error:", error); // Add this line
      setError(true);
      setSuccess(false);
      setErrorMessage(
        "An error occurred while signing in. Please try again later."
      );
    }
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign in
          </MDTypography>
        </MDBox>
        {errorMessage && (
          <MDBox px={3} pb={2}>
            <Alert severity="error" onClose={() => setErrorMessage("")}>
              {errorMessage}
            </Alert>
          </MDBox>
        )}
        <MDBox pt={2} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Remember me
              </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton
                onClick={handleSignIn}
                variant="gradient"
                color="info"
                fullWidth
              >
                sign in
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Don&apos;t have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-up"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign up
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
