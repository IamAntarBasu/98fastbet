const Bid = require('../models/betModel');
const User_Wallet = require('../models/Wallet');
const mongoose = require('mongoose');


exports.placeBid = async (req, res) => {
  try {
    // Destructure the necessary data from the request body
    const { userId, gameName, bidType, session, bids, totalBidPoints, estimatedProfit } = req.body;

    // Validate input data
    if (!userId || !gameName || !bidType || !bids || bids.length < 1 || totalBidPoints <= 0 || estimatedProfit < 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid input: A game name, bid type, session, at least 1 bid, a positive total bid amount, and a non-negative estimated profit are required.',
      });
    }

    // Check if session is provided, if not, use a default value
    const sessionValue = session || 'N/A';  // Use 'default_session' if no session is provided

    // Find the user's wallet
    const userWallet = await User_Wallet.findOne({ user: userId });
    if (!userWallet) {
      return res.status(404).json({ success: false, message: 'Wallet not found' });
    }

    // Check if the user has enough balance
    if (userWallet.balance < totalBidPoints) {
      return res.status(400).json({ success: false, message: 'Insufficient balance' });
    }

    // Deduct the bid amount from the wallet balance
    userWallet.balance -= totalBidPoints;
    await userWallet.save();

    // Calculate total bid points from individual bids
    const calculatedBidPoints = bids.reduce((acc, bid) => acc + bid.points, 0);

    // Ensure total bid points match the sum of individual bid points
    if (calculatedBidPoints !== totalBidPoints) {
      return res.status(400).json({
        success: false,
        message: 'Total bid points do not match the sum of individual bid points.',
      });
    }

    // Create the new bid object
    const newBid = new Bid({
      user: userId,
      gameName,
      bidType,        // Include bidType
      session: sessionValue,  // Use the session value (either from the request or default)
      bids,
      totalBidPoints,
      estimatedProfit, // Include estimatedProfit
    });

    // Save the new bid to the database
    const savedBid = await newBid.save();

    // Respond with a success message and the updated wallet balance
    res.status(201).json({
      success: true,
      message: 'Bid placed successfully',
      bid: savedBid,
      updatedWallet: userWallet.balance,
    });
  } catch (err) {
    console.error('Error placing bid:', err);
    res.status(500).json({ success: false, message: 'Error placing bid', error: err.message });
  }
};


exports.getUserBets = async (req, res) => {
  const { userId } = req.params; 
  
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID',
      });
    }
    const bets = await Bid.find({ user: new mongoose.Types.ObjectId(userId) });
    if (!bets || bets.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No bets found for this user',
      });
    }
   res.status(200).json({
      success: true,
      bets,
    });
  } catch (err) {
    console.error('Error fetching bets:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching bets',
    });
  }
};


exports.updateWallet = async (req, res) => {
  const { userId, amount } = req.body;

  try {
      // Find the user wallet by user ID
      const userWallet = await User_Wallet.findOne({ user: userId });
      if (!userWallet) {
          return res.status(404).json({ success: false, message: "User wallet not found" });
      }

      // Update the wallet balance
      userWallet.balance += amount;
      await userWallet.save();

      res.json({ success: true, message: "Wallet updated successfully", walletBalance: userWallet.balance });
  } catch (error) {
      console.error("Error updating wallet:", error);
      res.status(500).json({ success: false, message: "Server error" });
  }
};



  
const User = require('../models/UserSignUp');  

exports.getAllAdminUser = async (req, res) => {

  try {
    // Fetch users and populate the wallet field to get the balance
    const users = await User.find({}, "_id username email wallet userNo") // Fetching specific user fields
      .populate("wallet", "balance"); // Populating 'wallet' and only getting 'balance' field

    // Respond with the users data including balance
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
};




exports.updateUser = async (req, res) => {
  const { userId } = req.params;
  const { username, balance } = req.body;

  try {
    // Step 1: Update the user's username
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username },
      { new: true } // Return updated user
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Step 2: Check if the user has a wallet
    let userWallet = await User_Wallet.findOne({ user: userId });

    if (!userWallet) {
      console.log("Wallet not found, creating a new one...");
      userWallet = new User_Wallet({
        user: userId,
        balance: balance || 15000, // Default balance if not provided
      });

      await userWallet.save();

      // Update user with new wallet ID if it's missing
      if (!updatedUser.wallet) {
        updatedUser.wallet = userWallet._id;
        await updatedUser.save();
      }


    } else {
      // Step 3: Update wallet balance
  
      userWallet.balance = Number(balance);
      await userWallet.save();
   
    }

    return res.status(200).json({
      success: true,
      message: 'User and wallet updated successfully',
      user: updatedUser,
      wallet: userWallet,
    });

  } catch (err) {
    console.error('Error updating user and wallet:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};




exports.getAllAdminUser2 = async (req, res) => {
  try {
    const bids = await Bid.find()
      .populate('user', 'username email')  // Populate user details (only username and email)
      .exec();

    // Sending the response back to the client
    res.json(bids);  // Return an array of all Bid documents with user details populated
  } catch (error) {
    console.error(error);
    // Sending an error response back to the client
    res.status(500).json({ error: 'Something went wrong' });
  }
};



const Bet = require('../models/andharModel');

exports.placeBet2 = async (req, res) => {
  try {
    const { label, odds, stake, profit, userId } = req.body;
    // Validate input
    if (!label || !odds || !stake || !profit || !userId || stake <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid input: all bet details are required and stake must be greater than 0',
      });
    }
    const userWallet = await User_Wallet.findOne({ user: userId });
    if (!userWallet) {
      // console.error("Wallet not found for user:", userId);
      return res.status(404).json({ success: false, message: 'Wallet not found' });
    }
    // console.log("User wallet found:", userWallet);
    if (userWallet.balance < stake) {
      console.error("Insufficient balance. Current balance:", userWallet.balance, "Stake:", stake);
      return res.status(400).json({ success: false, message: 'Insufficient balance' });
    }

    userWallet.balance -= stake;

    await userWallet.save();
    // console.log("Updated wallet balance:", userWallet.balance);
    const newBet = new Bet({
      user: userId, 
      label,
      odds,
      stake,
      profit,
    });

    // Save the bet
    const savedBet = await newBet.save();
    // console.log("Bet saved successfully:", savedBet);

    res.status(201).json({
      success: true,
      message: 'Bet placed successfully',
      bet: savedBet,
      updatedWallet: userWallet.balance,
    });
  } catch (err) {
    console.error('Error placing bet:', err);
    res.status(500).json({ success: false, message: 'Error placing bet', error: err.message });
  }
};




exports.getUserBets2 = async (req, res) => {
  const { userId } = req.params; 
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID',
      });
    }
    const bets = await Bet.find({ user: new mongoose.Types.ObjectId(userId) });
    if (!bets || bets.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No bets found for this user',
      });
    }
   res.status(200).json({
      success: true,
      bets,
    });
  } catch (err) {
    console.error('Error fetching bets:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching bets',
    });
  }
};




exports.updateWinStatus = async (req, res) => {
    try {
        const { userId, isWin } = req.body; // Ensure userId and isWin are received from body

        if (!userId || !isWin) {
            return res.status(400).json({ success: false, message: "User ID and isWin are required." });
        }

        if (!["win", "loss"].includes(isWin)) {
            return res.status(400).json({ success: false, message: "Invalid status. Use 'win' or 'loss'." });
        }

        // Find the latest bet of the user
        const latestBet = await Bet.findOne({ user: userId }).sort({ createdAt: -1 });

        if (!latestBet) {
            return res.status(404).json({ success: false, message: "No bet found for the user" });
        }

        // Update the latest bet's isWin status
        latestBet.isWin = isWin;
        await latestBet.save(); // Save the updated bet

        return res.json({ success: true, message: `Bet updated to ${isWin}`, bet: latestBet });

    } catch (error) {
        console.error("Error updating win status:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};




exports.getAllAndharBets = async (req, res) => {
  try {
      const bets = await Bet.find().populate('user', 'username');
      res.status(200).json(bets);
  } catch (error) {
      res.status(500).json({ message: 'Server error', error });
  }
};
