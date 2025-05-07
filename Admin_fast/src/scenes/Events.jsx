

import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from "@mui/material";
import axios from "axios";

function Contact() {
  const [marketData, setMarketData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchGameData = async () => {
   
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/subscription-state`);
      const data = response.data;
      
      setMarketData(data.markets);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false); // Stop loading after fetching data
    }
  };

  useEffect(() => {
    // Fetch data immediately when the component mounts
    fetchGameData();

    // Set up polling to fetch data every minute (60000 ms)
    const intervalId = setInterval(fetchGameData, 60000);

    // Cleanup interval on component unmount to avoid memory leaks
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleClose = () => {
    setOpenDialog(false);
    setSelectedMarket(null);
  };

  const handleChange2 = (e) => {
    const { name, value } = e.target;
    setSelectedMarket((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = () => {
    setOpenDialog(false); // Close the dialog after saving
  };

  return (
    <>
      <Box sx={{ padding: 3, backgroundColor: "#000b31d6", borderRadius: 2, color: "white", width: "100%", margin: "auto" }}>
        <Typography variant="h4" gutterBottom align="center">Live Markets</Typography>

        {/* Show loading spinner if data is still being loaded */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", padding: 2 }}>
            <CircularProgress sx={{ color: "white" }} />
          </Box>
        ) : (
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
                      <TableCell sx={{ color: "white" }}>{market.bidStatus}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ color: "white" }}>No records found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

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
    </>
  );
}

export default Contact;
