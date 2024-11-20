// @mui material components
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDProgress from "components/MDProgress";
import MDBadge from "components/MDBadge";


// Images
import LogoAsana from "assets/images/small-logos/logo-asana.svg";
import logoGithub from "assets/images/small-logos/github.svg";
import logoAtlassian from "assets/images/small-logos/logo-atlassian.svg";
import logoSlack from "assets/images/small-logos/logo-slack.svg";
import logoSpotify from "assets/images/small-logos/logo-spotify.svg";
import logoInvesion from "assets/images/small-logos/logo-invision.svg";

export default function data() {
  const Project = ({ image, name }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      {/* <MDAvatar src={image} name={name} size="sm" variant="rounded" /> */}
      <MDTypography display="block" variant="button" fontWeight="medium" ml={1} lineHeight={1}>
        {name}
      </MDTypography>
    </MDBox>
  );

  const Progress = ({ color, value }) => (
    <MDBox display="flex" alignItems="center">
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {value}%
      </MDTypography>
      <MDBox ml={0.5} width="9rem">
        <MDProgress variant="gradient" color={color} value={value} />
      </MDBox>
    </MDBox>
  );

  return {
    columns: [
      { Header: "Module Name", accessor: "project", width: "30%", align: "left" },
      { Header: "Person Name", accessor: "budget", align: "left" },
      { Header: "status", accessor: "status", align: "center" },
      { Header: "completion", accessor: "completion", align: "center" },
      // { Header: "action", accessor: "action", align: "center" },
    ],

    rows: [
      {
        project: <Project name="FYP-II Documentation" />,
        budget: (
          <MDTypography component="a" href="#" variant="button" color="text" fontWeight="medium">
            Muhammad Ozair Malik
          </MDTypography>
        ),
        status: (
          <MDBox ml={-1}>
             <MDBadge badgeContent="In Progress" color="" variant="gradient" size="sm" />
          </MDBox>
        ),
        completion: <Progress color="info" value={10} />,
        action: (
          <MDTypography component="a" href="#" color="text">
            <Icon>more_vert</Icon>
          </MDTypography>
        ),
      },
      {
        project: <Project name="Back-End Development" />,
        budget: (
          <MDTypography component="a" href="#" variant="button" color="text" fontWeight="medium">
            Muhammad Asif Masood
          </MDTypography>
        ),
        status: (
          <MDBox ml={-1}>
             <MDBadge badgeContent="In Progress" color="" variant="gradient" size="sm" />
          </MDBox>
        ),
        completion: <Progress color="info" value={60} />,
        action: (
          <MDTypography component="a" href="#" color="text">
            <Icon>more_vert</Icon>
          </MDTypography>
        ),
      },
      {
        project: <Project name="Front-End Development" />,
        budget: (
          <MDTypography component="a" href="#" variant="button" color="text" fontWeight="medium">
            Shafqat Abbas
          </MDTypography>
        ),
        status: (
          <MDBox ml={-1}>
             <MDBadge badgeContent="In Progress" color="" variant="gradient" size="sm" />
          </MDBox>
        ),
        completion: <Progress color="info" value={85} />,
        action: (
          <MDTypography component="a" href="#" color="text">
            <Icon>more_vert</Icon>
          </MDTypography>
        ),
      },
      {
        project: <Project name="FYP-I Defense" />,
        budget: (
          <MDTypography component="a" href="#" variant="button" color="text" fontWeight="medium">
            All Members
          </MDTypography>
        ),
        status: (
          <MDBox ml={-1}>
             <MDBadge badgeContent="Completed" color="success" variant="gradient" size="sm" />
          </MDBox>
        ),
        completion: <Progress color="info" value={100} />,
        action: (
          <MDTypography component="a" href="#" color="text">
            <Icon>more_vert</Icon>
          </MDTypography>
        ),
      },
      {
        project: <Project name="FYP-I Proposal" />,
        budget: (
          <MDTypography component="a" href="#" variant="button" color="text" fontWeight="medium">
            All Members
          </MDTypography>
        ),
        status: (
          <MDBox ml={-1}>
             <MDBadge badgeContent="Completed" color="success" variant="gradient" size="sm" />
          </MDBox>
        ),
        completion: <Progress color="info" value={100} />,
        action: (
          <MDTypography component="a" href="#" color="text">
            <Icon>more_vert</Icon>
          </MDTypography>
        ),
      },
      {
        project: <Project name="FYP-I Documentation" />,
        budget: (
          <MDTypography component="a" href="#" variant="button" color="text" fontWeight="medium">
            All Members
          </MDTypography>
        ),
        status: (
          <MDBox ml={-1}>
             <MDBadge badgeContent="Completed" color="success" variant="gradient" size="sm" />
          </MDBox>
        ),
        completion: <Progress color="info" value={100} />,
        action: (
          <MDTypography component="a" href="#" color="text">
            <Icon>more_vert</Icon>
          </MDTypography>
        ),
      }
    ],
  };
}
