import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import CustomizedXAxisTick from "./CustomizedXAxisTick";
import { useTranslation } from 'react-i18next';

function ScanMetricsChart() {
  const [scanData, setScanData] = useState([]);
  const { t } = useTranslation();
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/scan_durations");
        const data = await response.json();
        setScanData(data.scan_durations);
      } catch (error) {
        console.error("Error fetching scan durations:", error);
      }
    }
    fetchData();
  }, []);

  // Função personalizada para formatar o conteúdo do tooltip
  const renderTooltipContent = (props) => {
    const { active, payload, label } = props;
    if (active && payload && payload.length) {
      const scan = payload[0].payload; // Acesse o objeto do scan
      return (
        <div className="custom-tooltip" style={{ backgroundColor: '#fff', border: '1px solid #ccc', padding: '10px' }}>
          <p><strong>{t("Scan ID")}:</strong> {scan.scan_id}</p>
          <p><strong>{t("URL")}:</strong> {scan.url}</p>
          <p><strong>{t("Duration")}:</strong> {scan.duration} s</p>
          <p><strong>{t("Number of Failures")}:</strong> {scan.num_failures}</p>
          <p><strong>{t("Number of Redirects")}:</strong> {scan.num_redirects}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <h2 style={{marginLeft: '40px'}}>{t("Scan Metrics")}</h2>
      <br></br>
      {/* Scan Duration Chart */}
      <LineChart width={600} height={300} data={scanData} style={{ marginBottom: '40px' }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
        <XAxis dataKey="scan_id" tick={<CustomizedXAxisTick />} />
        <YAxis
          tick={{ fill: "#666", fontSize: 12 }}
          tickLine={{ stroke: "#ccc" }}
          axisLine={{ stroke: "#ccc" }}
        />
        <Tooltip content={renderTooltipContent} />
        <Legend />
        <Line type="monotone" dataKey="duration" stroke="#82ca9d" name={t("Scan Duration")} />
      </LineChart>
    </div>
  );
}

export default ScanMetricsChart;
