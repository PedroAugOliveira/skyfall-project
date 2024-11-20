import React, { useState, useEffect, useMemo } from "react";

// react-router components
import { Routes, Route, useLocation } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";


// Material Dashboard 2 React example components
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";

// Material Dashboard 2 React themes
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";

// Material Dashboard 2 React Dark Mode themes
import themeDark from "assets/theme-dark";
import themeDarkRTL from "assets/theme-dark/theme-rtl";

// RTL plugins
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

// Material Dashboard 2 React routes
import routes from "routes";

// Material Dashboard 2 React contexts
import {
  useMaterialUIController,
  setMiniSidenav,
} from "context";

// Images
import brandWhite from "assets/images/skyfall-logo.png";
import brandDark from "assets/images/skyfall-logo.png";
import Dashboard from "layouts/dashboard";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import Tables from "layouts/tables";
import Vulnerability_Details from "layouts/vulnerability_details";
import Quick_scan from "layouts/quick_scan";
import Custom_scan from "layouts/custom_scan";
import SubdomainScan from "layouts/subdomain_scan";
import EndpointParser from "layouts/endpoint_parser";
import DeepScan from "layouts/deep_scan";

export default function App() {
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();

  // Cache for the rtl
  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });

    setRtlCache(cacheRtl);
  }, []);

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };


  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);


  const configsButton = (
    <>
    </>
  );

  return direction === "rtl" ? (
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={darkMode ? themeDarkRTL : themeRTL}>
        <CssBaseline />
        {layout === "dashboard" && (
          <>
            <Sidenav
              color={sidenavColor}
              brand={
                (transparentSidenav && !darkMode) || whiteSidenav
                  ? brandDark
                  : brandWhite
              }
              brandName=" SkyFall"
              routes={routes}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
            />
            <Configurator />
            {configsButton}
          </>
        )}
        {layout === "vr" && <Configurator />}
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/authentication/sign-up" element={<SignUp />} />
          <Route path="*" element={<SignIn />} />
        </Routes>
      </ThemeProvider>
    </CacheProvider>
  ) : (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />
      {layout === "dashboard" && (
        <>
          <Sidenav
            color={sidenavColor}
            brand={
              (transparentSidenav && !darkMode) || whiteSidenav
                ? brandDark
                : brandWhite
            }
            brandName=" SkyFall"
            routes={routes}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
          />
          <Configurator />
          {configsButton}
        </>
      )}
      {layout === "vr" && <Configurator />}
      <Routes>
        {/* {getRoutes(routes)} */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/authentication/sign-up" element={<SignUp />} />
        <Route path="/full-scan" element={<Tables />} />
        <Route
          path="/vulnerability-details"
          element={<Vulnerability_Details />}
        />
        <Route path="/authentication/sign-in" element={<SignIn />} />
        <Route path="/quick-scan" element={<Quick_scan />} />
        <Route path="/endpoint-parser" element={<EndpointParser />} />
        <Route path="/subdomain-scan" element={<SubdomainScan />} />
        <Route path="/deep-scan" element={<DeepScan />} />
        <Route path="/custom-scan" element={<Custom_scan />} />
        <Route path="*" element={<SignIn />} />
      </Routes>
    </ThemeProvider>
  );
}
