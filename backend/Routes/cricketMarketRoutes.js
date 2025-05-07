const express = require('express');
const router = express.Router();
const betController = require('../controller/cricketMarketController');

router.post('/api/cricket-market/bets', betController.createBet);
router.get('/api/cricket-market/getbets', betController.getBetsByUserId);
router.get('/api/cricket-market/:userId/:match', betController.getBetsByUser);
router.get('/api/cricket-market-match/:matbet', betController.getBetsByMatch);
router.get('/api/cricket-market-by-matchName/:matchName', betController.getBetsByMatchNameAndSession);
router.get('/api/cricket-market/:id', betController.deleteBet);
router.delete('/reset', betController.resetAllBet);
module.exports = router;