import { Box } from "@mui/material";
import Header from "../components/Header";
import PieChart from "../components/PieChart";

const Pie = () => {
  return (
    <Box m="0.5rem 1rem">
      <Header
        title="Profit/Loss"
        subtitle="Profit and Loss visualize the 98FASTBET business"
      />
      <Box height="75vh">
        <PieChart />
      </Box>
    </Box>
  );
};

export default Pie;
