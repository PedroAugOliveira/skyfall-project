// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

export default function data() {
  return {
    columns: [{ Header: "Found Endpoints", accessor: "endpoint", align: "left" }],
    rows: [], // Initially empty
  };
}
