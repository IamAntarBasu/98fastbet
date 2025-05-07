// server.js - Node.js backend for cricket betting site
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

app.use(express.json());
app.use(cors());

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
          Authorization: "Bearer YOUR_TOKEN_HERE",
          Accept: "application/json",
          Origin: "https://btx99.com",
        },
      }
    );

    liveData.matches = response.data.data.map((match) => ({
      eventId: match.eventId,
      matchName: match.matchName,
      marketId: match.marketId,
      scoreIframe: match.scoreIframe,
    }));

    io.emit("updateMatches", liveData.matches);
  } catch (error) {
    console.error("Error fetching ongoing matches:", error);
  }
};

// Fetch odds data every second
const fetchOdds = async () => {
  try {
    const marketIds = liveData.matches.map((match) => match.marketId);
    if (marketIds.length === 0) return;

    for (const marketId of marketIds) {
      const response = await axios.get(
        `https://oddsapi.winx777.com/v2/api/oddsData?market_id=${marketId}`
      );

      // Log the full response to debug
      console.log(`Odds response for market ${marketId}:`, JSON.stringify(response.data, null, 2));

      if (response.data.result) {
        const matchData = liveData.matches.find(match => match.marketId === marketId);
        const matchName = matchData ? matchData.matchName : `Market ${marketId}`;

        liveData.odds[marketId] = {
          matchName,  // ✅ Store match name
          matchOdds: response.data.result.team_data || [],  // ✅ Match Odds (Lagai/Khai)
          fancyMarkets: response.data.result.session || [],
          commissionFancy: response.data.result.commission_fancy_data || [],
          noCommissionFancy: response.data.result.no_commission_fancy_data || []
        };
      }
    }

    io.emit("updateOdds", liveData.odds);
  } catch (error) {
    console.error("Error fetching odds:", error);
  }
};

// Run functions every second
setInterval(fetchOngoingMatches, 1000);
setInterval(fetchOdds, 1000);

// API Route: Fetch odds from backend cache
app.get("/odds", (req, res) => {
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
