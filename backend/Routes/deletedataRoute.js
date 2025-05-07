const express = require('express');
const router = express.Router();
const User = require("../models/UserSignUp");
const User_Wallet = require("../models/Wallet");
const MatchModel = require('../models/aarParparchiModel'); // Adjust the path if needed
const CardModel = require('../models/cardsModel');
const Matka = require('../models/matkaModel');
const Bid = require('../models/betModel');
const Bet2 = require('../models/crickbetModel');
const BettingLogic = require('../models/BettingLogic');
const Bet = require('../models/cricketMarketModel');
const MarketLK = require('../models/marketLogicModel');
const papuModel = require('../models/papuModel');
const titliWinnerModel = require('../models/TitliWinner');
const BetAndhr = require('../models/andharModel');
const Mines = require('../models/mines'); 
// Delete ALL Matka Bids
router.delete('/admin/delete/Matka', async (req, res) => {
  try {
    await Bid.deleteMany({});
    res.json({ message: 'All Matka bids deleted successfully' });
  } catch (err) {
    console.error('Error deleting Matka bids:', err);
    res.status(500).json({ error: 'Failed to delete Matka bids', details: err.message });
  }
});

// Delete ALL Cricket Related Data
router.delete('/admin/delete/allcricket', async (req, res) => {
  try {
    // Delete in a specific order to handle dependencies
    await Promise.all([
      MarketLK.deleteMany({}),
      Bet2.deleteMany({}),
      Bet.deleteMany({})
    ]);
    res.json({ message: 'All cricket related data deleted successfully' });
  } catch (err) {
    console.error('Error deleting cricket data:', err);
    res.status(500).json({ error: 'Failed to delete cricket data', details: err.message });
  }
});

// // Delete ALL Balances
router.delete('/admin/delete/aarpaarparchi', async (req, res) => {
  try {
    await MatchModel.deleteMany({});
    await CardModel.deleteMany({});
    res.json({ message: 'All aaar Paar data deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// // Delete ALL Linked Accounts
router.delete('/admin/delete/tittli', async (req, res) => {
  try {
    await papuModel.deleteMany({});
    await titliWinnerModel.deleteMany({});
    res.json({ message: 'All accounts deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// // Delete ALL Preferences
router.delete('/admin/delete/andhr', async (req, res) => {
  try {
    await BetAndhr.deleteMany({});
    res.json({ message: 'All preferences deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// // Delete EVERYTHING
router.delete('/admin/delete/mines', async (req, res) => {
  try {
    await Mines.deleteMany({});
    res.json({ message: 'All preferences deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const addPointModel = require("../models/addPointModel");
const Withdraw = require("../models/withdrawModel");
router.delete('/admin/delete/dphistory', async (req, res) => {
  try {
    await addPointModel.deleteMany({});
    await Withdraw.deleteMany({});
    res.json({ message: 'All preferences deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
