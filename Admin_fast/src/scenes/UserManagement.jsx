import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  useTheme,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  InputBase,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Collapse,
  Divider
} from "@mui/material";
import { tokens } from "../theme";
import SearchIcon from "@mui/icons-material/Search";
import Header from "../components/Header";
import axios from "axios";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

const UserManagement = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  // State management
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [userBets, setUserBets] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedGameType, setSelectedGameType] = useState("");
  const [betLoading, setBetLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [cricketMatches, setCricketMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [selectedView, setSelectedView] = useState(null);
  const [matchOpen, setMatchOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  
  // Game type options
  const gameTypes = [
    { value: "", label: "All Games" },
    { value: "matka", label: "Matka" },
    { value: "titli", label: "Titli" },
    { value: "aviator", label: "Aviator" },
    { value: "mines", label: "Mines" },
    { value: "cricket", label: "Cricket" },
    { value: "aarpaarparchi", label: "Aar Paar Parchi" }
  ];
  
  // Fetch all users using the same endpoint as the All Users page
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        // Using absolute URL instead of relying on proxy
        const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:4000";
        console.log("Backend URL:", backendUrl);
        
        const response = await fetch(`${backendUrl}/api/users/admin`);
        if (!response.ok) {
          console.error("Failed to fetch users:", response.status, response.statusText);
          throw new Error(`HTTP error ${response.status}`);
        }
        
        const data = await response.json();
        console.log("User data received:", data);
        
        // Format data based on response structure
        const formattedUsers = data.map(user => ({
          _id: user._id,
          username: user.username,
          email: user.email,
          userNo: user.userNo || user._id.substring(0, 8),
          balance: user.wallet ? user.wallet.balance : 0,
          exposureBalance: user.wallet ? user.wallet.exposureBalance : 0,
          createdAt: user.createdAt || new Date().toISOString()
        }));
        
        setUsers(formattedUsers);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  // Filtered users based on search term
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.userNo && user.userNo.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Handle view user bet history
  const handleViewBets = async (user) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
    setSelectedGameType("cricket"); // Set cricket as default
    await fetchUserBets(user._id, "cricket"); // Always fetch cricket bets
  };
  
  // Fetch user bets
  const fetchUserBets = async (userId, gameType = "") => {
    try {
      setBetLoading(true);
      setUserBets([]); // Clear existing bets
      setCricketMatches([]); // Clear existing matches
      setSelectedMatch(null);
      setSelectedView(null);

      const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:4000";
      let apiUrl;
      
      if (gameType === "cricket") {
        // First try to get session bets
        apiUrl = `${backendUrl}/api/cricket-market/getbets?userId=${userId}`;
        const sessionResponse = await fetch(apiUrl);
        
        if (!sessionResponse.ok) {
          throw new Error(`HTTP error ${sessionResponse.status}`);
        }
        
        const sessionData = await sessionResponse.json();
        
        // If no session bets, try to get lagai khai matches
        if (!sessionData || sessionData.length === 0) {
          const lagaiKhaiResponse = await fetch(`${backendUrl}/api/laggai_khai_getuserbet/${userId}`);
          if (!lagaiKhaiResponse.ok) {
            throw new Error(`HTTP error ${lagaiKhaiResponse.status}`);
          }
          
          const lagaiKhaiData = await lagaiKhaiResponse.json();
          
          if (lagaiKhaiData.success && lagaiKhaiData.bets) {
            // Group bets by match name
            const matches = {};
            lagaiKhaiData.bets.forEach(bet => {
              if (!matches[bet.match]) {
                matches[bet.match] = [];
              }
              matches[bet.match].push(bet);
            });

            // Convert to array format
            const matchList = Object.keys(matches).map(matchName => ({
              name: matchName,
              bets: matches[matchName]
            }));

            setCricketMatches(matchList);
          }
        } else {
          // Group bets by match name for session bets
          const matches = {};
          sessionData.forEach(bet => {
            if (!matches[bet.matchName]) {
              matches[bet.matchName] = [];
            }
            matches[bet.matchName].push(bet);
          });

          // Convert to array format
          const matchList = Object.keys(matches).map(matchName => ({
            name: matchName,
            bets: matches[matchName]
          }));

          setCricketMatches(matchList);
        }
      } else {
        apiUrl = `${backendUrl}/api/admin/users/${userId}/bets${gameType ? `?gameType=${gameType}` : ""}`;
        const otherResponse = await fetch(apiUrl);
        
        if (!otherResponse.ok) {
          throw new Error(`HTTP error ${otherResponse.status}`);
        }
        
        const otherData = await otherResponse.json();
        if (otherData && Array.isArray(otherData.bets)) {
          setUserBets(otherData.bets);
        } else {
          setUserBets([]);
        }
      }
      
      setBetLoading(false);
    } catch (error) {
      console.error("Error fetching user bets:", error);
      setBetLoading(false);
      setUserBets([]);
    }
  };
  
  // Add fetchLagaiKhaiData function after fetchUserBets
  const fetchLagaiKhaiData = async (userId, matchName) => {
    try {
      setBetLoading(true);
      const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:4000";
      const response = await fetch(`${backendUrl}/api/laggai_khai_getuserbet/${userId}/${matchName}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const data = await response.json();
      if (data.success && data.bets) {
        setUserBets(data.bets);
      } else {
        setUserBets([]);
      }
    } catch (error) {
      console.error("Error fetching lagai khai data:", error);
      setUserBets([]);
    } finally {
      setBetLoading(false);
    }
  };
  
  // Handle game type change
  const handleGameTypeChange = (event) => {
    const newGameType = event.target.value;
    setSelectedGameType(newGameType);
    if (selectedUser) {
      fetchUserBets(selectedUser._id, newGameType);
    }
  };
  
  // Handle close dialog
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedUser(null);
    setUserBets([]);
    setSelectedGameType("");
  };
  
  // Handle pagination change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  // Render bet amount based on game type
  const renderBetAmount = (bet) => {
    if (bet.gameType === 'Matka') {
      return bet.totalBidPoints || 0;
    } else if (bet.gameType === 'Titli') {
      return bet.betAmount || 0;
    } else if (bet.gameType === 'Aviator') {
      return bet.betAmt || 0; 
    } else if (bet.gameType === 'Mines') {
      return bet.betAmt || 0;
    } else if (bet.gameType === 'Cricket') {
      return bet.stake || 0;
    } else if (bet.gameType === 'Aar Paar Parchi' || bet.gameType === 'aarPaarParchi' || bet.gameType === 'aarpaarparchi') {
      return bet.betpoints || 0;
    } else {
      return bet.amount || bet.betAmount || bet.betAmt || bet.totalBidPoints || bet.stake || bet.betpoints || 0;
    }
  };
  
  // Render win/loss status based on game type
  const renderWinStatus = (bet) => {
    if (bet.gameType === 'Aviator' || bet.gameType === 'Mines') {
      return bet.isWin === 'win' || bet.isWin === true ? (
        <Chip label="Win" color="success" size="small" />
      ) : bet.isWin === 'loss' || bet.isWin === false ? (
        <Chip label="Loss" color="error" size="small" />
      ) : (
        <Chip label="Pending" color="default" size="small" />
      );
    } else if (bet.gameType === 'Cricket') {
      return bet.result === 'win' ? (
        <Chip label="Win" color="success" size="small" />
      ) : bet.result === 'loss' ? (
        <Chip label="Loss" color="error" size="small" />
      ) : bet.result === 'cancel' ? (
        <Chip label="Cancelled" color="warning" size="small" />
      ) : (
        <Chip label={bet.result || "Pending"} color="default" size="small" />
      );
    } else if (bet.isWin !== undefined) {
      return bet.isWin ? (
        <Chip label="Win" color="success" size="small" />
      ) : (
        <Chip label="Loss" color="error" size="small" />
      );
    } else if (bet.status) {
      return bet.status.toLowerCase() === 'win' ? (
        <Chip label="Win" color="success" size="small" />
      ) : bet.status.toLowerCase() === 'loss' ? (
        <Chip label="Loss" color="error" size="small" />
      ) : (
        <Chip label={bet.status} color="default" size="small" />
      );
    } else {
      return <Chip label="Unknown" color="default" size="small" />;
    }
  };
  
  // Render profit/loss amount
  const renderProfitLoss = (bet) => {
    let profitValue = 0;
    
    if (bet.gameType === 'Aviator' || bet.gameType === 'Mines') {
      profitValue = bet.winningAmt || 0;
    } else if (bet.gameType === 'Titli') {
      profitValue = bet.profit || 0;
    } else if (bet.gameType === 'Cricket') {
      profitValue = bet.profitA || 0;
    } else if (bet.gameType === 'Aar Paar Parchi' || bet.gameType === 'aarPaarParchi' || bet.gameType === 'aarpaarparchi') {
      profitValue = bet.profit || 0;
    } else if (bet.gameType === 'Matka') {
      profitValue = bet.estimatedProfit || 0;
    } else {
      profitValue = bet.profit || bet.winningAmt || bet.winAmount || 0;
    }
    
    return profitValue > 0 ? (
      <Typography color="success.main">+{profitValue}</Typography>
    ) : profitValue < 0 ? (
      <Typography color="error.main">{profitValue}</Typography>
    ) : (
      <Typography>0</Typography>
    );
  };
  
  // Add this new function to render cricket bet details
  const renderCricketBetDetails = (bet) => {
    return (
      <Box>
        <Typography variant="body2">{bet.matbet}</Typography>
        <Typography variant="caption" color="text.secondary">
          Mode: {bet.mode.toUpperCase()} | Odds: {bet.odds} | Rate: {bet.rate}
        </Typography>
        {bet.yesRuns !== undefined && (
          <Typography variant="caption" color="text.secondary">
            Yes Runs: {bet.yesRuns}
          </Typography>
        )}
        {bet.noRuns !== undefined && (
          <Typography variant="caption" color="text.secondary">
            No Runs: {bet.noRuns}
          </Typography>
        )}
      </Box>
    );
  };
  
  // Modify the renderAdditionalDetails function
  const renderAdditionalDetails = (bet) => {
    if (bet.gameType === 'Matka') {
      return bet.bidType ? `${bet.bidType} | ${bet.gameName || ''}` : bet.gameName || '';
    } else if (bet.gameType === 'Titli') {
      return bet.titliGameId ? `Game ID: ${bet.titliGameId}` : '';
    } else if (bet.gameType === 'Aviator') {
      return bet.multiplier ? `Multiplier: ${bet.multiplier}x` : '';
    } else if (bet.gameType === 'Mines') {
      return bet.round_id ? `Round: ${bet.round_id}` : '';
    } else if (bet.gameType === 'Cricket') {
      return renderCricketBetDetails(bet);
    } else if (bet.gameType === 'Aar Paar Parchi' || bet.gameType === 'aarPaarParchi' || bet.gameType === 'aarpaarparchi') {
      return bet.matchName ? `Match: ${bet.matchName}` : '';
    } else {
      return '';
    }
  };
  
  // Handle match selection
  const handleMatchSelect = (match) => {
    setSelectedMatch(match);
    setMatchOpen(!matchOpen);
    setSelectedView(null);
    
    // If there are no session bets, automatically select lagai khai view
    if (!match.bets || match.bets.length === 0) {
      setSelectedView('lagai-khai');
      fetchLagaiKhaiData(selectedUser._id, match.name);
    }
  };

  // Modify handleViewSelect function
  const handleViewSelect = (view) => {
    setSelectedView(view);
    setViewOpen(!viewOpen);
    if (view === 'session') {
      setUserBets(selectedMatch.bets);
    } else if (view === 'lagai-khai' && selectedMatch) {
      fetchLagaiKhaiData(selectedUser._id, selectedMatch.name);
    }
  };

  // Render cricket match list
  const renderCricketMatches = () => {
    return (
      <Box>
        <List component="nav" sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {cricketMatches.map((match) => (
            <Box key={match.name}>
              <ListItemButton onClick={() => handleMatchSelect(match)}>
                <ListItemText 
                  primary={match.name}
                  secondary={!match.bets || match.bets.length === 0 ? "No session bets" : ""}
                />
                {matchOpen && selectedMatch?.name === match.name ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={matchOpen && selectedMatch?.name === match.name} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {(!match.bets || match.bets.length === 0) ? (
                    <ListItem sx={{ pl: 4 }}>
                      <ListItemText 
                        primary="Lagai Khai"
                        secondary="No session bets available"
                      />
                    </ListItem>
                  ) : (
                    <>
                      <ListItemButton sx={{ pl: 4 }} onClick={() => handleViewSelect('lagai-khai')}>
                        <ListItemText primary="Lagai Khai" />
                        {viewOpen && selectedView === 'lagai-khai' ? <ExpandLess /> : <ExpandMore />}
                      </ListItemButton>
                      <ListItemButton sx={{ pl: 4 }} onClick={() => handleViewSelect('session')}>
                        <ListItemText primary="Session" />
                        {viewOpen && selectedView === 'session' ? <ExpandLess /> : <ExpandMore />}
                      </ListItemButton>
                    </>
                  )}
                </List>
              </Collapse>
              <Divider />
            </Box>
          ))}
        </List>

        {selectedView === 'session' && selectedMatch && (
          <Box mt={3}>
            {(!selectedMatch.bets || selectedMatch.bets.length === 0) ? (
              <Box width="100%" textAlign="center" p={5}>
                <Typography variant="h5" color="text.secondary">
                  No session bets available for this match
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  This match only has lagai khai bets. Please select "Lagai Khai" view to see the bets.
                </Typography>
              </Box>
            ) : (
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Bet Type</TableCell>
                      <TableCell>Mode</TableCell>
                      <TableCell>Runs</TableCell>
                      <TableCell>Stake</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Profit/Loss</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedMatch.bets.map((bet, index) => (
                      <TableRow key={bet._id || `bet-${index}`} hover>
                        <TableCell>{formatDate(bet.createdAt) || 'N/A'}</TableCell>
                        <TableCell>{bet.matbet || 'N/A'}</TableCell>
                        <TableCell>{(bet.mode || 'N/A').toUpperCase()}</TableCell>
                        <TableCell>
                          {bet.mode === 'yes' ? (bet.yesRuns || 'N/A') : (bet.noRuns || 'N/A')}
                        </TableCell>
                        <TableCell>₹{bet.stake || 0}</TableCell>
                        <TableCell>
                          {bet.result === 'win' ? (
                            <Chip label="Win" color="success" size="small" />
                          ) : bet.result === 'loss' ? (
                            <Chip label="Loss" color="error" size="small" />
                          ) : bet.result === 'cancel' ? (
                            <Chip label="Cancelled" color="warning" size="small" />
                          ) : (
                            <Chip label={bet.result || "Pending"} color="default" size="small" />
                          )}
                        </TableCell>
                        <TableCell>
                          {bet.profitA > 0 ? (
                            <Typography color="success.main">+{bet.profitA}</Typography>
                          ) : bet.profitA < 0 ? (
                            <Typography color="error.main">{bet.profitA}</Typography>
                          ) : (
                            <Typography>0</Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        )}

        {selectedView === 'lagai-khai' && (
          <Box mt={3}>
            {betLoading ? (
              <Box display="flex" justifyContent="center" width="100%" p={5}>
                <CircularProgress />
              </Box>
            ) : userBets.length > 0 ? (
              <>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Label</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Odds</TableCell>
                        <TableCell>Stake</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {userBets.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((bet, index) => (
                        <TableRow key={bet._id || `bet-${index}`} hover>
                          <TableCell>{formatDate(bet.createdAt)}</TableCell>
                          <TableCell>{bet.label}</TableCell>
                          <TableCell>{bet.type}</TableCell>
                          <TableCell>{bet.odds}</TableCell>
                          <TableCell>₹{bet.stake}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={userBets.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </>
            ) : (
              <Box width="100%" textAlign="center" p={5}>
                <Typography variant="h5" color="text.secondary">
                  No lagai khai bets found for this match
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>
    );
  };
  
  return (
    <Box m="20px">
      {/* Header and Search Bar in Same Row */}
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        mb={3}
        sx={{
          backgroundColor: colors.primary[400],
          p: 2,
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        <Header title="USER MANAGEMENT" subtitle="View and manage user accounts and bet history" />
        <Box 
          display="flex" 
          backgroundColor={colors.primary[500]} 
          borderRadius="8px" 
          width="30%"
          sx={{
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            '&:hover': {
              backgroundColor: colors.primary[600],
            }
          }}
        >
          <InputBase
            type="text"
            placeholder="Search by name, email or ID..."
            sx={{ 
              ml: 2, 
              flex: 1,
              color: colors.grey[100],
              '& input::placeholder': {
                color: colors.grey[300],
                opacity: 1,
              }
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <IconButton 
            sx={{ 
              p: 1,
              color: colors.grey[100],
              '&:hover': {
                backgroundColor: colors.primary[700],
              }
            }} 
            type="button"
          >
            <SearchIcon />
          </IconButton>
        </Box>
      </Box>
      
      {/* Users list */}
      <Box 
        mt={3}
        sx={{
          backgroundColor: colors.primary[400],
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          p: 2
        }}
      >
        {loading ? (
          <Box display="flex" justifyContent="center" width="100%" p={5}>
            <CircularProgress />
          </Box>
        ) : filteredUsers.length > 0 ? (
          <TableContainer component={Paper} sx={{ borderRadius: '8px', overflow: 'hidden' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: colors.primary[500] }}>
                  <TableCell sx={{ color: colors.grey[100], fontWeight: 'bold' }}>Username</TableCell>
                  <TableCell sx={{ color: colors.grey[100], fontWeight: 'bold' }}>User ID</TableCell>
                  <TableCell sx={{ color: colors.grey[100], fontWeight: 'bold' }}>Email</TableCell>
                  <TableCell sx={{ color: colors.grey[100], fontWeight: 'bold' }}>Balance</TableCell>
                  <TableCell sx={{ color: colors.grey[100], fontWeight: 'bold' }}>Exposure</TableCell>
                  <TableCell sx={{ color: colors.grey[100], fontWeight: 'bold' }}>Joined Date</TableCell>
                  <TableCell sx={{ color: colors.grey[100], fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow 
                    key={user._id} 
                    hover
                    sx={{
                      '&:nth-of-type(odd)': {
                        backgroundColor: colors.primary[400],
                      },
                      '&:hover': {
                        backgroundColor: colors.primary[500],
                      }
                    }}
                  >
                    <TableCell sx={{ color: colors.grey[100] }}>{user.username}</TableCell>
                    <TableCell sx={{ color: colors.grey[100] }}>{user.userNo || user._id.substring(0, 8)}</TableCell>
                    <TableCell sx={{ color: colors.grey[100] }}>{user.email}</TableCell>
                    <TableCell sx={{ color: colors.grey[100] }}>₹{user.balance.toFixed(2)}</TableCell>
                    <TableCell sx={{ color: colors.grey[100] }}>₹{user.exposureBalance?.toFixed(2) || '0.00'}</TableCell>
                    <TableCell sx={{ color: colors.grey[100] }}>{formatDate(user.createdAt)}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          backgroundColor: colors.greenAccent[600],
                          '&:hover': {
                            backgroundColor: colors.greenAccent[700],
                          },
                          borderRadius: '4px',
                          textTransform: 'none',
                          fontWeight: 'bold',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                        onClick={() => handleViewBets(user)}
                      >
                        View Bets
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={filteredUsers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                backgroundColor: colors.primary[500],
                color: colors.grey[100],
                '& .MuiTablePagination-selectIcon': {
                  color: colors.grey[100]
                }
              }}
            />
          </TableContainer>
        ) : (
          <Box 
            width="100%" 
            textAlign="center" 
            p={5}
            sx={{
              backgroundColor: colors.primary[500],
              borderRadius: '8px',
              color: colors.grey[100]
            }}
          >
            <Typography variant="h5">No users found</Typography>
          </Box>
        )}
      </Box>
      
      {/* User bets dialog */}
      <Dialog 
        open={isDialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: colors.primary[400],
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
          }
        }}
      >
        <DialogTitle sx={{ backgroundColor: colors.primary[500], color: colors.grey[100] }}>
          {selectedUser && (
            <Box>
              <Typography variant="h5" component="div">
                {selectedUser.username}'s Bet History
              </Typography>
              <Typography color={colors.grey[300]} variant="body2">
                User ID: {selectedUser.userNo || selectedUser._id.substring(0, 8)} | Balance: ₹{selectedUser.balance.toFixed(2)}
              </Typography>
            </Box>
          )}
        </DialogTitle>
        
        <DialogContent sx={{ backgroundColor: colors.primary[400] }}>
          <Box mb={3} display="flex" justifyContent="flex-end">
            <Button 
              variant="contained"
              color="primary" 
              size="small"
              onClick={() => selectedUser && fetchUserBets(selectedUser._id, "cricket")}
              disabled={betLoading}
              sx={{
                backgroundColor: colors.greenAccent[600],
                '&:hover': {
                  backgroundColor: colors.greenAccent[700],
                },
                borderRadius: '4px',
                textTransform: 'none',
                fontWeight: 'bold',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              Refresh
            </Button>
          </Box>
          
          {betLoading ? (
            <Box display="flex" justifyContent="center" width="100%" p={5}>
              <CircularProgress />
            </Box>
          ) : (
            renderCricketMatches()
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default UserManagement; 