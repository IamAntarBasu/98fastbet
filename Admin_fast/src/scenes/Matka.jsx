

import React, { useState, useEffect } from "react";
import { Box, useTheme, IconButton, InputBase, TextField, MenuItem, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper , Dialog, DialogTitle, DialogContent, DialogActions  } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../theme";
import SearchIcon from "@mui/icons-material/Search";
import Header from "../components/Header";
import axios from "axios";

function Matka() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [searchQuery, setSearchQuery] = useState("");
  const [mockDataContacts, setMockDataContacts] = useState([]);
  const [formData, setFormData] = useState({
    marketName: "",
    openNumber: "",
    jodiDigit: "",
    closeNumber: "",
    openTime: "",
    closeTime: "",
    closeStatus: "open",
  });

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/admin2`)
      .then((response) => response.json())
      .then((data) => {
        const formattedData = data.flatMap((bid, index) =>
          bid.bids.map((bet, historyIndex) => ({
            id: `${index + 1}-${historyIndex}`,
            name: bid.user?.username || "N/A",
            email: bid.user?.email || "N/A",
            gameName: bid.gameName || "Unknown",
            totalBidPoints: bet.points || 0,
            bids: bet || {},
            status: bid.totalBidPoints > 100 ? "Win" : "Loss",
            registrarId: bid._id,
          }))
        );
        setMockDataContacts(formattedData);
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/admin/creatematka`, formData);
      alert("Matka entry created successfully!");
      setFormData({
        marketName: "",
        openNumber: "",
        jodiDigit: "",
        closeNumber: "",
        openTime: "",
        closeTime: "",
        closeStatus: "open",
      });
    } catch (error) {
      console.error("Error creating matka entry", error);
      alert("Failed to create matka entry");
    }
  };

  const filteredContacts = mockDataContacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "registrarId", headerName: "Registrar ID" },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "gameName", headerName: "Game", flex: 1 },
    {
      field: "totalBidPoints",
      headerName: "Total Points",
      flex: 1,
      renderCell: (params) => <div>Points: {params.row.totalBidPoints}</div>,
    },
    {
      field: "bids",
      headerName: "Bids",
      flex: 1,
      renderCell: (params) => {
        const bid = params.row.bids;
        return bid && bid.number !== undefined ? <div>{bid.number}</div> : <div>No Bids</div>;
      },
    },
    { field: "status", headerName: "Status", flex: 1 },
  ];

  const [marketData, setMarketData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState(null);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/getMatkas`)
      .then(response => {
        setMarketData(response.data);
      })
      .catch(error => console.error("Error fetching data:", error));
  }, []);



  const handleUpdate = (market) => {
    setSelectedMarket(market);
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setSelectedMarket(null);
  };

  const handleChange2 = (e) => {
    setSelectedMarket({ ...selectedMarket, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/admin/updateMarket/${selectedMarket._id}`, selectedMarket)
      .then(() => {
        setMarketData(marketData.map(m => (m._id === selectedMarket._id ? selectedMarket : m)));
        handleClose();
      })
      .catch(error => console.error("Error updating data:", error));
  };


  const handleDelete = async (marketId) => {
    try {
      // Send delete request to the backend
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/admin/deleteMarket/${marketId}`);
      
      // Remove the deleted market from the state (UI)
      setMarketData(marketData.filter(m => m._id !== marketId));
    } catch (error) {
      console.error('Error deleting market:', error);
      alert('Failed to delete market');
    }
  };
  
  return (

    <>
    <Box m="0.5rem 1rem" mb={4}>
      <Header title="CREATE MATKA" subtitle="Create the Matka Entry Here" />
    
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "grid", gap: 2,backgroundColor: "#000b31d6", padding: 3, borderRadius: 2 }}
      >
        <TextField label="Market Name" name="marketName" value={formData.marketName} onChange={handleChange} required />
        <TextField label="Open Number" name="openNumber" value={formData.openNumber} onChange={handleChange} required />
        <TextField label="Jodi Digit" name="jodiDigit" value={formData.jodiDigit} onChange={handleChange} required />
        <TextField label="Close Number" name="closeNumber" value={formData.closeNumber} onChange={handleChange} required />
        <TextField label="Open Time" type="time" name="openTime" value={formData.openTime} onChange={handleChange} required />
        <TextField label="Close Time" type="time" name="closeTime" value={formData.closeTime} onChange={handleChange} required />
        <TextField select label="Close Status" name="closeStatus" value={formData.closeStatus} onChange={handleChange}>
          <MenuItem value="open">Open</MenuItem>
          <MenuItem value="close">Close</MenuItem>
        </TextField>
        <Button type="submit" variant="contained" color="primary">Submit</Button>
      </Box>
    </Box>





    <Box sx={{ padding: 3, backgroundColor: "#000b31d6", borderRadius: 2, color: "white", width: "100%", margin: "auto" }}>
      <Typography variant="h4" gutterBottom align="center">Market Details</Typography>
      <TableContainer component={Paper} sx={{ backgroundColor: "#1a237e", color: "white", minHeight: 200, maxHeight: marketData.length > 8 ? 400 : 'auto', overflowY: marketData.length > 8 ? "scroll" : "hidden" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "white" }}>Market Name</TableCell>
              <TableCell sx={{ color: "white" }}>Open Number</TableCell>
              <TableCell sx={{ color: "white" }}>Jodi Digit</TableCell>
              <TableCell sx={{ color: "white" }}>Close Number</TableCell>
              <TableCell sx={{ color: "white" }}>Open Time</TableCell>
              <TableCell sx={{ color: "white" }}>Close Time</TableCell>
              <TableCell sx={{ color: "white" }}>Close Status</TableCell>
              <TableCell sx={{ color: "white" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {marketData.length > 0 ? (
              marketData.map((market, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ color: "white" }}>{market.marketName}</TableCell>
                  <TableCell sx={{ color: "white" }}>{market.openNumber}</TableCell>
                  <TableCell sx={{ color: "white" }}>{market.jodiDigit}</TableCell>
                  <TableCell sx={{ color: "white" }}>{market.closeNumber}</TableCell>
                  <TableCell sx={{ color: "white" }}>{market.openTime}</TableCell>
                  <TableCell sx={{ color: "white" }}>{market.closeTime}</TableCell>
                  <TableCell sx={{ color: "white" }}>{market.closeStatus}</TableCell>
                  <TableCell sx={{ color: "white" }}>
                    <Button variant="contained" color="primary" size="small" onClick={() => handleUpdate(market)}>Update</Button>
                    <Button variant="contained" color="secondary" size="small" sx={{ marginLeft: 1 }} onClick={() => handleDelete(market._id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ color: "white" }}>No records found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Update Dialog */}
      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>Update Market Details</DialogTitle>
        <DialogContent>
          {selectedMarket && (
            <>
              <TextField fullWidth margin="dense" label="Market Name" name="marketName" value={selectedMarket.marketName} onChange={handleChange2} />
              <TextField fullWidth margin="dense" label="Open Number" name="openNumber" value={selectedMarket.openNumber} onChange={handleChange2} />
              <TextField fullWidth margin="dense" label="Jodi Digit" name="jodiDigit" value={selectedMarket.jodiDigit} onChange={handleChange2} />
              <TextField fullWidth margin="dense" label="Close Number" name="closeNumber" value={selectedMarket.closeNumber} onChange={handleChange2} />
              <TextField fullWidth margin="dense" label="Open Time" name="openTime" value={selectedMarket.openTime} onChange={handleChange2} />
              <TextField fullWidth margin="dense" label="Close Time" name="closeTime" value={selectedMarket.closeTime} onChange={handleChange2} />
              <TextField fullWidth margin="dense" label="Close Status" name="closeStatus" value={selectedMarket.closeStatus} onChange={handleChange2} />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancel</Button>
          <Button onClick={handleSave} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>






    <Box m="0.5rem 1rem">
      {/* Header and Search Bar in Same Row */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Header title="Matka" subtitle="List of All Matka user bet" />
        <Box display="flex" backgroundColor={colors.primary[400]} borderRadius="3px" width="30%">
          <InputBase
            type="text"
            placeholder="Search by name..."
            sx={{ ml: 2, flex: 1 }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <IconButton sx={{ p: 1 }} type="button">
            <SearchIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Users Table */}
      <Box
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .name-column--cell": { color: colors.greenAccent[300] },
          "& .MuiDataGrid-columnHeaders": { backgroundColor: colors.blueAccent[700], borderBottom: "none" },
          "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.primary[400] },
          "& .MuiDataGrid-footerContainer": { borderTop: "none", backgroundColor: colors.blueAccent[700] },
          "& .MuiCheckbox-root": { color: `${colors.greenAccent[200]} !important` },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": { color: `${colors.grey[100]} !important` },
        }}
      >
        <DataGrid
          rows={filteredContacts}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>

  </>
  );
}

export default Matka;
