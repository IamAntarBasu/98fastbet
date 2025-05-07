
import React, { useState, useEffect } from "react";
import { Box, useTheme, InputBase, MenuItem, Select } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../theme";

import Header from "../components/Header";
import axios from "axios";

function Contact() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [searchQuery, setSearchQuery] = useState("");
  const [betData, setBetData] = useState([]);
  const [betPlacedFilter, setBetPlacedFilter] = useState("");
  const [winStatusFilter, setWinStatusFilter] = useState("");
 const [toggle, setToggle] = useState(false);
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/getAndhar`)
      .then(response => {
        const formattedData = response.data.map((bet, index) => ({
          id: index + 1,
          user: bet.user?.username || "N/A",  // Change this line to bet.user?.name or bet.user?.email
          betAmount: bet.stake,
          totalBets: bet.label,
          betPlaced: bet.betPlaced ? "No" : "YES",
          profit: bet.profit,
          isWin: bet.isWin,
        }));
        setBetData(formattedData);
      })
      .catch(error => console.error("Error fetching bet data:", error));
  }, []);

  const filteredData = betData.filter((data) =>
    data.user.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (betPlacedFilter ? data.betPlaced === betPlacedFilter : true) &&
    (winStatusFilter ? data.isWin === winStatusFilter : true)
  );

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "user", headerName: "User", flex: 1 },
    { field: "betAmount", headerName: "Bet Amount", flex: 1 },
    { field: "totalBets", headerName: "Bet Play", flex: 1 },
    { field: "betPlaced", headerName: "Bet Placed", flex: 1 },
    { field: "profit", headerName: "Profit", flex: 1 },
    { field: "isWin", headerName: "Win Status", flex: 1 },
  ];

  return (
    <Box m="0.5rem 1rem">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Header title="Andhar Bahar Bets" subtitle="List of All User Bets" />
        <div>
          <label>Choose Type:-</label>
          <button
            type="button"
            onClick={() => setToggle(!toggle)}
            style={{
              width: "50px",
              height: "25px",
              borderRadius: "20px",
              border: "none",
              backgroundColor: toggle ? "green" : "gray",
              color: "white",
              cursor: "pointer",
              transition: "0.3s",
            }}
          >
            {toggle ? "ON" : "OFF"}
          </button>
        </div>
        <Box display="flex" gap={2}>
          <InputBase
            type="text"
            placeholder="Search by user..."
            sx={{ backgroundColor: colors.primary[400], borderRadius: "3px", padding: "5px 10px" }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Select
            value={betPlacedFilter}
            displayEmpty
            onChange={(e) => setBetPlacedFilter(e.target.value)}
            sx={{ backgroundColor: colors.primary[400], borderRadius: "3px" }}
          >
            <MenuItem value="">All Bets</MenuItem>
            <MenuItem value="Yes">Placed</MenuItem>
            <MenuItem value="No">Not Placed</MenuItem>
          </Select>
          <Select
            value={winStatusFilter}
            displayEmpty
            onChange={(e) => setWinStatusFilter(e.target.value)}
            sx={{ backgroundColor: colors.primary[400], borderRadius: "3px" }}
          >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="Win">Win</MenuItem>
            <MenuItem value="Loss">Loss</MenuItem>
          </Select>
        </Box>
      </Box>

      <Box
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .MuiDataGrid-columnHeaders": { backgroundColor: colors.blueAccent[700], borderBottom: "none" },
          "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.primary[400] },
          "& .MuiDataGrid-footerContainer": { borderTop: "none", backgroundColor: colors.blueAccent[700] },
        }}
      >
        <DataGrid
          rows={filteredData}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
}

export default Contact;
