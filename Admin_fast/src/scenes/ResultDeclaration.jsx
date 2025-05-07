import { Box, Button, Typography, useTheme, TextField, MenuItem, Select, FormControl, InputLabel, CircularProgress, Snackbar, Alert, Tabs, Tab, Paper, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../theme";
import Header from "../components/Header";
import { useState, useEffect } from "react";
import "./payment.css";
import RefreshIcon from "@mui/icons-material/Refresh";
import InfoIcon from "@mui/icons-material/Info";

import axios from 'axios';
// const MOCK_FANCY_MARKETS = {
//   "Chennai Super Kings v Royal Challengers Bengaluru": [
//     { _id: "1", name: "1st Innings Total Runs", label: "1st Innings Total Runs", status: "live" },
//     { _id: "2", name: "Virat Kohli Runs", label: "Virat Kohli Runs", status: "live" },
//     { _id: "3", name: "Steve Smith Runs", label: "Steve Smith Runs", status: "finished" }
//   ],
//   "England vs New Zealand": [
//     { _id: "4", name: "Jos Buttler Runs", label: "Jos Buttler Runs", status: "live" },
//     { _id: "5", name: "Kane Williamson Runs", label: "Kane Williamson Runs", status: "live" }
//   ],
//   "South Africa vs Pakistan": [
//     { _id: "6", name: "Babar Azam Runs", label: "Babar Azam Runs", status: "finished" },
//     { _id: "7", name: "1st Innings Total", label: "1st Innings Total", status: "finished" }
//   ]
// };


const ResultDeclaration = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  // State variables
  const [matches, setMatches] = useState([]);
  const [fancyMarkets, setFancyMarkets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [MOCK_FANCY_MARKETS, setMOCK_FANCY_MARKETS] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [selectedMatch, setSelectedMatch] = useState("");
  const [selectedMarket, setSelectedMarket] = useState("");
  const [resultValue, setResultValue] = useState("");
  const [resultType, setResultType] = useState("win","loss");
  const [recentDeclarations, setRecentDeclarations] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    message: ""
  });
  const [detailDialog, setDetailDialog] = useState({
    open: false,
    bet: null
  });



  const fetchAndStoreData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/fetch-unique-labels-fancy-data`);
      // const MOCK_FANCY_MARKETS = response.data;
      setMOCK_FANCY_MARKETS(response.data);
      console.log('Data stored successfully:', response.data);
    } catch (error) {
      console.error('Error fetching and storing data:', error);
    }
  };

  useEffect(() => {
  fetchAndStoreData();
   }, []);

  const fetchFancyMarkets = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/fetch-fancy-markets`);
      setFancyMarkets(response.data);
    } catch (error) {
      console.error("Error fetching fancy markets:", error);
    }
  };

  useEffect(() => {
    fetchFancyMarkets();
  }, []);



  const [data, setData] = useState([]);
  const [error, setError] = useState('');

  const fetchUniqueData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/unique-matches-labels`);
      setMatches(response.data);
    } catch (err) {
      setError('Failed to fetch data.');
    }
  };

  useEffect(() => {
    fetchUniqueData();
  }, []);


  const fetchRecentREsult = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/fatchrecentresultdeclation`);
      
      // Map the response data to match the required format for DataGrid
      const formattedData = response.data.map((item, index) => ({
        id: index + 1,
        _id: item._id,
        match: item.match,
        label: "Match Winner",
        type: "NA",
        result: item.winner,
        status: item.resultType === "win" ? "Won" : item.resultType === "loss" ? "Lost" : "Cancelled",
        stake: "NA",
        profit: "NA",
        odds: "NA",
        run: item.winner,
        createdAt: new Date(item.timestamp).toLocaleString()
      }));
      
      setRecentDeclarations(formattedData);
    } catch (err) {
      setError('Failed to fetch data.');
      console.error('Error fetching recent declarations:', err);
    }
  };

  useEffect(() => {
    fetchRecentREsult();
  }, []);



  console.log("recive data",recentDeclarations);
  // Load fancy markets when match changes
  useEffect(() => {
    if (tabValue === 1 && selectedMatch) {
      const matchName = typeof selectedMatch === 'object' ? selectedMatch.match : selectedMatch;
      setFancyMarkets(MOCK_FANCY_MARKETS[matchName] || []);
    }
  }, [selectedMatch, tabValue]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    // Reset form values when changing tabs
    setSelectedMatch("");
    setSelectedMarket("");
    setResultValue("");
    setResultType("win");
  };

  // Show snackbar notification
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  // Function to open detailed view
  const openDetailDialog = (bet) => {
    setDetailDialog({
      open: true,
      bet
    });
  };

  // Function to close detailed view
  const closeDetailDialog = () => {
    setDetailDialog({
      ...detailDialog,
      open: false
    });
  };

  // Mock handlers for buttons with simple success messages
  const handleDeclareMatchResult =async () => {
    setLoading(true);
    
    // Create payload that would be sent to backend
    const payload = {
      match: selectedMatch.match,
      winner: resultValue,
      resultType: resultType,
      declared_by: "admin",
      timestamp: new Date().toISOString()
    };
    
    console.log("Sending to backend:", payload);

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/admin/new-declaration`, payload);
      console.log('API Response:', response.data);
      showSnackbar(`Match result for "${selectedMatch.match}" declared successfully!`);
      setResultValue("");
      
      // Refresh the recent declarations list
      fetchRecentREsult();
    } catch (error) {
      console.error('Error declaring result:', error);
      showSnackbar('Failed to declare result.', "error");
    } finally {
      setLoading(false);
    }
  };



  
  const handleDeclareFancyResult = async() => {
    setLoading(true);
    
    // Create payload that would be sent to backend
    const payload = {
      match: selectedMatch.match,
      market: selectedMarket.name,
      resultValue: resultValue,
      resultType: resultType,
      declared_by: "admin",
      timestamp: new Date().toISOString()
    };
    
    console.log("Sending to backend:", payload);
    
    // Mock API call
    // setTimeout(() => {
    //   // Simulate API response
    //   console.log("API Response: Fancy result declared successfully");
    //   showSnackbar(`Fancy market result for "${selectedMarket.name}" declared successfully!`);
    //   setLoading(false);
    //   setResultValue("");
      
    //   // Add to recent declarations for UI demo
    //   const newDeclaration = {
    //     id: recentDeclarations.length + 1,
    //     _id: `bet${Math.floor(Math.random() * 1000)}`,
    //     match: selectedMatch.match,
    //     label: selectedMarket.name,
    //     type: "YES",
    //     result: resultValue,
    //     status: resultType === "win" ? "Won" : "Cancelled",
    //     stake: "500",
    //     profit: "450",
    //     odds: "1.9",
    //     run: `Over ${parseInt(resultValue) - 5}.5`,
    //     createdAt: new Date().toLocaleString()
    //   };
      
    //   setRecentDeclarations([newDeclaration, ...recentDeclarations]);
    // }, 1000);

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/admin/new-fancy-declaration`, payload);
      console.log('API Response:', response.data);
      showSnackbar(`Match result for "${selectedMatch.match}" declared successfully!`);
      setResultValue("");
      
      // Refresh the recent declarations list
      fetchRecentREsult();
    } catch (error) {
      console.error('Error declaring result:', error);
      showSnackbar('Failed to declare result.', "error");
    } finally {
      setLoading(false);
    }
  };




  const handleRevertResult = () => {
    setLoading(true);
    setTimeout(() => {
      showSnackbar("Result reverted successfully!");
      setLoading(false);
      setSelectedMatch("");
      setSelectedMarket("");
      setResultValue("");
    }, 1000);
  };

  // Refresh all data
  const refreshAllData = () => {
    setLoading(true);
    fetchRecentREsult()
      .then(() => {
        showSnackbar("Data refreshed successfully");
      })
      .catch((err) => {
        console.error("Error refreshing data:", err);
        showSnackbar("Failed to refresh data", "error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Render match selection dropdown with status indicators
  const renderMatchSelection = () => {
    return (
      <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
        <InputLabel>Select a Match</InputLabel>
        <Select
          value={selectedMatch}
          onChange={(e) => setSelectedMatch(e.target.value)}
          label="Select a Match"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {matches.map((match, index) => (
            <MenuItem key={index} value={match}>
              {match.match}
              {match.status && (
                <Box 
                  component="span" 
                  sx={{ 
                    ml: 1, 
                    display: 'inline-block', 
                    width: 10, 
                    height: 10, 
                    borderRadius: '50%', 
                    bgcolor: match.status === 'live' ? 'success.main' : 'text.disabled'
                  }} 
                />
              )}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  // Render fancy market selection dropdown with status indicators
  const renderFancyMarketSelection = () => {
    return (
      <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
        <InputLabel>Select a Fancy Market</InputLabel>
        <Select
          value={selectedMarket}
          onChange={(e) => setSelectedMarket(e.target.value)}
          label="Select a Fancy Market"
          disabled={!selectedMatch}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {fancyMarkets.map((market) => (
            <MenuItem key={market._id} value={market}>
              {market.name}
              {market.status && (
                <Box 
                  component="span" 
                  sx={{ 
                    ml: 1, 
                    display: 'inline-block', 
                    width: 10, 
                    height: 10, 
                    borderRadius: '50%', 
                    bgcolor: market.status === 'live' ? 'success.main' : 'text.disabled'
                  }} 
                />
              )}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  return (
    <Box m="20px">
      <Header title="Result Declaration" subtitle="Declare results for cricket matches and fancy markets" />
      
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" sx={{ color: "#19d5b4" }}>
          {tabValue === 0 ? "Match Odds Result Declaration" : "Fancy Market Result Declaration"}
        </Typography>
        <IconButton onClick={refreshAllData} color="primary" disabled={loading}>
          <RefreshIcon />
        </IconButton>
      </Box>
      
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2,backgroundColor: '#00fffc7d'  }}>
        <Tab label="Match Odds" />
        <Tab label="Fancy Markets" />
      </Tabs>
      
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" color={colors.greenAccent[400]} mb={2}>
          {tabValue === 0 ? "Declare Match Odds Result" : "Declare Fancy Market Result"}
        </Typography>
        
        <Box display="flex" flexDirection="column" gap={2}>
          {/* Match Selection */}
          {renderMatchSelection()}

          {/* Fancy Market Selection (only for Fancy tab) */}
          {tabValue === 1 && renderFancyMarketSelection()}

          {/* Result Type */}
          <FormControl fullWidth>
            <InputLabel>Result Type</InputLabel>
            <Select
              value={resultType}
              onChange={(e) => setResultType(e.target.value)}
              label="Result Type"
              disabled={loading}
            >
              <MenuItem value="win">Win</MenuItem>
              <MenuItem value="loss">Lose</MenuItem>
              <MenuItem value="cancel">Draw</MenuItem>
            </Select>
          </FormControl>
          
          {/* Result Value (not needed for cancel) */}
          {resultType !== "cancel" && (
            tabValue === 0 ? (
              <FormControl fullWidth>
                <InputLabel>Winning Team</InputLabel>
                <Select
                  value={resultValue}
                  onChange={(e) => setResultValue(e.target.value)}
                  label="Winning Team"
                  disabled={loading || !selectedMatch}
                >
                  <MenuItem value="">
                    <em>Select winning team</em>
                  </MenuItem>
                  {selectedMatch && selectedMatch.teams && selectedMatch.teams.map((team, index) => (
                    <MenuItem key={index} value={team}>
                      {team}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <TextField
                label="Result Value"
                value={resultValue}
                onChange={(e) => setResultValue(e.target.value)}
                fullWidth
                disabled={loading}
                helperText="Enter the exact numeric value for the fancy market result"
              />
            )
          )}
          
          {/* Action Buttons */}
          <Box display="flex" gap={2} mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={tabValue === 0 ? handleDeclareMatchResult : handleDeclareFancyResult}
              disabled={loading || !selectedMatch || (tabValue === 1 && !selectedMarket) || (resultType !== "cancel" && !resultValue)}
              sx={{ flex: 1 }}
            >
              {loading ? <CircularProgress size={24} /> : "Declare Result"}
            </Button>
            
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleRevertResult}
              disabled={loading || !selectedMatch || (tabValue === 1 && !selectedMarket)}
              sx={{ flex: 1 }}
            >
              Revert Result
            </Button>
          </Box>
        </Box>
      </Paper>
      
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" color={colors.greenAccent[400]}>
            Recent Declarations
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              setLoading(true);
              fetchRecentREsult()
                .then(() => {
                  showSnackbar("Declarations refreshed");
                })
                .catch((err) => {
                  console.error("Error refreshing declarations:", err);
                  showSnackbar("Failed to refresh declarations", "error");
                })
                .finally(() => {
                  setLoading(false);
                });
            }}
            disabled={loading}
            startIcon={<RefreshIcon />}
          >
            Refresh
          </Button>
        </Box>
        
        <Box height="400px">
          <DataGrid
            rows={recentDeclarations}
            columns={[
              { field: "match", headerName: "Match", flex: 1 },
              { field: "label", headerName: "Market", flex: 1 },
              { field: "type", headerName: "Bet Type", flex: 0.5 },
              { field: "run", headerName: "Selection", flex: 0.5 },
              { field: "result", headerName: "Result", flex: 0.5 },
              { field: "status", headerName: "Status", flex: 0.5,
                renderCell: (params) => (
                  <Box
                    width="80%"
                    p="5px"
                    display="flex"
                    justifyContent="center"
                    backgroundColor={
                      params.row.status === "Won"
                        ? colors.greenAccent[600]
                        : params.row.status === "Lost"
                        ? colors.redAccent[600]
                        : params.row.status === "Cancelled"
                        ? colors.blueAccent[600]
                        : colors.grey[500]
                    }
                    borderRadius="4px"
                  >
                    {params.row.status}
                  </Box>
                ),
              },
              { field: "createdAt", headerName: "Date", flex: 1 },
              {
                field: "actions",
                headerName: "Actions",
                flex: 0.5,
                renderCell: (params) => (
                  <IconButton
                    onClick={() => openDetailDialog(params.row)}
                    color="primary"
                  >
                    <InfoIcon />
                  </IconButton>
                ),
              },
            ]}
            loading={loading}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            disableSelectionOnClick
            getRowClassName={(params) =>
              params.row.status === "Won"
                ? "won-row"
                : params.row.status === "Lost"
                ? "lost-row"
                : ""
            }
          />
        </Box>
      </Paper>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      
      {/* Detail Dialog */}
      <Dialog
        open={detailDialog.open}
        onClose={closeDetailDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Bet Details</DialogTitle>
        <DialogContent>
          {detailDialog.bet && (
            <Box>
              <Typography variant="body1" gutterBottom>
                <strong>Match:</strong> {detailDialog.bet.match}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Market:</strong> {detailDialog.bet.label}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Selection:</strong> {detailDialog.bet.run}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Type:</strong> {detailDialog.bet.type}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Odds:</strong> {detailDialog.bet.odds}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Stake:</strong> ₹{parseFloat(detailDialog.bet.stake).toFixed(2)}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Profit:</strong> ₹{parseFloat(detailDialog.bet.profit).toFixed(2)}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Status:</strong> {detailDialog.bet.status}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Result:</strong> {detailDialog.bet.result}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Date:</strong> {detailDialog.bet.createdAt}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDetailDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ResultDeclaration; 