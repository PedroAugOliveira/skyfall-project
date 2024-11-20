import { useState, useEffect } from "react";

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import ScanDurationChart from "./ScanDurationChart";
import VulnerabilityPieChart from "./VulnerabilityPieChart";
import withAuth from "./withAuth";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

import { useTranslation } from 'react-i18next';

function Dashboard() {
  const [totalScans, setTotalScans] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalFollowers, setTotalFollowers] = useState(0);

  const { t } = useTranslation();

  const fetchData = async () => {
    try {
      const [scansRes, usersRes, revenueRes, followersRes] = await Promise.all([
        fetch("/total_scans"),
        fetch("/total_users"),
        fetch("/total_revenue"),
        fetch("/total_followers"),
      ]);

      const [scansData, usersData, revenueData, followersData] = await Promise.all([
        scansRes.json(),
        usersRes.json(),
        revenueRes.json(),
        followersRes.json(),
      ]);

      setTotalScans(scansData.total_scans);
      setTotalUsers(usersData.total_users);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const { sales, tasks } = reportsLineChartData;

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="radar"
                title={t("Total Scans")}
                count={totalScans}
                percentage={{
                  color: "success",
                  amount: "+55%",
                  label: t("than last week"),
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="leaderboard"
                title={t("Total Users")}
                count={totalUsers}
                percentage={{
                  color: "success",
                  amount: "+3%",
                  label: t("than last month"),
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
        <MDBox mt={3}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <ScanDurationChart />
            </Grid>
            <Grid item xs={12} sm={6}>
              <VulnerabilityPieChart />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}

export default withAuth(Dashboard);
