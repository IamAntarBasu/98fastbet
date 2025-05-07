const express = require('express');
const aarParParchiRouter = express.Router();
const matchController = require("../controller/aarParParchiController")

// Define routes
aarParParchiRouter.put('/match/select/:matchName', matchController.createMatch); 
aarParParchiRouter.get('/match/get-all', matchController.getAllMatches); 
aarParParchiRouter.get('/match/get-by-matchname/:matchName', matchController.getMatchByMatchName); 
aarParParchiRouter.delete('/match/reset', matchController.resetMatch);

// aarParParchiRouter.get('/api/bets/:userId', betController.getUserBets);
// aarParParchiRouter.post('/wallet/update',betController.updateWallet);
// router.get('/api/bets/:userId', betController.getUserBets);
// router.post('/wallet/update',betController.updateWallet);

// router.delete('/api/bets', betController.resetBets);

module.exports = aarParParchiRouter;