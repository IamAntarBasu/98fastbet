const JWT_SECRET = 'bunneybet';
const express = require('express');
const app = express();
const cors = require('cors');
const User = require('./models/UserSignUp');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User_Wallet = require('./models/Wallet.js');
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
const playerRouter = require("./Routes/cricket/playerRoutes");
dotenv.config();
const axios = require('axios');
const cricketMarketRoutes = require('./Routes/cricketMarketRoutes');
const cheerio = require('cheerio');
const moment = require('moment'); // For Node.js
app.use(express.json());

// Initialize application data and caches
app.locals.betCache = null;

const betRoutes = require('./Routes/betRoutes');
const matkaRouter = require('./Routes/matkaRoutes.js');
const Matka = require('./models/matkaModel.js')
const papuRouter = require("./Routes/pappuRoutes.js")
const AddPointRouter = require("./controller/addPointsController")
const withdraw = require("./Routes/withdrwaRoter.js")
const crickbetRoutes = require("./Routes/crickbetRoutes.js")
const minesRouter = require('./Routes/minesRoute.js')
const bankDetailsRouter = require("./controller/bankDetails.js")
const http = require("http");
const matchRouter = require("./Routes/matchRouter.js")
const aviatorSocketController = require('./controller/aviatorSocketController');
const socketIo = require("socket.io");
const server = http.createServer(app);
const aarParParchiRouter = require('./Routes/aarPaarParchiRoutes.js');
const avaitorRouter = require("./Routes/avaitorRoutes.js")
const crashAvaitorRouter = require('./Routes/crashAvaitorRoutes.js')
const titliWinnerRouter = require("./Routes/titliWinnerRoutes.js")
const marketLogicRoutes = require('./Routes/marketLogicRoutes.js')
const sessionResultRoutes = require("./Routes/sessionResultRoutes.js")
const pageRoutes = require("./Routes/pagesRoute.js");
const deletedataRoute = require("./Routes/deletedataRoute.js")
const adminRoutes = require("./Routes/adminRoutes.js")


const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
});



port = 4000
// CORS configuration
app.use(cors({
  origin: '*', // Allow all origins for development
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

const MONGO_URI = process.env.mongodb_url;
// MongoDB connection
mongoose.connect(`mongodb+srv://siddharthojha421:yPlKyyZpefa9Y5lJ@cluster0.rtjwl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
  .then(() => console.log("MongoDB Connected Successfully!"))
  .catch(err => console.error("MongoDB Connection Error:", err));
// // Initialize the Aviator game socket controller
aviatorSocketController.initializeGame(io);
  const NodeCache = require('node-cache');
  const cache = new NodeCache({ stdTTL: 60 });
  
  const marketMapping = {
    1: "SRIDEVI MORNING",
    10: "MILAN MORNING",
    13: "KALYAN MORNING",
    16: "SRIDEVI",
    22: "TIME BAZAR",
    25: "MADHUR DAY",
    31: "RAJDHANI DAY",
    34: "MILAN DAY",
    40: "KALYAN",
    46: "SRIDEVI NIGHT",
    58: "MILAN NIGHT",
    61: "KALYAN NIGHT",
    64: "RAJDHANI NIGHT",
    // 71: "abc",
  };
  
  const fetchMarketData = async () => {
    try {
      console.log('Fetching fresh market data...');
      const url = 'https://www.shrimatka.in';
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);
  
      const markets = [];
  
      $('.clmn.clmn6.mblinbk.center').each((i, el) => {
        const marketNumber = i + 1;
        const marketName = marketMapping[marketNumber];
  
        if (!marketName) return; // Skip markets not in mapping
  
        const vCenterChildren = $(el).find('.v-center').children();
        const openNumber = vCenterChildren.eq(0)?.text().trim() || '*';
        const jodiDigit = vCenterChildren.eq(1)?.text().trim() || '*';
        const closeNumber = vCenterChildren.eq(2)?.text().trim() || '*';
  
        const openTime = $(el).find('.cmlo.font1 .clmn.clmn6.center.mblinbk span').first().text().trim();
        const closeTime = $(el).find('.cmlo.font1 .clmn.clmn6.center.mblinbk span').last().text().trim();
  
        if (!openTime || !closeTime || openTime === 'N/A' || closeTime === 'N/A') {
          return; // Skip markets without valid open/close times
        }
  
        const currentTime = moment();
        const openTimeMoment = moment(openTime, 'hh:mm a').subtract(5, 'hours').subtract(30, 'minutes');
        const closeTimeMoment = moment(closeTime, 'hh:mm a').subtract(5, 'hours').subtract(30, 'minutes');
        
        const isBeforeOpenTime = currentTime.isBefore(openTimeMoment);
        const isBeforeCloseTime = currentTime.isBefore(closeTimeMoment);
        
        let bidStatus;
        
        if (!isBeforeOpenTime && isBeforeCloseTime) {
          bidStatus = "Close";  // ✅ If open time has passed but close time has not
        } else if (!isBeforeOpenTime && !isBeforeCloseTime) {
          bidStatus = "Closed"; // ✅ If both open time and close time have passed
        } else if (isBeforeOpenTime && isBeforeCloseTime) {
          bidStatus = "Open | Close"; // ✅ If neither open time nor close time has passed
        }
        
       
        
  
        markets.push({
          marketNumber,
          marketName,
          openNumber,
          jodiDigit,
          closeNumber,
          openTime,
          closeTime,
          bidStatus
        });
      });
  
      const matkaData = await Matka.find();
    if (Array.isArray(matkaData)) {
      matkaData.forEach(data => {
        if (!Object.values(marketMapping).includes(data.marketName)) {
          return; // ✅ Skip if marketName is not in marketMapping
        }
  
        // ✅ Check if marketName already exists in `markets`
        const existingMarket = markets.find(m => m.marketName === data.marketName);
        if (!existingMarket) {
          const currentTime = moment();
          const openTimeMoment = moment(openTime, 'hh:mm a').subtract(5, 'hours').subtract(30, 'minutes');
          const closeTimeMoment = moment(closeTime, 'hh:mm a').subtract(5, 'hours').subtract(30, 'minutes');
          
          const isBeforeOpenTime = currentTime.isBefore(openTimeMoment);
          const isBeforeCloseTime = currentTime.isBefore(closeTimeMoment);
          
          let bidStatus;
          
          if (!isBeforeOpenTime && isBeforeCloseTime) {
            bidStatus = "Close";  // ✅ If open time has passed but close time has not
          } else if (!isBeforeOpenTime && !isBeforeCloseTime) {
            bidStatus = "Closed"; // ✅ If both open time and close time have passed
          } else if (isBeforeOpenTime && isBeforeCloseTime) {
            bidStatus = "Open | Close"; // ✅ If neither open time nor close time has passed
          }
          
        
          markets.push({
            marketName: data.marketName,
            openNumber: data.openNumber,
            jodiDigit: data.jodiDigit,
            closeNumber: data.closeNumber,
            openTime: data.openTime,
            closeTime: data.closeTime,
            bidStatus
          });
        }
      });
    } else {
      console.error("matkaData is not an array:", matkaData);
    }
      cache.set('marketData', markets);
      return markets;
  
    } catch (error) {
      console.error('Error fetching data:', error.message);
      return [];
    }
  };
  
  app.get('/api/subscription-state', async (req, res) => {
    let markets = cache.get('marketData');
  
    if (!markets) {
      markets = await fetchMarketData();
    }
  
    res.json({ markets });
  });
  
  setInterval(fetchMarketData, 60000);











// const NodeCache = require('node-cache');
// const cache = new NodeCache({ stdTTL: 60 });

// const marketMapping = {
//   1: "SRIDEVI MORNING",
//   10: "MILAN MORNING",
//   13: "KALYAN MORNING",
//   16: "SRIDEVI",
//   22: "TIME BAZAR",
//   25: "MADHUR DAY",
//   31: "RAJDHANI DAY",
//   34: "MILAN DAY",
//   40: "KALYAN",
//   46: "SRIDEVI NIGHT",
//   58: "MILAN NIGHT",
//   61: "KALYAN NIGHT",
//   64: "RAJDHANI NIGHT",
//   // 71: "abc",
// };

// const fetchMarketData = async () => {
//   try {
//     console.log('Fetching fresh market data...');
//     const url = 'https://www.shrimatka.in';
//     const { data } = await axios.get(url);
//     const $ = cheerio.load(data);

//     const markets = [];

//     $('.clmn.clmn6.mblinbk.center').each((i, el) => {
//       const marketNumber = i + 1;
//       const marketName = marketMapping[marketNumber];

//       if (!marketName) return; // Skip markets not in mapping

//       const vCenterChildren = $(el).find('.v-center').children();
//       const openNumber = vCenterChildren.eq(0)?.text().trim() || '*';
//       const jodiDigit = vCenterChildren.eq(1)?.text().trim() || '*';
//       const closeNumber = vCenterChildren.eq(2)?.text().trim() || '*';

//       const openTime = $(el).find('.cmlo.font1 .clmn.clmn6.center.mblinbk span').first().text().trim();
//       const closeTime = $(el).find('.cmlo.font1 .clmn.clmn6.center.mblinbk span').last().text().trim();

//       if (!openTime || !closeTime || openTime === 'N/A' || closeTime === 'N/A') {
//         return; // Skip markets without valid open/close times
//       }

//       const currentTime = moment();
//       const openTimeMoment = moment(openTime, 'hh:mm a').subtract(5, 'hours').subtract(30, 'minutes');
//       const closeTimeMoment = moment(closeTime, 'hh:mm a').subtract(5, 'hours').subtract(30, 'minutes');
      
//       const isBeforeOpenTime = currentTime.isBefore(openTimeMoment);
//       const isBeforeCloseTime = currentTime.isBefore(closeTimeMoment);
      
//       let bidStatus;
      
//       if (!isBeforeOpenTime && isBeforeCloseTime) {
//         bidStatus = "Close";  // ✅ If open time has passed but close time has not
//       } else if (!isBeforeOpenTime && !isBeforeCloseTime) {
//         bidStatus = "Closed"; // ✅ If both open time and close time have passed
//       } else if (isBeforeOpenTime && isBeforeCloseTime) {
//         bidStatus = "Open | Close"; // ✅ If neither open time nor close time has passed
//       }
      
     
      

//       markets.push({
//         marketNumber,
//         marketName,
//         openNumber,
//         jodiDigit,
//         closeNumber,
//         openTime,
//         closeTime,
//         bidStatus
//       });
//     });

//     const matkaData = await Matka.find();
//   if (Array.isArray(matkaData)) {
//     matkaData.forEach(data => {
//       if (!Object.values(marketMapping).includes(data.marketName)) {
//         return; // ✅ Skip if marketName is not in marketMapping
//       }

//       // ✅ Check if marketName already exists in `markets`
//       const existingMarket = markets.find(m => m.marketName === data.marketName);
//       if (!existingMarket) {
//         const currentTime = moment();
//         const openTimeMoment = moment(openTime, 'hh:mm a').subtract(5, 'hours').subtract(30, 'minutes');
//         const closeTimeMoment = moment(closeTime, 'hh:mm a').subtract(5, 'hours').subtract(30, 'minutes');
        
//         const isBeforeOpenTime = currentTime.isBefore(openTimeMoment);
//         const isBeforeCloseTime = currentTime.isBefore(closeTimeMoment);
        
//         let bidStatus;
        
//         if (!isBeforeOpenTime && isBeforeCloseTime) {
//           bidStatus = "Close";  // ✅ If open time has passed but close time has not
//         } else if (!isBeforeOpenTime && !isBeforeCloseTime) {
//           bidStatus = "Closed"; // ✅ If both open time and close time have passed
//         } else if (isBeforeOpenTime && isBeforeCloseTime) {
//           bidStatus = "Open | Close"; // ✅ If neither open time nor close time has passed
//         }
        
       
        

//         markets.push({
//           marketName: data.marketName,
//           openNumber: data.openNumber,
//           jodiDigit: data.jodiDigit,
//           closeNumber: data.closeNumber,
//           openTime: data.openTime,
//           closeTime: data.closeTime,
//           bidStatus
//         });
//       }
//     });
//   } else {
//     console.error("matkaData is not an array:", matkaData);
//   }
//     cache.set('marketData', markets);
//     return markets;

//   } catch (error) {
//     console.error('Error fetching data:', error.message);
//     return [];
//   }
// };

// app.get('/api/subscription-state', async (req, res) => {
//   let markets = cache.get('marketData');

//   if (!markets) {
//     markets = await fetchMarketData();
//   }

//   res.json({ markets });
// });

// setInterval(fetchMarketData, 60000);



app.get('/api/name/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Find the user and wallet by ID
    const user = await User.findById(id);
    const wallet = await User_Wallet.findOne({ user: id });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Respond with username, wallet balance, exposure balance, and email
    res.json({ 
      username: user.username, 
      walletBalance: wallet.balance, 
      exposureBalance: wallet.exposureBalance || 0, 
      email: user.email,
      userNo: user.userNo 
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Sign Up Route
app.post('/api/signup', async (req, res) => {
  const { username, email, password } = req.body;

  // Ensure all fields are provided
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    let userNo;
    let count = 5000;
    do {
      userNo = `C${count}`;
      count++;
    } while (await User.findOne({ userNo }));

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      userNo,
    });

    const savedUser = await newUser.save();

    // Create a wallet for the new user
    const wallet = new User_Wallet({
      user: savedUser._id,
      balance: 0, // Set an initial wallet balance if desired
    });
    await wallet.save();

    // Link the wallet to the user
    savedUser.wallet = wallet._id;
    await savedUser.save();

    // Respond with success
    res.status(201).json({
      message: 'User registered successfully',
      user: { id: savedUser._id, username: savedUser.username, email: savedUser.email ,userNo:savedUser.userNo},
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login Route
app.post('/api/login', async (req, res) => {
  const { userNo, password } = req.body;

  if (!userNo || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const user = await User.findOne({ userNo }).populate('wallet');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        walletBalance: user.wallet?.balance || 0,
        userNo:user.userNo,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/forgot-password', async (req, res) => {
  const { email, newPassword } = req.body;
  console.log(email, newPassword)
  // Check if email and new password are provided
  if (!email || !newPassword) {
    return res.status(400).json({ message: 'Email and new password are required' });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.use('/api', aarParParchiRouter);
app.use("/", matkaRouter)
app.use("/", playerRouter)
app.use("/",crickbetRoutes)
app.use('/api', AddPointRouter);
app.use(betRoutes);
app.use("/api",papuRouter)
app.use('/api', bankDetailsRouter);
app.use('/api', withdraw);
app.use('/api', minesRouter)
app.use('/api', matchRouter);
app.use('/api', avaitorRouter);
app.use('/api', crashAvaitorRouter);
app.use('/api', titliWinnerRouter);
app.use("/api", marketLogicRoutes);
app.use("/", cricketMarketRoutes);
app.use("/", sessionResultRoutes);
app.use('/api', pageRoutes);
app.use('/api',deletedataRoute);

// Admin routes with explicit path
app.use('/api/admin', adminRoutes);
console.log('Admin routes registered at /api/admin');

// Add endpoint for fetching matches by sport ID
app.get('/api/matches/:sportId', (req, res) => {
  const { sportId } = req.params;
  
  // For cricket (sportId = 4), return the live matches
  if (sportId === '4') {
    // Format data to match expected frontend structure
    const formattedMatches = liveData.matches.map(match => ({
      id: match.eventId,
      matchId: match.eventId,
      name: match.matchName,
      event_date: new Date().toISOString(), // Current date as this is live
      league: { name: 'Cricket League' },
      status: 'live',
      marketId: match.marketId,
      scoreIframe: match.scoreIframe
    }));
    
    return res.json({
      success: true,
      data: formattedMatches
    });
  }
  
  // For other sports, return empty array for now
  // TODO: Implement other sports
  return res.json({
    success: true,
    data: []
  });
});

// Define endpoint for match details
app.get('/api/match/:eventId', (req, res) => {
  const { eventId } = req.params;
  
  // Find the match in liveData
  const match = liveData.matches.find(m => m.eventId === eventId);
  
  if (!match) {
    return res.status(404).json({
      success: false,
      message: 'Match not found'
    });
  }
  
  // Get odds for this match
  const matchOdds = liveData.odds[match.marketId] || {};
  
  // Format response
  const matchData = {
    match: {
      id: match.eventId,
      name: match.matchName,
      marketId: match.marketId,
      scoreIframe: match.scoreIframe,
      status: 'OPEN',
      runners: matchOdds.matchOdds || [],
      minStake: 100,
      maxStake: 10000,
      betDelay: 0
    },
    markets: [],
    fancyMarkets: matchOdds.fancyMarkets || [],
    bookmakers: [],
    upcoming: []
  };
  
  return res.json(matchData);
});

let liveData = {
  matches: [],
  odds: {},
};

// Fetch ongoing matches every second
const fetchOngoingMatches = async () => {
  try {
    const response = await axios.post(
      "https://api.btx99.com/v1/sports/matchList",
      {},
      {
        headers: {
          Authorization: "Bearer YOUR_VALID_TOKEN_HERE", // Replace with a valid token
          Accept: "application/json",
          Origin: "https://btx99.com",
          Referer: "https://btx99.com/",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0",
        },
      }
    );
    liveData.matches = response.data.data.map((match) => ({
      eventId: match.eventId,
      matchName: match.matchName,
      marketId: match.marketId,
      scoreIframe: match.scoreIframe,
      matchDate: match.matchDate,
    }));
    io.emit("updateMatches", liveData.matches);
  } catch (error) {
    console.error("Error fetching ongoing matches:", error.message);
  }
};

// Fetch odds for each market ID
const fetchOdds = async () => {
  try {
    const marketIds = liveData.matches.map((match) => match.marketId);
    if (marketIds.length === 0) return;

    for (const marketId of marketIds) {
      const response = await axios.get(
        `https://vigcache.crickexpo.in/v2/api/oddsDataNew?market_id=${marketId}`,
        {
          headers: {
            accept: 'application/json, text/plain, /',
            'accept-language': 'en-US,en;q=0.9,en-IN;q=0.8',
            origin: 'https://btx99.com',
            referer: 'https://btx99.com/',
            'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Microsoft Edge";v="134"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'cross-site',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0',
          },
        }
      );

      if (response.data.result) {
        const matchData = liveData.matches.find(match => match.marketId === marketId);
        const matchName = matchData ? matchData.matchName : `Market ${marketId}`;
        liveData.odds[marketId] = {
          matchName,
          matchOdds: response.data.result.team_data || [],
          fancyMarkets: response.data.result.session || [],
          commissionFancy: response.data.result.commission_fancy_data || [],
          noCommissionFancy: response.data.result.no_commission_fancy_data || [],
        };
      }
    }
    io.emit("updateOdds", liveData.odds);
  } catch (error) {
    console.error("Error fetching odds:", error.message);
  }
};

// Run functions every second
setInterval(fetchOngoingMatches, 100000);
setInterval(fetchOdds, 1000);

// API Route: Fetch odds from backend cache
app.get("/api/odds", (req, res) => {
  const { market_id } = req.query;
  if (!market_id || !liveData.odds[market_id]) {
    return res.status(404).json({ error: "No odds available" });
  }
  res.json(liveData.odds[market_id]);
});

// WebSocket: Live Score & Odds Updates
io.on("connection", (socket) => {
  console.log("Client connected");
  socket.emit("updateMatches", liveData.matches);
  socket.emit("updateOdds", liveData.odds);
  socket.on("disconnect", () => console.log("Client disconnected"));
});

// Titli Game WebSocket Implementation
let titliGameState = {
  currentRound: null,
  gamePhase: 'betting', // 'betting' or 'result'
  timeRemaining: 30,
  winningImage: null,
  winningImageNumber: null,
  bettingOpen: true,
  participants: new Set(),
  roundStartTime: null
};

// Make titliGameState globally available
global.titliGameState = titliGameState;

// Initialize forcedWinner variable to track admin-selected winners
global.forcedWinner = null;

// Add health check route to verify game is running
app.get('/api/titli/health', (req, res) => {
  // If titliGameState doesn't exist or doesn't have a currentRound, start a new round
  if (!titliGameState || !titliGameState.currentRound) {
    console.log('Health check detected inactive game - initializing new round');
    startNewTitliRound();
    
    // Allow time for initialization before responding
    setTimeout(() => {
      res.status(200).json({
        status: 'Game initialized',
        gameState: {
          roundId: titliGameState.currentRound,
          gamePhase: titliGameState.gamePhase,
          timeRemaining: titliGameState.timeRemaining,
          bettingOpen: titliGameState.bettingOpen
        }
      });
    }, 500);
  } else {
    res.status(200).json({
      status: 'Game running',
      gameState: {
        roundId: titliGameState.currentRound,
        gamePhase: titliGameState.gamePhase,
        timeRemaining: titliGameState.timeRemaining,
        bettingOpen: titliGameState.bettingOpen,
        roundStartTime: titliGameState.roundStartTime,
        timestamp: Date.now()
      }
    });
  }
});

// Function to generate a unique round ID
const generateRoundId = () => {
  const date = new Date();
  return `T${date.getTime().toString().padStart(3, '0')}`;
};

// Start a new Titli game round
const startNewTitliRound = async () => {
  try {
    // Reset game state for a new round but preserve image settings
    const previousRound = titliGameState.currentRound;
    titliGameState.currentRound = generateRoundId();
    titliGameState.gamePhase = 'betting';
    titliGameState.timeRemaining = 30;
    titliGameState.bettingOpen = true;
    titliGameState.participants = new Set();
    titliGameState.roundStartTime = Date.now();
    titliGameState.winningImage = null;
    titliGameState.winningImageNumber = null;
    
    console.log(`Starting new Titli round: ${titliGameState.currentRound} (previous: ${previousRound})`);
    
    // Ensure we don't reset any image allowed/disallowed status
    // The status needs to be preserved between rounds

    // Broadcast new round start to all clients with more detailed information
    io.emit('titli:roundStart', {
      roundId: titliGameState.currentRound,
      previousRound: previousRound,
      timeRemaining: titliGameState.timeRemaining,
      gamePhase: titliGameState.gamePhase,
      bettingOpen: titliGameState.bettingOpen,
      timestamp: Date.now()
    });
    
    // Broadcast overall game state update to ensure all clients are in sync
    io.emit('titli:gameState', {
      roundId: titliGameState.currentRound,
      timeRemaining: titliGameState.timeRemaining,
      gamePhase: titliGameState.gamePhase,
      bettingOpen: titliGameState.bettingOpen,
      timestamp: Date.now()
    });
    
    console.log(`New Titli round ${titliGameState.currentRound} started and broadcast to all clients`);
  } catch (error) {
    console.error('Error starting new Titli round:', error);
    
    // Ensure we continue the game despite errors
    setTimeout(() => {
      // Simple reset of essential fields
      titliGameState.currentRound = generateRoundId();
      titliGameState.gamePhase = 'betting';
      titliGameState.timeRemaining = 30;
      titliGameState.bettingOpen = true;
      
      // Broadcast the new round
      io.emit('titli:roundStart', {
        roundId: titliGameState.currentRound,
        timeRemaining: titliGameState.timeRemaining,
        gamePhase: titliGameState.gamePhase,
        bettingOpen: true,
        timestamp: Date.now()
      });
      
      console.log(`Recovery - New Titli round started: ${titliGameState.currentRound}`);
    }, 2000);
  }
};

// Update time remaining and broadcast to clients
const updateTitliTimer = () => {
  if (!titliGameState || !titliGameState.currentRound) {
    return; // Skip if game state isn't initialized yet
  }
  
  if (titliGameState.gamePhase === 'betting' && titliGameState.timeRemaining > 0) {
    titliGameState.timeRemaining -= 1;
    
    // When 15 seconds or less remain, close betting
    if (titliGameState.timeRemaining === 15) {
      console.log(`Closing betting for round ${titliGameState.currentRound} (15 seconds remaining)`);
      titliGameState.bettingOpen = false;
    }
    
    // Broadcast updated timer to all clients with enhanced information
    io.emit('titli:timerUpdate', {
      roundId: titliGameState.currentRound,
      timeRemaining: titliGameState.timeRemaining,
      gamePhase: titliGameState.gamePhase,
      bettingOpen: titliGameState.bettingOpen,
      timestamp: Date.now(),
      thresholdReached: titliGameState.timeRemaining <= 15
    });
    
    // Log significant time thresholds for debugging
    if (titliGameState.timeRemaining === 20 || 
        titliGameState.timeRemaining === 15 || 
        titliGameState.timeRemaining === 10 || 
        titliGameState.timeRemaining === 5) {
      console.log(`Titli round ${titliGameState.currentRound}: ${titliGameState.timeRemaining} seconds remaining`);
    }
    
    // When timer reaches 2 seconds remaining (28 seconds elapsed), reveal result
    if (titliGameState.timeRemaining === 0) {
      console.log(`Triggering end of betting phase for round ${titliGameState.currentRound}`);
      endTitliBettingPhase();
    }
  }
};

// End betting phase and determine winning image
const endTitliBettingPhase = async () => {
  try {
    if (titliGameState.gamePhase !== 'betting') {
      console.log('Betting phase already ended, skipping duplicate call');
      return;
    }
    
    titliGameState.bettingOpen = false;
    titliGameState.gamePhase = 'result';
    
    // Check for admin-forced winner and log it clearly
    console.log('Checking for forced winner:', global.forcedWinner);
    
    // Check if we have a forced winner set by admin for this round
    if (global.forcedWinner && global.forcedWinner.roundId === titliGameState.currentRound) {
      console.log(`Using admin-forced winner: ${global.forcedWinner.image} (${global.forcedWinner.imageNumber}) for round ${titliGameState.currentRound}`);
      
      titliGameState.winningImage = global.forcedWinner.image;
      titliGameState.winningImageNumber = global.forcedWinner.imageNumber;
      
      // Clear the forced winner to prevent it from affecting future rounds
      const usedForcedWinner = {...global.forcedWinner};
      global.forcedWinner = null;
      
      console.log(`Admin-selected winner has been applied. Image: ${titliGameState.winningImage}, Number: ${titliGameState.winningImageNumber}`);
      
      // Broadcast result
      io.emit('titli:revealResult', {
        roundId: titliGameState.currentRound,
        winningImage: titliGameState.winningImage,
        winningImageNumber: titliGameState.winningImageNumber,
        adminSelected: true
      });
      
      // Process winners
      processWinners(titliGameState.currentRound, titliGameState.winningImage, titliGameState.winningImageNumber);
      
      // Start a new round after a delay
      setTimeout(() => {
        startNewTitliRound();
      }, 5000);
      
      return;
    } else {
      console.log('No forced winner found for this round, proceeding with random selection');
    }
    
    // If no forced winner, proceed with the normal logic of selecting from allowed images
    // Get the latest image settings from database
    const titliWinnerModel = require('./models/TitliWinner');
    let allowedEntries;
    
    try {
      // Get the most recent entry with all image data
      const latestEntry = await titliWinnerModel.findOne().sort({ createdAt: -1 });
      
      if (!latestEntry) {
        console.error('No image data found in database');
        // Create a default entry with all images allowed
        const defaultImages = [
          { image: "butterfly.jpg", amount: 50, isAllowed: true, imageNumber: 1 },
          { image: "cow.jpg", amount: 30, isAllowed: true, imageNumber: 2 },
          { image: "football.jpg", amount: 20, isAllowed: true, imageNumber: 3 },
          { image: "spin.jpg", amount: 25, isAllowed: true, imageNumber: 4 },
          { image: "flower.webp", amount: 15, isAllowed: true, imageNumber: 5 },
          { image: "diya.webp", amount: 40, isAllowed: true, imageNumber: 6 },
          { image: "bucket.jpg", amount: 10, isAllowed: true, imageNumber: 7 },
          { image: "kite.webp", amount: 35, isAllowed: true, imageNumber: 8 },
          { image: "rat.webp", amount: 45, isAllowed: true, imageNumber: 9 },
          { image: "umberlla.jpg", amount: 60, isAllowed: true, imageNumber: 10 },
          { image: "parrot.webp", amount: 55, isAllowed: true, imageNumber: 11 },
          { image: "sun.webp", amount: 70, isAllowed: true, imageNumber: 12 }
        ];
        const newEntry = new titliWinnerModel({ Images: defaultImages });
        await newEntry.save();
        allowedEntries = [newEntry];
      } else {
        allowedEntries = [latestEntry];
      }
    } catch (dbError) {
      console.error('Error fetching image data from database:', dbError);
      // Even if there's an error, we should start a new round after a timeout
      setTimeout(() => {
        startNewTitliRound();
      }, 5000);
      return;
    }
    
    // Flatten all allowed images into a single array
    const allAllowedImages = allowedEntries.flatMap(entry =>
      entry.Images.filter(img => img.isAllowed === true) // Explicitly check for true
    );
    
    console.log(`Found ${allAllowedImages.length} allowed images for winner selection`);
    
    if (!allAllowedImages.length) {
      console.error('No allowed images found for revealing result - using fallback');
      // Use a fallback - take any image to avoid game disruption
      const fallbackImage = allowedEntries[0].Images[0];
      titliGameState.winningImage = fallbackImage.image;
      titliGameState.winningImageNumber = fallbackImage.imageNumber;
      
      console.log(`Using fallback image: ${titliGameState.winningImage} (${titliGameState.winningImageNumber})`);
      
      // Broadcast result
      io.emit('titli:revealResult', {
        roundId: titliGameState.currentRound,
        winningImage: titliGameState.winningImage,
        winningImageNumber: titliGameState.winningImageNumber,
        isFallback: true
      });
      
      // Process winners
      processWinners(titliGameState.currentRound, titliGameState.winningImage, titliGameState.winningImageNumber);
      
      // Start a new round after a delay
      setTimeout(() => {
        startNewTitliRound();
      }, 5000);
      return;
    }
    
    // Select a random image from allowed ones
    const randomImage = allAllowedImages[Math.floor(Math.random() * allAllowedImages.length)];
    titliGameState.winningImage = randomImage.image;
    titliGameState.winningImageNumber = randomImage.imageNumber;
    
    console.log(`Selected winning image: ${titliGameState.winningImage} (Number: ${titliGameState.winningImageNumber})`);
    
    // Broadcast result to all clients
    io.emit('titli:revealResult', {
      roundId: titliGameState.currentRound,
      winningImage: titliGameState.winningImage,
      winningImageNumber: titliGameState.winningImageNumber,
      isRandom: true
    });
    
    // Process winners for this round
    processWinners(titliGameState.currentRound, titliGameState.winningImage, titliGameState.winningImageNumber);
    
    console.log(`Titli round ${titliGameState.currentRound} result revealed: ${titliGameState.winningImage} (Number: ${titliGameState.winningImageNumber})`);
    
    // Wait 5 seconds before starting a new round
    setTimeout(() => {
      startNewTitliRound();
    }, 5000);
  } catch (error) {
    console.error('Error ending Titli betting phase:', error);
    // Even if there's an error, we should start a new round after a timeout
    setTimeout(() => {
      startNewTitliRound();
    }, 5000);
  }
};

// Process bet winners for a completed round
const processWinners = async (roundId, winningImage, winningImageNumber) => {
  try {
    const User_Wallet = require('./models/Wallet');
    const PappuModel = require('./models/papuModel');
    
    // Find all bets for this round
    const bets = await PappuModel.find({ 
      titliGameId: roundId
    });
    
    console.log(`Processing ${bets.length} bets for round ${roundId}`);
    console.log(`Winning image: ${winningImage}, winning number: ${winningImageNumber}`);
    
    // Get image to number mapping
    const titliWinnerModel = require('./models/TitliWinner');
    const imageData = await titliWinnerModel.find().sort({ createdAt: -1 }).limit(1);
    
    let imageNumberMapping = {};
    if (imageData.length > 0 && imageData[0].Images) {
      imageData[0].Images.forEach(img => {
        imageNumberMapping[img.image] = img.imageNumber;
        console.log(`Mapping: ${img.image} -> ${img.imageNumber}`);
      });
    } else {
      // Fallback hardcoded mapping
      imageNumberMapping = {
        "butterfly.jpg": 1,
        "cow.jpg": 2,
        "football.jpg": 3,
        "spin.jpg": 4,
        "flower.webp": 5,
        "diya.webp": 6,
        "bucket.jpg": 7,
        "kite.webp": 8,
        "rat.webp": 9,
        "umberlla.jpg": 10,
        "parrot.webp": 11,
        "sun.webp": 12
      };
      console.log('Using fallback image number mapping');
    }
    
    let totalWinners = 0;
    let totalPayout = 0;
    
    // Process each bet
    for (const bet of bets) {
      console.log(`Processing bet for user: ${bet.user}, game: ${roundId}`);
      
      const userSelectedCards = bet.selectedCard || [];
      let isWin = false;
      let totalProfit = 0;
      let winningCards = [];
      
      // Determine if any selected card matches the winning image/number
      for (const card of userSelectedCards) {
        const cardImage = card.image;
        const cardImageNumber = imageNumberMapping[cardImage];
        
        console.log(`Checking card: ${cardImage} (${cardImageNumber}) against winner: ${winningImage} (${winningImageNumber})`);
        
        // Winning condition: either image name matches OR image number matches
        if (cardImage === winningImage || cardImageNumber === winningImageNumber) {
          isWin = true;
          const betAmount = card.betAmount || 0;
          // Calculate profit (10x the bet amount)
          const profit = betAmount * 10;
          totalProfit += profit;
          winningCards.push({
            image: cardImage,
            imageNumber: cardImageNumber,
            betAmount,
            profit
          });
          console.log(`WIN! User ${bet.user} won ${profit} on ${cardImage}`);
        }
      }
      
      // Update bet with result
      bet.isCompleted = true;
      bet.isWin = isWin;
      bet.profit = totalProfit;
      bet.winningImage = winningImage;
      bet.winningCards = winningCards;
      await bet.save();
      
      // If win, update user wallet
      if (isWin && totalProfit > 0) {
        try {
          totalWinners++;
          totalPayout += totalProfit;
          
          // First try with userId field
          let userWallet = await User_Wallet.findOne({ userId: bet.user });
          
          // If not found, try directly with user field
          if (!userWallet) {
            userWallet = await User_Wallet.findOne({ user: bet.user });
          }
          
          // If still not found, try with user as string
          if (!userWallet) {
            userWallet = await User_Wallet.findOne({ userId: bet.user.toString() });
          }
          
          if (userWallet) {
            console.log(`Found wallet for user ${bet.user}, current balance: ${userWallet.balance}`);
            userWallet.balance += totalProfit;
            await userWallet.save();
            console.log(`Updated wallet balance to ${userWallet.balance} (+${totalProfit})`);
            
            // Emit win notification to user
            io.emit('titli:winResult', {
              userId: bet.user.toString(),
              profit: totalProfit,
              winningImage,
              winningImageNumber,
              winningCards
            });
            
            console.log(`User ${bet.user} won ${totalProfit} on round ${roundId}`);
          } else {
            console.error(`Wallet not found for user ${bet.user}. Tried userId and user fields.`);
          }
        } catch (err) {
          console.error(`Error updating wallet for user ${bet.user}:`, err);
        }
      }
    }
    
    console.log(`Finished processing winners for round ${roundId}: ${totalWinners} winners, ${totalPayout} total payout`);
    
    // Broadcast summary of results
    io.emit('titli:roundSummary', {
      roundId,
      winningImage,
      winningImageNumber,
      totalWinners,
      totalPayout
    });
    
  } catch (error) {
    console.error('Error processing winners:', error);
  }
};

// Start the Titli game on server startup
startNewTitliRound();

// Run timer update every second
setInterval(updateTitliTimer, 1000);

// Add a game health monitor to automatically recover if game becomes inactive
setInterval(() => {
  if (!titliGameState || !titliGameState.currentRound) {
    console.log('Game health monitor detected inactive game - restarting game');
    startNewTitliRound();
  } else if (titliGameState.gamePhase === 'betting' && 
             titliGameState.roundStartTime && 
             Date.now() - titliGameState.roundStartTime > 60000) {
    // If a round has been in betting phase for more than 60 seconds, it's likely stuck
    console.log('Game health monitor detected stuck round - forcing new round');
    endTitliBettingPhase();
  }
}, 15000); // Check every 15 seconds

// Socket connection handler
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);
  
  // Handle client joining Titli game
  socket.on('titli:join', () => {
    // If game is not initialized, start it
    if (!titliGameState.currentRound) {
      console.log('New client connection triggered game start');
      startNewTitliRound();
    }
    
    // Send current game state to the client that just joined
    socket.emit('titli:gameState', {
      roundId: titliGameState.currentRound,
      timeRemaining: titliGameState.timeRemaining,
      gamePhase: titliGameState.gamePhase,
      bettingOpen: titliGameState.bettingOpen,
      winningImage: titliGameState.gamePhase === 'result' ? titliGameState.winningImage : null,
      winningImageNumber: titliGameState.gamePhase === 'result' ? titliGameState.winningImageNumber : null
    });
    
    titliGameState.participants.add(socket.id);
  });
  
  // Handle client placing bet
  socket.on('titli:placeBet', async (betData) => {
    // Forward this to the frontend through API calls
    console.log(`Client ${socket.id} placed bet in round ${titliGameState.currentRound}:`, betData);
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    titliGameState.participants.delete(socket.id);
    console.log(`Client disconnected: ${socket.id}`);
  });

  // Handle client requesting next image reveal
  socket.on('titli:requestNextImage', (data) => {
    // Check if we have the winning image available
    if (titliGameState.winningImage && data.gameId === titliGameState.currentRound) {
      socket.emit('titli:nextImage', {
        index: data.currentIndex + 1, // Next index
        winningImage: titliGameState.winningImage,
        winningImageNumber: titliGameState.winningImageNumber
      });
    }
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, '0.0.0.0', () => {
//   console.log(`Server started on port ${PORT}`);
// });

// Expose these functions for use in other files like titliWinnerController
exports.startNewTitliRound = startNewTitliRound;
exports.endTitliBettingPhase = endTitliBettingPhase;
