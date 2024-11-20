import Dashboard from "layouts/dashboard";
import Vulnerability_Details from "layouts/vulnerability_details";
import EndpointParser from "layouts/endpoint_parser";
import SignIn from "layouts/authentication/sign-in";
import DeepScan from "layouts/deep_scan";
import SubdomainScan from "layouts/subdomain_scan";

import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import RadarIcon from "@mui/icons-material/Radar";
import DetailsIcon from "@mui/icons-material/Details";
import LastPageIcon from "@mui/icons-material/LastPage";
import Custom_scan from "layouts/custom_scan";
import AvTimerIcon from "@mui/icons-material/AvTimer";
import FilterListIcon from "@mui/icons-material/FilterList";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <HomeIcon fontSize="small">dashboard</HomeIcon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Subdomain Scan",
    key: "subdomain-scan",
    icon: <FilterListIcon fontSize="small">subdomain-scan</FilterListIcon>,
    route: "/subdomain-scan",
    component: <SubdomainScan />,
  },
  {
    type: "collapse",
    name: "Endpoint Parser",
    key: "endoint-parser",
    icon: <LastPageIcon fontSize="small">endpoint-parser</LastPageIcon>,
    route: "/endpoint-parser",
    component: <EndpointParser />,
  },
  {
    type: "collapse",
    name: "Deep Scan",
    key: "deep-scan",
    icon: <RadarIcon fontSize="small">deep-scan</RadarIcon>,
    route: "/deep-scan",
    component: <DeepScan />,
  },
  {
    type: "collapse",
    name: "Custom Scan",
    key: "custom-scan",
    icon: <AvTimerIcon fontSize="small">custom-scan</AvTimerIcon>,
    route: "/custom-scan",
    component: <Custom_scan />,
  },
  {
    type: "collapse",
    name: "Vulnerability Details",
    key: "vulnerability-details",
    icon: <DetailsIcon fontSize="small">vulnerability-details</DetailsIcon>,
    route: "/vulnerability-details",
    component: <Vulnerability_Details />,
  },
  {
    type: "collapse",
    name: "Sign Out",
    key: "sign-up",
    icon: <LogoutIcon fontSize="small">sign-out</LogoutIcon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
];

export default routes;
