const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController');
const User = require('../models/UserSignUp');
const Wallet = require('../models/Wallet');
const Bid = require('../models/betModel');
const PapuModel = require('../models/papuModel');
const AvaitorModel = require('../models/avaitorModel');
const MinesModel = require('../models/mines');
const CrickbetModel = require('../models/crickbetModel');
const AarParParchiModel = require('../models/aarParparchiModel');

// Get all users
router.get('/users', adminController.getAllAdminUser);

// Get user details by ID
router.get('/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const wallet = await Wallet.findOne({ user: userId });
    
    res.status(200).json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        userNo: user.userNo,
        balance: wallet ? wallet.balance : 0,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Error fetching user details', error: error.message });
  }
});

// Update user
router.put('/users/:userId', adminController.updateUser);

// Get user's bet history
router.get('/users/:userId/bets', adminController.getUserBets);

// Test route to verify controller is loaded
router.get('/version', (req, res) => {
  res.json({ 
    version: adminController.version || 'unknown',
    message: 'Admin API is working'
  });
});

module.exports = router;