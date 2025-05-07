// const express = require('express');
// const router = express.Router();
// const crickbetControler = require('../controller/crickbetControler');

// // Define routes
// router.post('/api/bets', crickbetControler.placeBet);
// router.get('/api/bets/:userId', crickbetControler.getUserBets);
// router.post('/wallet/update',crickbetControler.updateWallet);
// router.put('/api/cricket/update-status/:id',crickbetControler.updatecricketlagaikhai);
// router.put('/api/bets/:id', crickbetControler.updateBet);
// // router.delete('/api/bets', betController.resetBets);
// router.post('/api/admin/signup',crickbetControler.adminusersignup);
// router.get('/api/admin/cricketmarket/allbetsupdate',crickbetControler.allbetsupdate);
// router.put('/api/admin/updateResultUserBet',crickbetControler.updateResultUserBet);
// router.get('/api/bets/outcome/:userId/:match', crickbetControler.calculateNetOutcome);
// module.exports = router;

const express = require('express');
const router = express.Router();
const crickbetController = require('../controller/crickbetController');
const rateLimit = require('express-rate-limit');
const betSocketController = require('../controller/betSocketController');
const Bet2 = require('../models/crickbetModel');

// Create a rate limiter for exposure updates
const exposureUpdateLimiter = rateLimit({
  windowMs: 5 * 1000, // 5 seconds
  max: 5, // limit each IP to 5 requests per windowMs
  message: { success: false, message: "Too many requests, please try again later" },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipSuccessfulRequests: false, // Count successful requests against the rate limit
  keyGenerator: (req) => {
    // Use user ID as the key for rate limiting if available
    return req.body.userId || req.ip;
  }
});

// Define routes
router.post('/cricket/api/bets', crickbetController.placeBet);
router.get('/cricketmarket/api/bets/:userId', crickbetController.getUserBets);
router.post('/wallet/update',crickbetController.updateWallet);
router.post('/wallet/update-exposure', exposureUpdateLimiter, crickbetController.updateExposure);
router.put('/api/cricket/update-status/:id',crickbetController.updatecricketlagaikhai);
router.put('/api/bets/:id', crickbetController.updateBet);
// router.delete('/api/bets', betController.resetBets);
router.post('/api/admin/signup',crickbetController.adminusersignup);
router.get('/api/admin/cricketmarket/allbetsupdate',crickbetController.allbetsupdate);
router.put('/api/admin/updateResultUserBet',crickbetController.updateResultUserBet);
router.get('/api/bets/outcome/:userId/:match', crickbetController.calculateNetOutcome);
router.put('/api/cricket/update-status/:id', crickbetController.updateStatus);

// Result declaration routes
router.post('/cricket/update-result', crickbetController.updateResult);
router.post('/cricket/update-fancy-result', crickbetController.updateFancyResult);
router.post('/cricket/revert-result', crickbetController.revertResult);
router.get('/cricket/matches', crickbetController.getMatchesWithPendingBets);
router.get('/cricket/fancy-markets/:match', crickbetController.getFancyMarketsForMatch);

// Add route to get recent declarations with more detailed filtering
router.get('/api/admin/recent-declarations', async (req, res) => {
  try {
    console.log("Fetching recent declarations with detailed filtering...");
    
    // Find all bets that have a result (not pending)
    const query = { 
      status: { $ne: "Pending" },
      result: { $exists: true, $ne: null }
    };
    
    console.log("Recent declarations query:", JSON.stringify(query));
    
    const recentDeclarations = await Bet2.find(query)
      .select("label odds stake profit type createdAt result match status user run")
      .sort({ createdAt: -1 })
      .limit(100);
    
    console.log(`Found ${recentDeclarations.length} recent declarations`);
    
    // Log some sample data for debugging
    if (recentDeclarations.length > 0) {
      console.log("Sample declaration:", JSON.stringify(recentDeclarations[0]));
    }
    
    res.status(200).json({
      success: true,
      data: recentDeclarations
    });
  } catch (error) {
    console.error("Error fetching recent declarations:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
});

module.exports = router;

