const Bet2 = require('../models/crickbetModel');
const User_Wallet = require('../models/Wallet'); 
const User = require('../models/UserSignUp');  
const mongoose = require('mongoose');
const betSocketController = require('./betSocketController');
const BettingLogic = require('../models/BettingLogic');


exports.placeBet = async (req, res) => {
  try {
    console.log(req.body, "ok");
    const { userId, label, odds, run, stake, profit, type, match } = req.body;

    // Validate required fields
    if (!userId || !label || !odds || !type || !match) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Find user wallet - try both userId and user fields
    let userWallet = await User_Wallet.findOne({ user:userId });
    if (!userWallet) {
      // Try with user field if userId field doesn't work
      userWallet = await User_Wallet.findOne({ user: userId });
      if (!userWallet) {
        return res.status(404).json({ success: false, message: "User wallet not found" });
      }
    }

    // Calculate amount to deduct from wallet based on bet type
    let amountToDeduct = 0;
    
    if (type === "Khaai" || type === "khaai") {
      // For Khaai (Lay) bets, deduct the liability (odds * stake / 100)
      amountToDeduct = (parseFloat(odds) * parseFloat(stake)) / 100;
    } else if (type === "Lgaai") {
      // For Lgaai (Back) bets, deduct the stake
      amountToDeduct = parseFloat(stake);
    } else if (type === "YES") {
      // For YES bets, deduct the stake amount directly
      amountToDeduct = parseFloat(stake);
    } else if (type === "NO") {
      // For NO bets, deduct the liability (stake × odds)
      amountToDeduct = parseFloat(stake) * parseFloat(odds);
    } else {
      return res.status(400).json({ success: false, message: "Invalid bet type" });
    }

    // Check if user has sufficient balance - check both wallet field formats
    const walletBalance = userWallet.walletBalance !== undefined ? userWallet.walletBalance : userWallet.balance;
    if (walletBalance < amountToDeduct) {
      return res.status(400).json({ success: false, message: "Insufficient balance" });
    }

    // Use the new betting logic based on bet type
    let result;
    if (type === "Lgaai" || type === "Khaai" || type === "khaai") {
      // Match odds bet (Lagai-Khai)
      result = await BettingLogic.placeMatchOddsBet({
        userId, label, odds, stake, type, match
      }, userWallet);
    } else if (type === "YES" || type === "NO") {
      // Fancy market bet (YES-NO)
      result = await BettingLogic.placeFancyBet({
        userId, label, odds, run, stake, type, match
      }, userWallet);
    }

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(201).json(result);
  } catch (error) {
    console.error("Error placing bet:", error);
    return res.status(500).json({ success: false, message: "Server error" });
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
    const bets = await Bet2.find({ user: new mongoose.Types.ObjectId(userId) });
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
      // Find the user by ID
      const userWallet = await User_Wallet.findOne({ user: userId });
      if (!userWallet) {
          return res.status(404).json({ success: false, message: "User not found" });
      }

      // Update the wallet balance
      userWallet.balance += amount;
      await userWallet.save();

      res.json({ success: true, message: "Wallet updated successfully", walletBalance: userWallet.balance});
  } catch (error) {
      console.error("Error updating wallet:", error);
      res.status(500).json({ success: false, message: "Server error" });
  }
};

const bcrypt = require("bcryptjs"); 


exports.adminusersignup = async (req, res) => {
 
  try {
    const { username, email, password, balance } = req.body;

    if (!username || !email || !password || balance === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save user first
    const savedUser = await newUser.save();

    // Create wallet for the user
    const wallet = new User_Wallet({
      user: savedUser._id,
      balance: balance, // Store initial balance
    });

    const savedWallet = await wallet.save();

    // Link wallet to user
    savedUser.wallet = savedWallet._id;
    await savedUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        balance: savedWallet.balance,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.allbetsupdate = async (req, res) => {
  try {
    console.log("Fetching all bets for recent declarations...");

    // Fetch all bets with required fields, including status
    const allBets = await Bet2.find()
      .select("label odds stake profit type createdAt result match status user")
      .sort({ createdAt: -1 }) // Sort by creation date, newest first
      .limit(200); // Limit to 200 most recent bets for performance

    console.log(`Fetched ${allBets.length} bets for recent declarations`);
    
    // Add additional logging to help debug
    const settledBets = allBets.filter(bet => bet.status !== "Pending");
    console.log(`Of which ${settledBets.length} are settled (not pending)`);
    
    res.status(200).json({ success: true, data: allBets });
  } catch (error) {
    console.error("Error fetching bets:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.updateResultUserBet = async (req, res) => {
  try {
    const { label, result } = req.body;

    if (!label || !result) {
      return res.status(400).json({ success: false, message: "Label and result are required" });
    }

    // Find all pending bets that match the label
    const pendingBets = await Bet2.find({ label, status: "Pending" });

    if (pendingBets.length === 0) {
      return res.status(404).json({ success: false, message: "No pending bets found for this label" });
    }

    // Process each bet
    for (const bet of pendingBets) {
      // Handle YES/NO bets
      if (bet.type === "YES") {
        const userWallet = await User_Wallet.findOne({ user: bet.user });
        
        if (!userWallet) {
          console.error(`Wallet not found for user ${bet.user}`);
          continue;
        }
        
        // For YES bets, check if the run value matches the result
        if (parseFloat(bet.run) === parseFloat(result)) {
          // User wins - return stake and add profit
          userWallet.balance += parseFloat(bet.stake) + parseFloat(bet.profit);
          await userWallet.save();
          
          // Update bet status to "Win"
          await Bet2.findByIdAndUpdate(bet._id, { status: "Win", result: result });
        } else {
          // User loses - stake is already deducted
          await Bet2.findByIdAndUpdate(bet._id, { status: "Loss", result: result });
        }
      } 
      else if (bet.type === "NO") {
        const userWallet = await User_Wallet.findOne({ user: bet.user });
        
        if (!userWallet) {
          console.error(`Wallet not found for user ${bet.user}`);
          continue;
        }
        
        // For NO bets, check if the run value does NOT match the result
        if (parseFloat(bet.run) !== parseFloat(result)) {
          // User wins - return stake and add profit
          userWallet.balance += parseFloat(bet.stake) + parseFloat(bet.profit);
          await userWallet.save();
          
          // Update bet status to "Win"
          await Bet2.findByIdAndUpdate(bet._id, { status: "Win", result: result });
        } else {
          // User loses - stake is already deducted
          await Bet2.findByIdAndUpdate(bet._id, { status: "Loss", result: result });
        }
      }
      // Handle Khaai (Lay) bets
      else if (bet.type === "khaai" && bet.label === result) {
        // For Khaai (Lay) bets, if the team loses, user wins the stake amount
        const userWallet = await User_Wallet.findOne({ user: bet.user });

        if (userWallet) {
          // Return the liability (already deducted) and add the profit (stake amount)
          userWallet.balance += bet.liability + bet.profit;
          await userWallet.save();
        }

        // Update the bet status to "Win"
        await Bet2.findByIdAndUpdate(bet._id, { status: "Win", result: result });
      } 
      // Handle Lgaai (Back) bets
      else if (bet.type === "Lgaai" && bet.label === result) {
        // For Lgaai (Back) bets, if the team wins, user wins the profit (odds * stake / 100)
        const userWallet = await User_Wallet.findOne({ user: bet.user });

        if (userWallet) {
          // Return the stake (already deducted) and add the profit
          userWallet.balance += parseFloat(bet.stake) + parseFloat(bet.profit);
          await userWallet.save();
        }

        // Update the bet status to "Win"
        await Bet2.findByIdAndUpdate(bet._id, { status: "Win", result: result });
      } else {
        // If conditions are not satisfied, just update the bet status to "Loss"
        await Bet2.findByIdAndUpdate(bet._id, { status: "Loss", result: result });
      }
    }

    res.json({ success: true, message: "Bets updated successfully" });
  } catch (error) {
    console.error("Error updating bets:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


exports.updatecricketlagaikhai = async (req, res) => {
  try {
    const { status, amount, userID } = req.body;

    if (!status || amount === undefined || !userID) {
      return res.status(400).json({ 
        success: false, 
        message: 'Status, amount, and userID are required' 
      });
    }

    // Find the bet and update status
    const bet = await Bet2.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!bet) {
      return res.status(404).json({ 
        success: false, 
        message: 'Bet not found' 
      });
    }

    // Find the user's wallet
    const userWallet = await User_Wallet.findOne({ user: userID });

    if (!userWallet) {
      return res.status(404).json({ 
        success: false, 
        message: 'Wallet not found' 
      });
    }

    // Update wallet balance with the exact amount passed from frontend
    const amountToAdd = parseFloat(amount);
    if (amountToAdd !== 0) {
      // Add the amount to the wallet
      userWallet.balance += amountToAdd;
      await userWallet.save();
      
      console.log(`Added ${amountToAdd} to wallet for user ${userID}. New balance: ${userWallet.balance}`);
    }

    // Fetch the updated wallet balance
    const updatedWallet = await User_Wallet.findOne({ user: userID });

    res.json({ 
      success: true, 
      message: `Bet status updated to ${status}${amountToAdd !== 0 ? ' and amount added to wallet' : ''}`, 
      bet, 
      walletBalance: updatedWallet.balance 
    });
  } catch (error) {
    console.error('Error updating bet and wallet:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};


exports.calculateNetOutcome = async (req, res) => {
  try {
    const { userId, match } = req.params;
    
    if (!userId || !match) {
      return res.status(400).json({
        success: false,
        message: 'User ID and match are required',
      });
    }

    // Find all pending bets for this user and match
    const pendingBets = await Bet2.find({
      user: userId,
      match: match,
      status: "Pending"
    });

    if (pendingBets.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No pending bets found',
        outcomes: {}
      });
    }

    // Get unique team names from the bets
    const teams = [...new Set(pendingBets.map(bet => bet.label))];
    
    // Initialize outcomes object with potential win/loss for each team
    const outcomes = {};
    teams.forEach(team => {
      outcomes[team] = { 
        win: 0,  // Profit if this team wins
        lose: 0  // Loss if this team loses
      };
    });

    // Calculate potential outcomes for each bet
    pendingBets.forEach(bet => {
      const team = bet.label;
      
      if (bet.type === "Lgaai") {
        // For Lgaai (Back) bets:
        // If team wins: Add profit to this team's win
        outcomes[team].win += parseFloat(bet.profit);
        
        // If team loses: Add stake loss to this team's lose
        outcomes[team].lose -= parseFloat(bet.stake);
        
      } else if (bet.type === "khaai") {
        // For Khaai (Lay) bets:
        // If team loses: Add profit to this team's lose (it's a win when team loses)
        outcomes[team].lose += parseFloat(bet.profit);
        
        // If team wins: Add liability loss to this team's win (it's a loss when team wins)
        outcomes[team].win -= parseFloat(bet.liability);
      }
    });

    // For each team, calculate the potential outcomes for all other teams
    const completeOutcomes = {};
    teams.forEach(team => {
      completeOutcomes[team] = {};
      
      // For each team, calculate what happens if it wins or if other teams win
      teams.forEach(resultTeam => {
        if (team === resultTeam) {
          // If this team wins
          completeOutcomes[team].win = outcomes[team].win;
        } else {
          // If this team loses (another team wins)
          completeOutcomes[team].lose = outcomes[team].lose;
        }
      });
    });

    res.status(200).json({
      success: true,
      outcomes: completeOutcomes
    });
  } catch (error) {
    console.error('Error calculating net outcome:', error);
    res.status(500).json({
      success: false,
      message: 'Error calculating net outcome',
      error: error.message
    });
  }
};

exports.updateBet = async (req, res) => {
  try {
    const { stake, profit } = req.body;
    const betId = req.params.id;

    if (!betId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Bet ID is required' 
      });
    }

    // Find the bet
    const bet = await Bet2.findById(betId);
    
    if (!bet) {
      return res.status(404).json({ 
        success: false, 
        message: 'Bet not found' 
      });
    }

    // Update bet details
    if (stake !== undefined) {
      bet.stake = parseFloat(stake).toFixed(2);
    }
    
    if (profit !== undefined) {
      bet.profit = parseFloat(profit).toFixed(2);
    }

    // Save the updated bet
    const updatedBet = await bet.save();

    res.json({ 
      success: true, 
      message: 'Bet updated successfully', 
      bet: updatedBet
    });
  } catch (error) {
    console.error('Error updating bet:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

exports.updateExposure = async (req, res) => {
  const { userId, exposureBalance } = req.body;

  try {
      // Validate input
      if (!userId) {
          return res.status(400).json({ success: false, message: "User ID is required" });
      }
      
      if (exposureBalance === undefined) {
          return res.status(400).json({ success: false, message: "Exposure balance is required" });
      }

      // Find the user by ID - try both userId and user fields
      let userWallet = await User_Wallet.findOne({ userId });
      if (!userWallet) {
          // Try with user field if userId field doesn't work
          userWallet = await User_Wallet.findOne({ user: userId });
          if (!userWallet) {
              return res.status(404).json({ success: false, message: "User not found" });
          }
      }

      // Get current exposure balance
      const currentExposure = userWallet.exposureBalance !== undefined ? userWallet.exposureBalance : 0;

      // Only update if the exposure balance has changed significantly (more than 0.01 difference)
      if (Math.abs(currentExposure - exposureBalance) > 0.01) {
          console.log(`Updating exposure for user ${userId}: ${currentExposure} -> ${exposureBalance}`);
          
          // Calculate the difference in exposure
          const exposureDifference = exposureBalance - currentExposure;
          
          // Update the exposure balance
          userWallet.exposureBalance = exposureBalance;
          
          // If exposure is decreasing, add the difference back to wallet balance
          if (exposureDifference < 0) {
              const amountToAddToWallet = Math.abs(exposureDifference);
              
              // Update the correct wallet field based on which one exists
              if (userWallet.walletBalance !== undefined) {
                  userWallet.walletBalance += amountToAddToWallet;
                  console.log(`Adding ${amountToAddToWallet} back to wallet due to reduced exposure`);
              } else if (userWallet.balance !== undefined) {
                  userWallet.balance += amountToAddToWallet;
                  console.log(`Adding ${amountToAddToWallet} back to wallet due to reduced exposure`);
              }
          }
          
          await userWallet.save();
          console.log(`Exposure updated successfully for user ${userId}`);
      } else {
          console.log(`Skipping exposure update for user ${userId} - no significant change`);
      }

      // Return the correct wallet balance based on which field exists
      const walletBalance = userWallet.walletBalance !== undefined ? userWallet.walletBalance : 
                           (userWallet.balance !== undefined ? userWallet.balance : 0);

      res.json({ 
          success: true, 
          message: "Exposure balance updated successfully", 
          exposureBalance: userWallet.exposureBalance || 0,
          walletBalance: walletBalance
      });
  } catch (error) {
      console.error("Error updating exposure balance:", error);
      res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, amount, userID } = req.body;

    // Validate required fields
    if (!id || !status || !userID) {
      return res.status(400).json({ success: false, message: "Bet ID, status, and user ID are required" });
    }

    // Find the bet
    const bet = await Bet2.findById(id);
    if (!bet) {
      return res.status(404).json({ success: false, message: "Bet not found" });
    }

    // Find user wallet - try both userId and user fields
    let userWallet = await User_Wallet.findOne({ userId: userID });
    if (!userWallet) {
      // Try with user field if userId field doesn't work
      userWallet = await User_Wallet.findOne({ user: userID });
      if (!userWallet) {
        return res.status(404).json({ success: false, message: "User wallet not found" });
      }
    }

    // Calculate amount to release from exposure based on bet type
    let amountToReleaseFromExposure = 0;
    
    if (bet.type === "Khaai" || bet.type === "khaai") {
      // For Khaai (Lay) bets, release the liability (odds * stake / 100)
      amountToReleaseFromExposure = (parseFloat(bet.odds) * parseFloat(bet.stake)) / 100;
    } else if (bet.type === "Lgaai") {
      // For Lgaai (Back) bets, release the stake
      amountToReleaseFromExposure = parseFloat(bet.stake);
    } else if (bet.type === "YES") {
      // For YES bets, release the stake
      amountToReleaseFromExposure = parseFloat(bet.stake);
    } else if (bet.type === "NO") {
      // For NO bets, release the liability (stake × odds)
      amountToReleaseFromExposure = parseFloat(bet.stake) * parseFloat(bet.odds);
    }

    // Check for opposing bets to adjust exposure correctly
    let netExposureToRelease = amountToReleaseFromExposure;
    
    // Find all pending bets for the same label and match
    const pendingBets = await Bet2.find({
      user: userID,
      label: bet.label,
      match: bet.match,
      status: "Pending",
      _id: { $ne: bet._id } // Exclude the current bet
    });
    
    // Handle Lgaai/Khaai (Back/Lay) bets
    if (bet.type === "Lgaai") {
      // For Lgaai (Back) bets, find opposing Khaai bets
      const khaiBets = pendingBets.filter(b => 
        (b.type === "Khaai" || b.type === "khaai") && 
        b.label === bet.label
      );
      
      if (khaiBets.length > 0) {
        // Calculate total Khaai liability
        const khaaiLiability = khaiBets.reduce((total, b) => 
          total + ((parseFloat(b.odds) * parseFloat(b.stake)) / 100), 0
        );
        
        // Adjust exposure release based on opposing bets
        netExposureToRelease = Math.max(0, parseFloat(bet.stake) - khaaiLiability);
        console.log(`Lgaai bet with opposing Khaai bets. Net exposure to release: ${netExposureToRelease}`);
      }
    } 
    else if (bet.type === "Khaai" || bet.type === "khaai") {
      // For Khaai (Lay) bets, find opposing Lgaai bets
      const lgaaiBets = pendingBets.filter(b => 
        b.type === "Lgaai" && 
        b.label === bet.label
      );
      
      if (lgaaiBets.length > 0) {
        // Calculate total Lgaai stake
        const lgaaiStake = lgaaiBets.reduce((total, b) => 
          total + parseFloat(b.stake), 0
        );
        
        // Calculate Khaai liability
        const khaaiLiability = (parseFloat(bet.odds) * parseFloat(bet.stake)) / 100;
        
        // Adjust exposure release based on opposing bets
        netExposureToRelease = Math.max(0, khaaiLiability - lgaaiStake);
        console.log(`Khaai bet with opposing Lgaai bets. Net exposure to release: ${netExposureToRelease}`);
      }
    }
    // Handle YES/NO bets
    else if (bet.type === "YES") {
      // For YES bets, find opposing NO bets on the same market (same run value)
      const noBets = pendingBets.filter(b => 
        b.type === "NO" && 
        b.run === bet.run
      );
      
      if (noBets.length > 0) {
        // Calculate total NO bet liabilities
        const totalNoLiability = noBets.reduce((total, b) => 
          total + (parseFloat(b.stake) * parseFloat(b.odds)), 0
        );
        
        // Calculate YES bet liability (stake amount)
        const yesLiability = parseFloat(bet.stake);
        
        // Adjust exposure release based on opposing bets
        netExposureToRelease = Math.max(0, yesLiability - totalNoLiability);
        console.log(`YES bet with opposing NO bets. Net exposure to release: ${netExposureToRelease}`);
      }
    } 
    else if (bet.type === "NO") {
      // For NO bets, find opposing YES bets on the same market (same run value)
      const yesBets = pendingBets.filter(b => 
        b.type === "YES" && 
        b.run === bet.run
      );
      
      if (yesBets.length > 0) {
        // Calculate total YES bet stakes
        const totalYesStake = yesBets.reduce((total, b) => 
          total + parseFloat(b.stake), 0
        );
        
        // Calculate NO bet liability (stake × odds)
        const noLiability = parseFloat(bet.stake) * parseFloat(bet.odds);
        
        // Adjust exposure release based on opposing bets
        netExposureToRelease = Math.max(0, noLiability - totalYesStake);
        console.log(`NO bet with opposing YES bets. Net exposure to release: ${netExposureToRelease}`);
      }
    }

    // Update bet status
    bet.status = status;
    await bet.save();

    // Handle wallet updates based on status
    if (status === "Cancelled") {
      // For cancelled bets, return the specified amount to wallet and reduce exposure
      const amountToAdd = amount ? parseFloat(amount) : amountToReleaseFromExposure;
      
      // Update the correct wallet field based on which one exists
      if (userWallet.walletBalance !== undefined) {
        userWallet.walletBalance += amountToAdd;
        userWallet.exposureBalance = Math.max(0, userWallet.exposureBalance - netExposureToRelease);
      } else if (userWallet.balance !== undefined) {
        userWallet.balance += amountToAdd;
        // If using old wallet model, may not have exposureBalance field
        if (userWallet.exposureBalance !== undefined) {
          userWallet.exposureBalance = Math.max(0, userWallet.exposureBalance - netExposureToRelease);
        }
      }
      
      console.log(`Bet cancelled. Adding ${amountToAdd} to wallet and reducing exposure by ${netExposureToRelease}`);
    } 
    else if (status === "Won") {
      // For winning bets, add stake + profit to wallet and reduce exposure
      let winAmount = 0;
      
      if (bet.type === "Lgaai") {
        // For Lgaai bets, win amount is stake + profit
        winAmount = parseFloat(bet.stake) + parseFloat(bet.profit);
      } else if (bet.type === "Khaai" || bet.type === "khaai") {
        // For Khaai bets, win amount is stake (profit)
        winAmount = parseFloat(bet.stake);
      } else if (bet.type === "YES") {
        // For YES bets, win amount is stake + profit
        // Profit is calculated as odds * stake
        winAmount = parseFloat(bet.stake) + parseFloat(bet.profit);
      } else if (bet.type === "NO") {
        // For NO bets, win amount is profit (stake amount)
        winAmount = parseFloat(bet.stake);
      }
      
      // Update the correct wallet field based on which one exists
      if (userWallet.walletBalance !== undefined) {
        userWallet.walletBalance += winAmount;
        userWallet.exposureBalance = Math.max(0, userWallet.exposureBalance - netExposureToRelease);
      } else if (userWallet.balance !== undefined) {
        userWallet.balance += winAmount;
        // If using old wallet model, may not have exposureBalance field
        if (userWallet.exposureBalance !== undefined) {
          userWallet.exposureBalance = Math.max(0, userWallet.exposureBalance - netExposureToRelease);
        }
      }
      
      console.log(`Bet won. Adding ${winAmount} to wallet and reducing exposure by ${netExposureToRelease}`);
    }
    else if (status === "Lost") {
      // For lost bets, only reduce exposure (stake is already deducted)
      if (userWallet.exposureBalance !== undefined) {
        userWallet.exposureBalance = Math.max(0, userWallet.exposureBalance - netExposureToRelease);
      }
      
      console.log(`Bet lost. Reducing exposure by ${netExposureToRelease}`);
    }

    // Save wallet changes
    await userWallet.save();

    // Emit socket event for the updated bet
    await betSocketController.emitBetUpdate(bet);
    
    // Also emit an update for all user bets to refresh the list
    await betSocketController.emitBetsUpdate(userID);

    // Return success response with updated wallet balance
    return res.status(200).json({
      success: true,
      message: `Bet status updated to ${status}`,
      walletBalance: userWallet.walletBalance || userWallet.balance || 0,
      exposureBalance: userWallet.exposureBalance || 0,
      netExposureReleased: netExposureToRelease
    });
  } catch (error) {
    console.error("Error updating bet status:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update result for match odds (Lagaai/Khaai)
exports.updateResult = async (req, res) => {
  try {
    const { label, result, type, match } = req.body;

    if (!label || !result || !match) {
      return res.status(400).json({ success: false, message: "Label, match, and result are required" });
    }

    let response;
    
        if (type === "cancel") {
      // Cancel all bets for this market
      response = await BettingLogic.cancelMarket(match, label, "matchOdds");
          } else {
      // Settle the market with the given result
      response = await BettingLogic.settleMatchOddsMarket(match, label, result);
    }

    if (!response.success) {
      return res.status(404).json(response);
    }

    res.json(response);
  } catch (error) {
    console.error("Error updating result:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update result for fancy markets (YES/NO)
exports.updateFancyResult = async (req, res) => {
  try {
    const { match, market, result, type } = req.body;

    if (!match || !market || (type !== "cancel" && !result)) {
      return res.status(400).json({ 
        success: false, 
        message: "Match, market, and result (for non-cancel) are required" 
      });
    }

    let response;
    
        if (type === "cancel") {
      // Cancel all bets for this market
      response = await BettingLogic.cancelMarket(match, market, "fancy");
            } else {
      // Settle the market with the given result
      response = await BettingLogic.settleFancyMarket(match, market, result);
    }

    if (!response.success) {
      return res.status(404).json(response);
    }

    res.json(response);
  } catch (error) {
    console.error("Error updating fancy result:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Revert a declared result
exports.revertResult = async (req, res) => {
  try {
    const { match, market, type } = req.body;

    console.log(`Attempting to revert result for match: ${match}, market: ${market || 'N/A'}, type: ${type}`);

    if (!match || !type) {
      return res.status(400).json({ success: false, message: "Match and type are required" });
    }

    // Find bets to revert based on type
    let betsToRevert;
    let query = {};
    
    if (type === "match") {
      // For match odds, find all non-pending bets for the match
      query = { 
        match: match,
        status: { $ne: "Pending" },
        $or: [{ type: "Lgaai" }, { type: "Khaai" }, { type: "khaai" }]
      };
      console.log("Searching for match odds bets with query:", JSON.stringify(query));
    } else if (type === "fancy") {
      // For fancy markets, find all non-pending bets for the specific market
      if (!market) {
        return res.status(400).json({ success: false, message: "Market is required for fancy revert" });
      }
      
      query = { 
        match: match,
        label: market,
        status: { $ne: "Pending" },
        $or: [{ type: "YES" }, { type: "NO" }]
      };
      console.log("Searching for fancy market bets with query:", JSON.stringify(query));
    } else {
      return res.status(400).json({ success: false, message: "Invalid type" });
    }

    // First check if any bets exist for this match/market, regardless of status
    const anyBetsExist = await Bet2.findOne({ 
      match: match,
      ...(type === "fancy" ? { label: market } : {})
    });

    if (!anyBetsExist) {
      console.log(`No bets found at all for match: ${match}${type === "fancy" ? `, market: ${market}` : ''}`);
      return res.status(404).json({ 
        success: false, 
        message: `No bets found for ${type === "fancy" ? "market" : "match"}` 
      });
    }

    // Now find settled bets to revert
    betsToRevert = await Bet2.find(query);

    if (betsToRevert.length === 0) {
      console.log(`No settled bets found to revert for match: ${match}${type === "fancy" ? `, market: ${market}` : ''}`);
      return res.status(200).json({ 
        success: true, 
        message: "No settled bets found to revert, but the match/market exists" 
      });
    }

    console.log(`Found ${betsToRevert.length} bets to revert`);

    // Process each bet
    let processedCount = 0;
    let errorCount = 0;

    for (const bet of betsToRevert) {
      try {
        // Find user wallet
        const userWallet = await User_Wallet.findOne({ user: bet.user });
        
        if (!userWallet) {
          console.error(`Wallet not found for user ${bet.user}`);
          errorCount++;
          continue;
        }
        
        // Handle different bet statuses
        if (bet.status === "Won") {
          // For won bets, deduct the winnings that were added
          let amountToDeduct = 0;
          
          if (bet.type === "Lgaai" || bet.type === "YES") {
            // For Lgaai and YES bets, deduct stake + profit
            amountToDeduct = parseFloat(bet.stake) + parseFloat(bet.profit);
          } else if (bet.type === "Khaai" || bet.type === "khaai" || bet.type === "NO") {
            // For Khaai and NO bets, deduct stake
            amountToDeduct = parseFloat(bet.stake);
          }
          
          // Check if user has sufficient balance
          if (userWallet.balance < amountToDeduct) {
            console.error(`Insufficient balance for user ${bet.user} to revert bet ${bet._id}`);
            errorCount++;
            continue;
          }
          
          // Deduct the amount
          userWallet.balance -= amountToDeduct;
        } 
        else if (bet.status === "Cancelled") {
          // For cancelled bets, deduct the returned amount
          let amountToDeduct = 0;
          
          if (bet.type === "Lgaai" || bet.type === "YES") {
            // For Lgaai and YES bets, deduct stake
            amountToDeduct = parseFloat(bet.stake);
          } else if (bet.type === "Khaai" || bet.type === "khaai") {
            // For Khaai bets, deduct liability
            amountToDeduct = (parseFloat(bet.odds) * parseFloat(bet.stake)) / 100;
          } else if (bet.type === "NO") {
            // For NO bets, deduct liability (stake × odds)
            amountToDeduct = parseFloat(bet.stake) * parseFloat(bet.odds);
          }
          
          // Check if user has sufficient balance
          if (userWallet.balance < amountToDeduct) {
            console.error(`Insufficient balance for user ${bet.user} to revert bet ${bet._id}`);
            errorCount++;
            continue;
          }
          
          // Deduct the amount
          userWallet.balance -= amountToDeduct;
        }
        // For lost bets, no wallet adjustment needed
        
        // Update exposure balance
        if (userWallet.exposureBalance !== undefined) {
          // Add back to exposure
          let exposureToAdd = 0;
          if (bet.type === "Lgaai" || bet.type === "YES") {
            exposureToAdd = parseFloat(bet.stake);
          } else if (bet.type === "Khaai" || bet.type === "khaai") {
            exposureToAdd = (parseFloat(bet.odds) * parseFloat(bet.stake)) / 100;
          } else if (bet.type === "NO") {
            exposureToAdd = parseFloat(bet.stake) * parseFloat(bet.odds);
          }
          
          userWallet.exposureBalance += exposureToAdd;
        }
        
        // Reset bet status to pending
        bet.status = "Pending";
        bet.result = null;
        
        // Save changes
        await bet.save();
        await userWallet.save();
        
        // Emit socket event for the updated bet
        await betSocketController.emitBetUpdate(bet);
        
        processedCount++;
      } catch (error) {
        console.error(`Error reverting bet ${bet._id}:`, error);
        errorCount++;
      }
    }
    
    // Emit an update for all user bets to refresh the list
    const uniqueUserIds = [...new Set(betsToRevert.map(bet => bet.user))];
    for (const userId of uniqueUserIds) {
      await betSocketController.emitBetsUpdate(userId);
    }

    res.json({ 
      success: true, 
      message: `Result reverted successfully. Processed ${processedCount} bets with ${errorCount} errors.` 
    });
  } catch (error) {
    console.error("Error reverting result:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all matches with pending bets
exports.getMatchesWithPendingBets = async (req, res) => {
  try {
    console.log("Fetching matches with pending bets...");
    
    // Find all distinct matches with pending bets
    let matches = await Bet2.distinct("match", { status: "Pending" });
    
    // If no pending bets, get all matches from the bets collection
    if (matches.length === 0) {
      console.log("No pending bets found, fetching all matches...");
      matches = await Bet2.distinct("match");
      console.log(`Found ${matches.length} total matches:`, matches);
    } else {
      console.log(`Found ${matches.length} matches with pending bets:`, matches);
    }
    
    // Filter out null or empty match values
    matches = matches.filter(match => match && match.trim() !== '');
    
    res.json({ 
      success: true, 
      matches 
    });
  } catch (error) {
    console.error("Error fetching matches:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Get all fancy markets for a specific match
exports.getFancyMarketsForMatch = async (req, res) => {
  try {
    const { match } = req.params;
    
    console.log(`Fetching fancy markets for match: ${match}`);
    
    if (!match) {
      console.error("Match parameter is missing");
      return res.status(400).json({ success: false, message: "Match is required" });
    }
    
    // Find all distinct fancy markets (labels) for the match with pending YES/NO bets
    let markets = await Bet2.distinct("label", { 
      match,
      status: "Pending",
      $or: [{ type: "YES" }, { type: "NO" }]
    });
    
    // If no pending YES/NO bets, get all labels for the match
    if (markets.length === 0) {
      console.log(`No pending YES/NO bets found for match ${match}, fetching all labels...`);
      markets = await Bet2.distinct("label", { match });
      console.log(`Found ${markets.length} total labels for match ${match}:`, markets);
    } else {
      console.log(`Found ${markets.length} fancy markets with pending bets for match ${match}:`, markets);
    }
    
    // Filter out null or empty market values
    markets = markets.filter(market => market && market.trim() !== '');
    
    res.json({ 
      success: true, 
      markets 
    });
  } catch (error) {
    console.error("Error fetching fancy markets:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

