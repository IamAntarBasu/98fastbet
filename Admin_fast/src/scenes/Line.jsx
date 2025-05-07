import { Box } from "@mui/material";
import Header from "../components/Header";
import LineChart from "../components/LineChart";

const Line = () => {
  return (
    <Box m="0.5rem 1rem">
      <Header
        title="Line Chart"
        subtitle="Line Chart to visualize the business"
      />
      <Box height="75vh">
        <LineChart />
      </Box>
    </Box>
  );
};

export default Line;
