import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';

// @mui material components
import Divider from "@mui/material/Divider";
import Switch from "@mui/material/Switch";
import Icon from "@mui/material/Icon";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Custom styles for the Configurator
import ConfiguratorRoot from "examples/Configurator/ConfiguratorRoot";

// Material Dashboard 2 React context
import {
  useMaterialUIController,
  setOpenConfigurator,
  setTransparentSidenav,
  setWhiteSidenav,
  setFixedNavbar,
  setDarkMode,
} from "context";

function Configurator() {
  const [controller, dispatch] = useMaterialUIController();
  const {
    openConfigurator,
    fixedNavbar,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [disabled, setDisabled] = useState(false);
  
  const { t, i18n } = useTranslation();

  // Use the useEffect hook to change the button state for the sidenav type based on window size.
  useEffect(() => {
    // A function that sets the disabled state of the buttons for the sidenav type.
    function handleDisabled() {
      return window.innerWidth > 1200 ? setDisabled(false) : setDisabled(true);
    }

    // The event listener that's calling the handleDisabled function when resizing the window.
    window.addEventListener("resize", handleDisabled);

    // Call the handleDisabled function to set the state with the initial value.
    handleDisabled();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleDisabled);
  }, []);

  const handleCloseConfigurator = () => setOpenConfigurator(dispatch, false);
  const handleTransparentSidenav = () => {
    setTransparentSidenav(dispatch, true);
    setWhiteSidenav(dispatch, false);
  };
  const handleWhiteSidenav = () => {
    setWhiteSidenav(dispatch, true);
    setTransparentSidenav(dispatch, false);
  };
  const handleDarkSidenav = () => {
    setWhiteSidenav(dispatch, false);
    setTransparentSidenav(dispatch, false);
  };
  const handleFixedNavbar = () => setFixedNavbar(dispatch, !fixedNavbar);
  const handleDarkMode = () => setDarkMode(dispatch, !darkMode);

  // Handle language change
  const handleLanguageChange = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  // sidenav type buttons styles
  const sidenavTypeButtonsStyles = ({
    functions: { pxToRem },
    palette: { white, dark, background },
    borders: { borderWidth },
  }) => ({
    height: pxToRem(39),
    background: darkMode ? background.sidenav : white.main,
    color: darkMode ? white.main : dark.main,
    border: `${borderWidth[1]} solid ${darkMode ? white.main : dark.main}`,

    "&:hover, &:focus, &:focus:not(:hover)": {
      background: darkMode ? background.sidenav : white.main,
      color: darkMode ? white.main : dark.main,
      border: `${borderWidth[1]} solid ${darkMode ? white.main : dark.main}`,
    },
  });

  // sidenav type active button styles
  const sidenavTypeActiveButtonStyles = ({
    functions: { pxToRem, linearGradient },
    palette: { white, gradients, background },
  }) => ({
    height: pxToRem(39),
    background: darkMode ? white.main : linearGradient(gradients.dark.main, gradients.dark.state),
    color: darkMode ? background.sidenav : white.main,

    "&:hover, &:focus, &:focus:not(:hover)": {
      background: darkMode ? white.main : linearGradient(gradients.dark.main, gradients.dark.state),
      color: darkMode ? background.sidenav : white.main,
    },
  });

  return (
    <ConfiguratorRoot variant="permanent" ownerState={{ openConfigurator }}>
      <MDBox
        display="flex"
        justifyContent="space-between"
        alignItems="baseline"
        pt={4}
        pb={0.5}
        px={3}
      >
        <MDBox>
          <MDTypography variant="h5">{t('Settings')}</MDTypography>
          <MDTypography variant="body2" color="text">
            {t('Customize your dashboard')}
          </MDTypography>
        </MDBox>

        <Icon
          sx={({ typography: { size }, palette: { dark, white } }) => ({
            fontSize: `${size.lg} !important`,
            color: darkMode ? white.main : dark.main,
            stroke: "currentColor",
            strokeWidth: "2px",
            cursor: "pointer",
            transform: "translateY(5px)",
          })}
          onClick={handleCloseConfigurator}
        >
          close
        </Icon>
      </MDBox>

      <Divider />

      <MDBox pt={0.5} pb={3} px={3}>
        {/* Language Settings */}
        <MDBox mt={2} display="flex" justifyContent="space-between" alignItems="center">
          <MDTypography variant="h6">{t('Language')}</MDTypography>
          <Select
            value={i18n.language}
            onChange={handleLanguageChange}
          >
            <MenuItem value="en-US">English</MenuItem>
            <MenuItem value="pt-BR">Português</MenuItem>
          </Select>
        </MDBox>

        <MDBox mt={3} lineHeight={1}>
          <MDTypography variant="h6">{t('Sidenav Type')}</MDTypography>
          <MDTypography variant="button" color="text">
            {t('Choose between different sidenav types.')}
          </MDTypography>

          <MDBox
            sx={{
              display: "flex",
              mt: 2,
              mr: 1,
            }}
          >
            <MDButton
              color="dark"
              variant="gradient"
              onClick={handleDarkSidenav}
              disabled={disabled}
              fullWidth
              sx={
                !transparentSidenav && !whiteSidenav
                  ? sidenavTypeActiveButtonStyles
                  : sidenavTypeButtonsStyles
              }
            >
              {t('Dark')}
            </MDButton>
            <MDBox sx={{ mx: 1, width: "8rem", minWidth: "8rem" }}>
              <MDButton
                color="dark"
                variant="gradient"
                onClick={handleTransparentSidenav}
                disabled={disabled}
                fullWidth
                sx={
                  transparentSidenav && !whiteSidenav
                    ? sidenavTypeActiveButtonStyles
                    : sidenavTypeButtonsStyles
                }
              >
                {t('Transparent')}
              </MDButton>
            </MDBox>
            <MDButton
              color="dark"
              variant="gradient"
              onClick={handleWhiteSidenav}
              disabled={disabled}
              fullWidth
              sx={
                whiteSidenav && !transparentSidenav
                  ? sidenavTypeActiveButtonStyles
                  : sidenavTypeButtonsStyles
              }
            >
              {t('White')}
            </MDButton>
          </MDBox>
        </MDBox>
        <MDBox
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={3}
          lineHeight={1}
        >
        </MDBox>
        <Divider />
        <MDBox display="flex" justifyContent="space-between" alignItems="center" lineHeight={1}>
          <MDTypography variant="h6">{t('Light / Dark')}</MDTypography>

          <Switch checked={darkMode} onChange={handleDarkMode} />
        </MDBox>
        <Divider />
      </MDBox>
    </ConfiguratorRoot>
  );
}

export default Configurator;
