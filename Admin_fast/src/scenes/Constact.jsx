

// import React, { useState, useEffect } from "react";
// import { Box, useTheme, IconButton, Button, Dialog, DialogActions, DialogContent, TextField } from "@mui/material";
// import { DataGrid, GridToolbar } from "@mui/x-data-grid";
// import { tokens } from "../theme";
// import InputBase from "@mui/material/InputBase";
// import SearchIcon from "@mui/icons-material/Search";
// import Header from "../components/Header";

// function Contact() {
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [mockDataContacts, setMockDataContacts] = useState([]);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [balance, setBalance] = useState(""); // State for balance input
//   const [username, setUsername] = useState(""); // State for username input

//   useEffect(() => {
//     fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/admin`)
//       .then((response) => response.json())
//       .then((data) => {
//         const formattedData = data.map((user, index) => ({
//           id: index + 1, // Generate an ID
//           name: user.username,
//           email: user.email,
//           Balance: user.wallet ? user.wallet.balance : 0, // Default if no wallet balance
//           phone: "N/A", // Replace with real phone field if available
//           Exp: 0, // Replace with experience if available
//           city: "Unknown", // Replace with real city if available
//           zipCode: "00000", // Replace with real zip code if available
//           registrarId: user._id, // Use MongoDB ID
         
//         }));
//         setMockDataContacts(formattedData);
//       })
//       .catch((error) => console.error("Error fetching users:", error));
//   }, []);

//   const filteredContacts = mockDataContacts.filter((contact) =>
//     contact.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   // Handle Update Button Click
//   const handleUpdate = (user) => {
//     setSelectedUser(user);
//     setBalance(user.Balance); // Set balance value when updating
//     setUsername(user.name); // Set username value when updating
//     setOpenDialog(true); // Open dialog on update button click
//   };

//   // Handle balance input change
//   const handleBalanceChange = (event) => {
//     setBalance(event.target.value);
//   };

//   // Handle username input change
//   const handleUsernameChange = (event) => {
//     setUsername(event.target.value);
//   };

//   // Close the dialog
//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//     setSelectedUser(null); // Clear the selected user data
//     setBalance(""); // Clear balance input
//     setUsername(""); // Clear username input
//   };

//   // Handle save action (API call to backend for update)
//   const handleSave = () => {
//     // Parse balance to ensure it's a number
//     const parsedBalance = parseFloat(balance);
//     if (isNaN(parsedBalance)) {
//       alert("Invalid balance amount");
//       return;
//     }
  
//     // Make PUT request to update user info on the backend
//     fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/admin/${selectedUser.registrarId}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         username: username, // Updated username
//         balance: parsedBalance, // Updated balance
//       }),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.success) {
//           // Update local data after successful backend update
//           setMockDataContacts((prevContacts) =>
//             prevContacts.map((contact) =>
//               contact.registrarId === selectedUser.registrarId
//                 ? { ...contact, name: username, Balance: parsedBalance }
//                 : contact
//             )
//           );
//           handleCloseDialog(); // Close the dialog
//         } else {
//           alert("Error updating user data");
//         }
//       })
//       .catch((error) => console.error("Error updating user data:", error));
//   };
  

//   const columns = [
//     { field: "id", headerName: "ID" },
//     { field: "registrarId", headerName: "Registrar ID" },
//     {
//       field: "name",
//       headerName: "Name",
//       flex: 1,
//       cellClassName: "name-column--cell",
//     },
   
//     { field: "Balance", headerName: "Balance", type: "number", align: "left", headerAlign: "left" },
//     { field: "Exp", headerName: "Exp", flex: 1 },
//     { field: "phone", headerName: "Phone Number", flex: 1 },
//     { field: "email", headerName: "Email", flex: 1 },
//     {
//       field: "update",
//       headerName: "Action",
//       flex: 1,
//       renderCell: (params) => (
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={() => handleUpdate(params.row)}
//         >
//           Update
//         </Button>
//       ),
//     },
//   ];

//   return (
//     <Box m="0.5rem 1rem">
//       {/* Header and Search Bar in Same Row */}
//       <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//         <Header title="All Users" subtitle="List of All users in 98FASTBET" />
//         <Box display="flex" backgroundColor={colors.primary[400]} borderRadius="3px" width="30%">
//           <InputBase
//             type="text"
//             placeholder="Search by name..."
//             sx={{ ml: 2, flex: 1 }}
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//           <IconButton sx={{ p: 1 }} type="button">
//             <SearchIcon />
//           </IconButton>
//         </Box>
//       </Box>

//       {/* Users Table */}
//       <Box
//         height="75vh"
//         sx={{
//           "& .MuiDataGrid-root": { border: "none" },
//           "& .MuiDataGrid-cell": { borderBottom: "none" },
//           "& .name-column--cell": { color: colors.greenAccent[300] },
//           "& .MuiDataGrid-columnHeaders": { backgroundColor: colors.blueAccent[700], borderBottom: "none" },
//           "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.primary[400] },
//           "& .MuiDataGrid-footerContainer": { borderTop: "none", backgroundColor: colors.blueAccent[700] },
//           "& .MuiCheckbox-root": { color: `${colors.greenAccent[200]} !important` },
//           "& .MuiDataGrid-toolbarContainer .MuiButton-text": { color: `${colors.grey[100]} !important` },
//         }}
//       >
//         <DataGrid
//           rows={filteredContacts} // Filtered data only
//           columns={columns}
//           components={{ Toolbar: GridToolbar }}
//         />
//       </Box>

//       {/* Update Form Dialog */}
//       <Dialog open={openDialog} onClose={handleCloseDialog}>
//         <DialogContent>
//           <Box display="flex" flexDirection="column" gap={2}>
//             <TextField
//               label="User ID"
//               value={selectedUser?.registrarId || ""}
//               fullWidth
//               disabled
//             />
//             <TextField
//               label="Name"
//               value={username} // Bind to username state
//               onChange={handleUsernameChange} // Handle username change
//               fullWidth
//             />
//             <TextField
//               label="Balance"
//               value={balance}
//               onChange={handleBalanceChange} // Handle balance change
//               fullWidth
//             />
//             <TextField
//               label="Email"
//               value={selectedUser?.email || ""}
//               fullWidth
//               disabled
//             />
//           </Box>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDialog} color="secondary">
//             Cancel
//           </Button>
//           <Button onClick={handleSave} color="secondary">
//             Update
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// }

// export default Contact;



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

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/admin`)
      .then((response) => response.json())
      .then((data) => {
      
        const formattedData = data.map((user, index) => ({
          id: index + 1, // Generate an ID
          name: user.username,
          email: user.email,
          Balance: user.wallet ? user.wallet.balance : 0, // Default if no wallet balance
          phone: "N/A", // Replace with real phone field if available
          Exp: 0, // Replace with experience if available
          city: "Unknown", // Replace with real city if available
          zipCode: "00000", // Replace with real zip code if available
          registrarId: user._id, // Use MongoDB ID
          userNo:user.userNo,
        }));
       
        setMockDataContacts(formattedData);
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  

  const filteredContacts = mockDataContacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle Update Button Click
  const handleUpdate = (user) => {
    setSelectedUser(user);
    setBalance(user.Balance); // Set balance value when updating
    setUsername(user.name); // Set username value when updating
    setOpenDialog(true); // Open dialog on update button click
  };

  // Handle balance input change
  const handleBalanceChange = (event) => {
    setBalance(event.target.value);
  };

  // Handle username input change
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  // Close the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null); // Clear the selected user data
    setBalance(""); // Clear balance input
    setUsername(""); // Clear username input
  };

  // Handle save action (API call to backend for update)
  const handleSave = () => {
    // Parse balance to ensure it's a number
    const parsedBalance = parseFloat(balance);
    if (isNaN(parsedBalance)) {
      alert("Invalid balance amount");
      return;
    }
  
    // Make PUT request to update user info on the backend
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/admin/${selectedUser.registrarId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username, // Updated username
        balance: parsedBalance, // Updated balance
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Update local data after successful backend update
          setMockDataContacts((prevContacts) =>
            prevContacts.map((contact) =>
              contact.registrarId === selectedUser.registrarId
                ? { ...contact, name: username, Balance: parsedBalance }
                : contact
            )
          );
          handleCloseDialog(); // Close the dialog
        } else {
          alert("Error updating user data");
        }
      })
      .catch((error) => console.error("Error updating user data:", error));
  };
  

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "registrarId", headerName: "Registrar ID" },
    {field: "name",headerName: "Phone Number",flex: 1,cellClassName: "name-column--cell",},
    { field: "userNo", headerName: "userNo", type: "number", align: "left", headerAlign: "left" },
    { field: "Balance", headerName: "Balance", type: "number", align: "left", headerAlign: "left" },
    { field: "Exp", headerName: "Exp", flex: 1 },
    { field: "phone", headerName: "User Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
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
        <Header title="All Users" subtitle="List of All users in 98FASTBET" />
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
              label="User ID"
              value={selectedUser?.registrarId || ""}
              fullWidth
              disabled
            />
            <TextField
              label="Name"
              value={username} // Bind to username state
              onChange={handleUsernameChange} // Handle username change
              fullWidth
            />
            <TextField
              label="Balance"
              value={balance}
              onChange={handleBalanceChange} // Handle balance change
              fullWidth
            />
            <TextField
              label="Email"
              value={selectedUser?.email || ""}
              fullWidth
              disabled
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

