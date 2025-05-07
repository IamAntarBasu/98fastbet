import React, { useState, useEffect } from "react";
import { Box, useTheme, IconButton, Button, Dialog, DialogActions, DialogContent, TextField } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../theme";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import Header from "../components/Header";

function Contact() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [searchQuery, setSearchQuery] = useState("");
  const [mockDataContacts, setMockDataContacts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [balance, setBalance] = useState(""); // State for balance input
  const [username, setUsername] = useState(""); // State for username input

  const fetchBets = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/cricketmarket/allbetsupdate`);
      const result = await response.json();

      if (result.success) {
        const groupedData = result.data.reduce((acc, bet) => {
          if (!acc[bet.label]) {
            acc[bet.label] = {
              id: Object.keys(acc).length + 1, // Unique ID
              label: bet.label,
              stake: 0, // Initialize stake sum
              profit: 0, // Initialize profit sum
              result: bet.result,
              createdAt: new Date(bet.createdAt).toLocaleString(),
              totalBets: 0, // Count how many bets have this label
              match:bet.match
            };
          }

          // Sum stake and profit
          acc[bet.label].stake += bet.stake;
          acc[bet.label].profit += bet.profit;

          // Count total bets for this label
          acc[bet.label].totalBets += 1;

          return acc;
        }, {});

        // Convert grouped object to array
        const formattedData = Object.values(groupedData);

        setMockDataContacts(formattedData);
      } else {
        console.error("Error fetching bets:", result.message);
      }
    } catch (error) {
      console.error("API Request Failed:", error);
    }
  };


  useEffect(() => {
    fetchBets();
  }, []);

  const filteredContacts = mockDataContacts
    .filter((contact) =>
      (contact.name || "").toLowerCase().includes((searchQuery || "").toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort recent first


  
  // Close the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null); // Clear the selected user data
    setBalance(""); // Clear balance input
    setUsername(""); // Clear username input
  };
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };


  const handleUpdate = (user) => {
    setSelectedUser(user);
    setBalance(user.result); // Set result instead of balance
    setUsername(user.label); // Set label instead of name
    setOpenDialog(true);
  };

  // Handle result input change
  const handleResultChange = (event) => {
    setBalance(event.target.value);
  };

  // Handle save action (API call to backend for update)
  const handleSave = () => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/updateResultUserBet`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        label: username, // Find records based on this
        result: balance, // Update result for matching records
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Update local data where the username matches
          setMockDataContacts((prevContacts) =>
            prevContacts.map((contact) =>
              contact.label === username
                ? { ...contact, result: balance } // Only update the result
                : contact
            )
          );
          handleCloseDialog(); // Close the dialog
        } else {
          alert("Error updating result: " + data.message);
        }
      })
      .catch((error) => {
        console.error("Error updating result:", error);
        alert("Failed to update result. Please try again.");
      });
  };
  



  const columns = [
    { field: "id", headerName: "ID" },

    { field: "label", headerName: "Label", flex: 1, cellClassName: "name-column--cell" },
    { field: "totalBets", headerName: "TotalBets", type: "number", align: "left", headerAlign: "left" },
    { field: "stake", headerName: "Stake", flex: 1 },
    { field: "profit", headerName: "Profit", flex: 1 },
    { field: "match", headerName: "Match", flex: 1 },
    { field: "result", headerName: "Result", flex: 1 },

    {
      field: "update",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleUpdate(params.row)}
        >
          Update
        </Button>
      ),
    },
  ];

  return (
    <Box m="0.5rem 1rem">
      {/* Header and Search Bar in Same Row */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Header title="All Session Bets" subtitle="List of All Cricket session Bets" />
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
          rows={filteredContacts} // Filtered data only
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>

      {/* Update Form Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="ID"
              value={selectedUser?.id || ""} // Show ID, prevent errors if undefined
              fullWidth
              disabled // Prevent editing
            />

            <TextField
              label="Label"
              value={username}
              onChange={handleUsernameChange}
              fullWidth
            />

            <TextField
              label="Result"
              value={balance}
              onChange={handleResultChange} // Change handler for result field
              fullWidth
            />

          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="secondary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Contact;
