// const Bet2 = require('../models/crickbetModel');
// const User_Wallet = require('../models/Wallet'); 
// const User = require('../models/UserSignUp');  
// const mongoose = require('mongoose');


// exports.placeBet = async (req, res) => {
//   try {
//     const { label, odds, stake, profit, userId, type, run, match } = req.body;
    
//     // Validate input
//     if (!label || !odds || !userId ) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid input: all bet details are required and stake must be greater than 0',
//       });
//     }
    
//     const userWallet = await User_Wallet.findOne({ user: userId });
//     if (!userWallet) {
//       return res.status(404).json({ success: false, message: 'Wallet not found' });
//     }
    
//     // For zero stake bets (used in bet cancellation/reduction logic), just record the bet
//     if (parseFloat(stake) === 0 && parseFloat(profit) === 0) {
//       const newBet = new Bet2({
//         user: userId, 
//         label,
//         odds,
//         run,
//         stake,
//         profit,
//         liability: 0,
//         type,
//         match,
//       });
      
//       const savedBet = await newBet.save();
      
//       return res.status(201).json({
//         success: true,
//         message: 'Bet recorded successfully',
//         bet: savedBet,
//         updatedWallet: userWallet.balance,
//       });
//     }
    
//     // Check for opposite bets (YES/NO) with the same run value
//     if (type === "YES" || type === "NO") {
//       const oppositeType = type === "YES" ? "NO" : "YES";
//       const oppositeBets = await Bet2.find({
//         user: userId,
//         label,
//         type: oppositeType,
//         run,
//         status: "Pending",
//         match
//       });
      
//       if (oppositeBets.length > 0) {
//         // Calculate total stake and profit from opposite bets
//         let totalOppositeStake = 0;
//         let totalOppositeProfit = 0;
        
//         oppositeBets.forEach(bet => {
//           totalOppositeStake += parseFloat(bet.stake);
//           totalOppositeProfit += parseFloat(bet.profit);
//         });
        
//         // For YES bets, compare stake with total NO profit
//         // For NO bets, compare stake with total YES stake
//         const compareValue = type === "YES" ? totalOppositeProfit : totalOppositeStake;
        
//         // Case 1: Stakes are equal - cancel all opposite bets
//         if (Math.abs(parseFloat(stake) - compareValue) < 0.01) {
//           // Cancel all opposite bets and return their stakes to wallet
//           for (const bet of oppositeBets) {
//             // Return the stake to the wallet - this is the amount that was originally deducted
//             const returnAmount = parseFloat(bet.stake);
//             userWallet.balance += returnAmount;
            
//             console.log(`Canceling bet ${bet._id}. Returning ${returnAmount} to wallet. New balance: ${userWallet.balance}`);
            
//             // Update bet status
//             bet.status = "Cancelled";
//             await bet.save();
//           }
          
//           await userWallet.save();
          
//           // Create a dummy bet with zero stake for record keeping
//           const newBet = new Bet2({
//             user: userId, 
//             label,
//             odds,
//             run,
//             stake: 0,
//             profit: 0,
//             liability: 0,
//             type,
//             match,
//           });
          
//           const savedBet = await newBet.save();
          
//           return res.status(201).json({
//             success: true,
//             message: 'Opposite bets cancelled successfully',
//             bet: savedBet,
//             updatedWallet: userWallet.balance,
//           });
//         }
        
//         // Case 2: New stake is greater than opposite stake - cancel all opposite bets and create new bet with remaining stake
//         else if (parseFloat(stake) > compareValue) {
//           // Cancel all opposite bets
//           for (const bet of oppositeBets) {
//             // Return the stake to the wallet
//             const returnAmount = parseFloat(bet.stake);
//             userWallet.balance += returnAmount;
            
//             // Update bet status
//             bet.status = "Cancelled";
//             await bet.save();
//           }
          
//           // Calculate remaining stake
//           const remainingStake = parseFloat(stake) - compareValue;
          
//           // Calculate amount to deduct from wallet for the new bet
//           let deductAmount;
//           if (type === "YES") {
//             deductAmount = remainingStake;
//           } else { // type === "NO"
//             deductAmount = ((parseFloat(odds) / 100) * remainingStake).toFixed(2);
//           }
          
//           // Check if user has sufficient balance
//           if (userWallet.balance < deductAmount) {
//             return res.status(400).json({ success: false, message: 'Insufficient balance for remaining stake' });
//           }
          
//           // Deduct the amount from wallet
//           userWallet.balance -= deductAmount;
//           await userWallet.save();
          
//           // Create new bet with remaining stake
//           const newBet = new Bet2({
//             user: userId, 
//             label,
//             odds,
//             run,
//             stake: type === "YES" ? remainingStake : ((parseFloat(odds) / 100) * remainingStake).toFixed(2),
//             profit: type === "YES" ? ((parseFloat(odds) / 100) * remainingStake).toFixed(2) : remainingStake,
//             liability: 0,
//             type,
//             match,
//           });
          
//           const savedBet = await newBet.save();
          
//           return res.status(201).json({
//             success: true,
//             message: 'Opposite bets cancelled and new bet placed with remaining stake',
//             bet: savedBet,
//             updatedWallet: userWallet.balance,
//           });
//         }
        
//         // Case 3: New stake is less than opposite stake - reduce opposite bets proportionally
//         else {
//           let remainingStakeToCancel = parseFloat(stake);
          
//           // Process each opposite bet until we've cancelled enough
//           for (const bet of oppositeBets) {
//             if (remainingStakeToCancel <= 0) break;
            
//             const compareAmount = type === "YES" ? parseFloat(bet.profit) : parseFloat(bet.stake);
            
//             if (compareAmount <= remainingStakeToCancel) {
//               // Cancel this bet completely
//               const returnAmount = parseFloat(bet.stake);
//               userWallet.balance += returnAmount;
              
//               // Update bet status
//               bet.status = "Cancelled";
//               await bet.save();
              
//               remainingStakeToCancel -= compareAmount;
//             } else {
//               // Partially reduce this bet
//               const reductionRatio = remainingStakeToCancel / compareAmount;
//               const newStake = parseFloat(bet.stake) * (1 - reductionRatio);
//               const newProfit = parseFloat(bet.profit) * (1 - reductionRatio);
              
//               // Return the reduced portion of the stake to the wallet
//               const returnAmount = parseFloat(bet.stake) * reductionRatio;
//               userWallet.balance += returnAmount;
              
//               // Update the bet with reduced stake and profit
//               bet.stake = newStake.toFixed(2);
//               bet.profit = newProfit.toFixed(2);
//               await bet.save();
              
//               remainingStakeToCancel = 0;
//             }
//           }
          
//           await userWallet.save();
          
//           // Create a dummy bet with zero stake for record keeping
//           const newBet = new Bet2({
//             user: userId, 
//             label,
//             odds,
//             run,
//             stake: 0,
//             profit: 0,
//             liability: 0,
//             type,
//             match,
//           });
          
//           const savedBet = await newBet.save();
          
//           return res.status(201).json({
//             success: true,
//             message: 'Opposite bets reduced successfully',
//             bet: savedBet,
//             updatedWallet: userWallet.balance,
//           });
//         }
//       }
//     }
    
//     // If no opposite bets or not a YES/NO bet, proceed with normal bet placement
    
//     // Calculate the amount to deduct from wallet based on bet type
//     let deductAmount = stake;
//     let liability = 0;
    
//     // For Khaai (Lay) bets, calculate liability
//     if (type === "khaai") {
//       liability = (odds / 100) * stake;
//       deductAmount = liability; // For Khaai bets, we reserve the liability amount
//     }
    
//     if (userWallet.balance < deductAmount) {
//       return res.status(400).json({ success: false, message: 'Insufficient balance' });
//     }

//     userWallet.balance -= deductAmount;
//     await userWallet.save();
    
//     const newBet = new Bet2({
//       user: userId, 
//       label,
//       odds,
//       run,
//       stake,
//       profit,
//       liability,
//       type,
//       match,
//     });

//     // Save the bet
//     const savedBet = await newBet.save();

//     res.status(201).json({
//       success: true,
//       message: 'Bet placed successfully',
//       bet: savedBet,
//       updatedWallet: userWallet.balance,
//     });
//   } catch (err) {
//     console.error('Error placing bet:', err);
//     res.status(500).json({ success: false, message: 'Error placing bet', error: err.message });
//   }
// };




// exports.getUserBets = async (req, res) => {
//   const { userId } = req.params; 
 
//   try {
//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid user ID',
//       });
//     }
//     const bets = await Bet2.find({ user: new mongoose.Types.ObjectId(userId) });
//     if (!bets || bets.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'No bets found for this user',
//       });
//     }
//    res.status(200).json({
//       success: true,
//       bets,
//     });
//   } catch (err) {
//     console.error('Error fetching bets:', err);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching bets',
//     });
//   }
// };



// exports.updateWallet = async (req, res) => {
//   const { userId, amount } = req.body;

//   try {
//       // Find the user by ID
//       const userWallet = await User_Wallet.findOne({ user: userId });
//       if (!userWallet) {
//           return res.status(404).json({ success: false, message: "User not found" });
//       }

//       // Update the wallet balance
//       userWallet.balance += amount;
//       await userWallet.save();

//       res.json({ success: true, message: "Wallet updated successfully", walletBalance: userWallet.balance});
//   } catch (error) {
//       console.error("Error updating wallet:", error);
//       res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// const bcrypt = require("bcryptjs"); 


// exports.adminusersignup = async (req, res) => {
 
//   try {
//     const { username, email, password, balance } = req.body;

//     if (!username || !email || !password || balance === undefined) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create a new user
//     const newUser = new User({
//       username,
//       email,
//       password: hashedPassword,
//     });

//     // Save user first
//     const savedUser = await newUser.save();

//     // Create wallet for the user
//     const wallet = new User_Wallet({
//       user: savedUser._id,
//       balance: balance, // Store initial balance
//     });

//     const savedWallet = await wallet.save();

//     // Link wallet to user
//     savedUser.wallet = savedWallet._id;
//     await savedUser.save();

//     res.status(201).json({
//       message: "User registered successfully",
//       user: {
//         id: savedUser._id,
//         username: savedUser.username,
//         email: savedUser.email,
//         balance: savedWallet.balance,
//       },
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };


// exports.allbetsupdate = async (req, res) => {
//   try {
   

//     // Fetch all bets with required fields
//     const allBets = await Bet2.find().select("label odds stake profit type createdAt result match");

//     console.log("Fetched Bets:", allBets.length);
    
//     res.status(200).json({ success: true, data: allBets });
//   } catch (error) {
//     console.error("Error fetching bets:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


// exports.updateResultUserBet = async (req, res) => {
//   try {
//     const { label, result } = req.body;

//     if (!label || !result) {
//       return res.status(400).json({ success: false, message: "Label and result are required" });
//     }

//     // Find all pending bets that match the label
//     const pendingBets = await Bet2.find({ label, status: "Pending" });

//     if (pendingBets.length === 0) {
//       return res.status(404).json({ success: false, message: "No pending bets found for this label" });
//     }

//     // Process each bet
//     for (const bet of pendingBets) {
//       // Handle YES/NO bets
//       if (bet.type === "YES") {
//         const userWallet = await User_Wallet.findOne({ user: bet.user });
        
//         if (!userWallet) {
//           console.error(`Wallet not found for user ${bet.user}`);
//           continue;
//         }
        
//         // For YES bets, check if the run value matches the result
//         if (parseFloat(bet.run) === parseFloat(result)) {
//           // User wins - return stake and add profit
//           userWallet.balance += parseFloat(bet.stake) + parseFloat(bet.profit);
//           await userWallet.save();
          
//           // Update bet status to "Win"
//           await Bet2.findByIdAndUpdate(bet._id, { status: "Win", result: result });
//         } else {
//           // User loses - stake is already deducted
//           await Bet2.findByIdAndUpdate(bet._id, { status: "Loss", result: result });
//         }
//       } 
//       else if (bet.type === "NO") {
//         const userWallet = await User_Wallet.findOne({ user: bet.user });
        
//         if (!userWallet) {
//           console.error(`Wallet not found for user ${bet.user}`);
//           continue;
//         }
        
//         // For NO bets, check if the run value does NOT match the result
//         if (parseFloat(bet.run) !== parseFloat(result)) {
//           // User wins - return stake and add profit
//           userWallet.balance += parseFloat(bet.stake) + parseFloat(bet.profit);
//           await userWallet.save();
          
//           // Update bet status to "Win"
//           await Bet2.findByIdAndUpdate(bet._id, { status: "Win", result: result });
//         } else {
//           // User loses - stake is already deducted
//           await Bet2.findByIdAndUpdate(bet._id, { status: "Loss", result: result });
//         }
//       }
//       // Handle Khaai (Lay) bets
//       else if (bet.type === "khaai" && bet.label === result) {
//         // For Khaai (Lay) bets, if the team loses, user wins the stake amount
//         const userWallet = await User_Wallet.findOne({ user: bet.user });

//         if (userWallet) {
//           // Return the liability (already deducted) and add the profit (stake amount)
//           userWallet.balance += bet.liability + bet.profit;
//           await userWallet.save();
//         }

//         // Update the bet status to "Win"
//         await Bet2.findByIdAndUpdate(bet._id, { status: "Win", result: result });
//       } 
//       // Handle Lgaai (Back) bets
//       else if (bet.type === "Lgaai" && bet.label === result) {
//         // For Lgaai (Back) bets, if the team wins, user wins the profit (odds * stake / 100)
//         const userWallet = await User_Wallet.findOne({ user: bet.user });

//         if (userWallet) {
//           // Return the stake (already deducted) and add the profit
//           userWallet.balance += parseFloat(bet.stake) + parseFloat(bet.profit);
//           await userWallet.save();
//         }

//         // Update the bet status to "Win"
//         await Bet2.findByIdAndUpdate(bet._id, { status: "Win", result: result });
//       } else {
//         // If conditions are not satisfied, just update the bet status to "Loss"
//         await Bet2.findByIdAndUpdate(bet._id, { status: "Loss", result: result });
//       }
//     }

//     res.json({ success: true, message: "Bets updated successfully" });
//   } catch (error) {
//     console.error("Error updating bets:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };


// exports.updatecricketlagaikhai = async (req, res) => {
//   try {
//     const { status, amount, userID } = req.body;

//     if (!status || amount === undefined || !userID) {
//       return res.status(400).json({ 
//         success: false, 
//         message: 'Status, amount, and userID are required' 
//       });
//     }

//     // Find the bet and update status
//     const bet = await Bet2.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { new: true }
//     );

//     if (!bet) {
//       return res.status(404).json({ 
//         success: false, 
//         message: 'Bet not found' 
//       });
//     }

//     // Find the user's wallet
//     const userWallet = await User_Wallet.findOne({ user: userID });

//     if (!userWallet) {
//       return res.status(404).json({ 
//         success: false, 
//         message: 'Wallet not found' 
//       });
//     }

//     // Update wallet balance with the exact amount passed from frontend
//     const amountToAdd = parseFloat(amount);
//     if (amountToAdd !== 0) {
//       // Add the amount to the wallet
//       userWallet.balance += amountToAdd;
//       await userWallet.save();
      
//       console.log(`Added ${amountToAdd} to wallet for user ${userID}. New balance: ${userWallet.balance}`);
//     }

//     // Fetch the updated wallet balance
//     const updatedWallet = await User_Wallet.findOne({ user: userID });

//     res.json({ 
//       success: true, 
//       message: `Bet status updated to ${status}${amountToAdd !== 0 ? ' and amount added to wallet' : ''}`, 
//       bet, 
//       walletBalance: updatedWallet.balance 
//     });
//   } catch (error) {
//     console.error('Error updating bet and wallet:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Server error', 
//       error: error.message 
//     });
//   }
// };


// exports.calculateNetOutcome = async (req, res) => {
//   try {
//     const { userId, match } = req.params;
    
//     if (!userId || !match) {
//       return res.status(400).json({
//         success: false,
//         message: 'User ID and match are required',
//       });
//     }

//     // Find all pending bets for this user and match
//     const pendingBets = await Bet2.find({
//       user: userId,
//       match: match,
//       status: "Pending"
//     });

//     if (pendingBets.length === 0) {
//       return res.status(200).json({
//         success: true,
//         message: 'No pending bets found',
//         outcomes: {}
//       });
//     }

//     // Get unique team names from the bets
//     const teams = [...new Set(pendingBets.map(bet => bet.label))];
    
//     // Initialize outcomes object with potential win/loss for each team
//     const outcomes = {};
//     teams.forEach(team => {
//       outcomes[team] = { 
//         win: 0,  // Profit if this team wins
//         lose: 0  // Loss if this team loses
//       };
//     });

//     // Calculate potential outcomes for each bet
//     pendingBets.forEach(bet => {
//       const team = bet.label;
      
//       if (bet.type === "Lgaai") {
//         // For Lgaai (Back) bets:
//         // If team wins: Add profit to this team's win
//         outcomes[team].win += parseFloat(bet.profit);
        
//         // If team loses: Add stake loss to this team's lose
//         outcomes[team].lose -= parseFloat(bet.stake);
        
//       } else if (bet.type === "khaai") {
//         // For Khaai (Lay) bets:
//         // If team loses: Add profit to this team's lose (it's a win when team loses)
//         outcomes[team].lose += parseFloat(bet.profit);
        
//         // If team wins: Add liability loss to this team's win (it's a loss when team wins)
//         outcomes[team].win -= parseFloat(bet.liability);
//       }
//     });

//     // For each team, calculate the potential outcomes for all other teams
//     const completeOutcomes = {};
//     teams.forEach(team => {
//       completeOutcomes[team] = {};
      
//       // For each team, calculate what happens if it wins or if other teams win
//       teams.forEach(resultTeam => {
//         if (team === resultTeam) {
//           // If this team wins
//           completeOutcomes[team].win = outcomes[team].win;
//         } else {
//           // If this team loses (another team wins)
//           completeOutcomes[team].lose = outcomes[team].lose;
//         }
//       });
//     });

//     res.status(200).json({
//       success: true,
//       outcomes: completeOutcomes
//     });
//   } catch (error) {
//     console.error('Error calculating net outcome:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error calculating net outcome',
//       error: error.message
//     });
//   }
// };

// exports.updateBet = async (req, res) => {
//   try {
//     const { stake, profit } = req.body;
//     const betId = req.params.id;

//     if (!betId) {
//       return res.status(400).json({ 
//         success: false, 
//         message: 'Bet ID is required' 
//       });
//     }

//     // Find the bet
//     const bet = await Bet2.findById(betId);
    
//     if (!bet) {
//       return res.status(404).json({ 
//         success: false, 
//         message: 'Bet not found' 
//       });
//     }

//     // Update bet details
//     if (stake !== undefined) {
//       bet.stake = parseFloat(stake).toFixed(2);
//     }
    
//     if (profit !== undefined) {
//       bet.profit = parseFloat(profit).toFixed(2);
//     }

//     // Save the updated bet
//     const updatedBet = await bet.save();

//     res.json({ 
//       success: true, 
//       message: 'Bet updated successfully', 
//       bet: updatedBet
//     });
//   } catch (error) {
//     console.error('Error updating bet:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Server error', 
//       error: error.message 
//     });
//   }
// };



const Bet2 = require('../models/crickbetModel');
const User_Wallet = require('../models/Wallet'); 
const User = require('../models/UserSignUp');  
const mongoose = require('mongoose');
const betSocketController = require('./betSocketController');
const express = require('express');

// Middleware to ensure YES bet profits are correctly calculated
const ensureCorrectYesBetProfit = (req, res, next) => {
  try {
    const { type, stake, odds, oddsYes, profit } = req.body;
    
    // Only process YES bets
    if (type === "YES") {
      // Calculate the correct profit
      const correctOdds = oddsYes || odds;
      const correctProfit = (parseFloat(stake) * parseFloat(correctOdds)) / 100;
      
      // Log the values for debugging
      console.log(`YES bet profit check - Original: ${profit}, Calculated: ${correctProfit}`);
      console.log(`YES bet details - Stake: ${stake}, Odds: ${correctOdds}`);
      
      // If profit seems too high (not divided by 100), fix it
      if (profit > correctProfit * 10) {
        console.warn(`YES bet profit seems too high (${profit}), correcting to ${correctProfit}`);
        req.body.profit = correctProfit;
      }
    }
    next();
  } catch (error) {
    console.error('Error in YES bet profit middleware:', error);
    next(error);
  }
};

// Apply the middleware to the placeBet route
const router = express.Router();
router.post('/api/bets', ensureCorrectYesBetProfit, exports.placeBet);

// Export the router
module.exports = router;

exports.placeBet = async (req, res) => {
  try {
    const { userId, label, odds, oddsYes, run, stake, profit, type, match } = req.body;

    // Validate required fields
    if (!userId || !label || !odds || !type || !match) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Find user wallet - try both userId and user fields
    let userWallet = await User_Wallet.findOne({ userId });
    if (!userWallet) {
      // Try with user field if userId field doesn't work
      userWallet = await User_Wallet.findOne({ user: userId });
      if (!userWallet) {
        return res.status(404).json({ success: false, message: "User wallet not found" });
      }
    }

    // Calculate profit based on bet type
    try {
      let calculatedProfit = 0;
      let amountToDeduct = 0;
      let amountToReturn = 0;
      let shouldCancel = false;
      let betToProcess = null;

      if (type === "YES") {
        // For YES bets, profit is (stake * oddsYes) / 100
        const oddsToUse = oddsYes || odds;
        calculatedProfit = (parseFloat(stake) * parseFloat(oddsToUse)) / 100;
        console.log(`YES bet profit calculation: (${stake} × ${oddsToUse}) / 100 = ${calculatedProfit}`);
        amountToDeduct = parseFloat(stake);
      } else if (type === "NO") {
        // For NO bets, profit is the stake amount
        calculatedProfit = parseFloat(stake);
        console.log(`NO bet profit calculation: stake = ${calculatedProfit}`);
        amountToDeduct = (parseFloat(stake) * parseFloat(odds)) / 100;
      } else if (type === "Lgaai" || type === "lgaai") {
        // For Lgaai bets, profit is (stake * odds) / 100
        calculatedProfit = (parseFloat(stake) * parseFloat(odds)) / 100;
        console.log(`Lgaai bet profit calculation: (${stake} × ${odds}) / 100 = ${calculatedProfit}`);
        amountToDeduct = parseFloat(stake);
      } else if (type === "Khaai" || type === "khaai") {
        // For Khaai (Lay) bets, deduct the liability (odds * stake) directly without dividing by 100
        amountToDeduct = parseFloat(odds) * parseFloat(stake);
        calculatedProfit = parseFloat(stake);
        console.log(`Khaai bet: Deducting liability ${amountToDeduct}, Calculated profit: ${calculatedProfit}`);
      }

      // Ensure profit is a valid number and properly formatted
      calculatedProfit = parseFloat(calculatedProfit).toFixed(2);

      // Double check YES bet profits to ensure they're not too high
      if (type === "YES") {
        console.log(`Validating YES bet profit: ${calculatedProfit}`);
        // If profit seems too high (more than odds% of stake), recalculate
        const maxExpectedProfit = (parseFloat(stake) * parseFloat(oddsYes || odds)) / 100;
        if (parseFloat(calculatedProfit) > maxExpectedProfit) {
          console.warn(`YES bet profit ${calculatedProfit} exceeds maximum expected ${maxExpectedProfit}, correcting`);
          calculatedProfit = maxExpectedProfit.toFixed(2);
        }
      }

      // Return the calculated values
      return {
        profit: calculatedProfit,
        amountToDeduct,
        amountToReturn,
        shouldCancel,
        betToProcess
      };
    } catch (error) {
      console.error('Error calculating bet values:', error);
      throw error;
    }

    // Calculate amount to deduct from wallet based on bet type
    // let amountToDeduct = 0;
    // let amountToReturnToWallet = 0;
    // let shouldCancelBet = false;
    // let betToCancel = null;
    
    if (type === "Khaai" || type === "khaai") {
      // For Khaai (Lay) bets, deduct the liability (odds * stake / 100)
      amountToDeduct = (parseFloat(odds) * parseFloat(stake)) / 100;
      calculatedProfit = parseFloat(stake);
    } else if (type === "Lgaai") {
      // For Lgaai (Back) bets, deduct the stake
      amountToDeduct = parseFloat(stake);
      calculatedProfit = (parseFloat(odds) * parseFloat(stake)) / 100;
    } else if (type === "YES") {
      // For YES bets, deduct the stake amount directly
      amountToDeduct = parseFloat(stake);
      
      // Use the profit sent from frontend if available, otherwise calculate it
      if (profit !== undefined && profit !== null) {
        calculatedProfit = parseFloat(profit);
        
        // Safety check: if profit seems too high (not divided by 100), fix it
        if (calculatedProfit > parseFloat(stake) * 10) {
          console.warn(`YES bet profit seems too high: ${calculatedProfit}. Forcing division by 100.`);
          calculatedProfit = calculatedProfit / 100;
        }
      } else {
        // Calculate profit as (stake * oddsYes) / 100, fall back to odds if oddsYes not provided
        const oddsToUse = oddsYes ? parseFloat(oddsYes) : parseFloat(odds);
        calculatedProfit = (parseFloat(stake) * oddsToUse) / 100;
      }
      
      console.log(`YES bet: Deducting stake amount ${amountToDeduct}, Using odds ${oddsYes || odds}, Calculated profit: ${calculatedProfit}`);
    } else if (type === "NO") {
      // For NO bets, deduct the liability (stake × odds)
      amountToDeduct = parseFloat(stake) * parseFloat(odds) / 100;
      
      // Use the profit sent from frontend if available, otherwise calculate it
      if (profit !== undefined && profit !== null) {
        calculatedProfit = parseFloat(profit);
      } else {
        calculatedProfit = parseFloat(stake);
      }
      
      console.log(`NO bet: Deducting liability ${amountToDeduct}, Calculated profit: ${calculatedProfit}`);
    } else {
      return res.status(400).json({ success: false, message: "Invalid bet type" });
    }

    console.log(`Bet type: ${type}, Initial amount to deduct: ${amountToDeduct}, Calculated profit: ${calculatedProfit}`);

    // Check if user has sufficient balance - check both wallet field formats
    const walletBalance = userWallet.walletBalance !== undefined ? userWallet.walletBalance : userWallet.balance;
    if (walletBalance < amountToDeduct) {
      return res.status(400).json({ success: false, message: "Insufficient balance" });
    }

    // Find all pending bets for the same label and match to handle hedging
    const pendingBets = await Bet2.find({
            user: userId, 
      label: label,
      match: match,
      status: "Pending"
    });
    
    // Initialize variables for exposure calculation
    // let exposureToAdd = amountToDeduct;
    // let amountToReturnToWallet = 0;
    // let shouldCancelBet = false;
    // let betToCancel = null;
    
    // Handle Lgaai/Khaai (Back/Lay) bets
    if (type === "Lgaai" || type === "Khaai" || type === "khaai") {
      // For Lgaai (Back) bets, find opposing Khaai bets
      if (type === "Lgaai") {
        const khaiBets = pendingBets.filter(bet => 
          (bet.type === "Khaai" || bet.type === "khaai") && 
          bet.label === label
        );
        
        if (khaiBets.length > 0) {
          // Calculate total Khaai liability
          const khaaiLiability = khaiBets.reduce((total, bet) => 
            total + ((parseFloat(bet.odds) * parseFloat(bet.stake)) / 100), 0
          );
          
          // Calculate net exposure - the absolute difference between Lgaai stake and Khaai liability
          if (parseFloat(stake) <= khaaiLiability) {
            // If Lgaai stake is less than or equal to Khaai liability, we can reduce exposure
            amountToReturnToWallet = Math.min(khaaiLiability - parseFloat(stake), khaaiLiability);
            exposureToAdd = 0; // No additional exposure needed
          } else {
            // If Lgaai stake is greater than Khaai liability, only add the difference to exposure
            exposureToAdd = parseFloat(stake) - khaaiLiability;
          }
          
          console.log(`Lgaai bet with opposing Khaai bets. Net exposure: ${exposureToAdd}, Amount to return: ${amountToReturnToWallet}`);
        }
      } 
      // For Khaai (Lay) bets, find opposing Lgaai bets
      else if (type === "Khaai" || type === "khaai") {
        const lgaaiBets = pendingBets.filter(bet => 
          bet.type === "Lgaai" && 
          bet.label === label
        );
        
        if (lgaaiBets.length > 0) {
          // Calculate total Lgaai stake
          const lgaaiStake = lgaaiBets.reduce((total, bet) => 
            total + parseFloat(bet.stake), 0
          );
          
          // Calculate Khaai liability
          const khaaiLiability = (parseFloat(odds) * parseFloat(stake)) / 100;
          
          // Calculate net exposure - the absolute difference between Khaai liability and Lgaai stake
          if (khaaiLiability <= lgaaiStake) {
            // If Khaai liability is less than or equal to Lgaai stake, we can reduce exposure
            amountToReturnToWallet = Math.min(lgaaiStake - khaaiLiability, lgaaiStake);
            exposureToAdd = 0; // No additional exposure needed
          } else {
            // If Khaai liability is greater than Lgaai stake, only add the difference to exposure
            exposureToAdd = khaaiLiability - lgaaiStake;
          }
          
          console.log(`Khaai bet with opposing Lgaai bets. Net exposure: ${exposureToAdd}, Amount to return: ${amountToReturnToWallet}`);
        }
      }
    }
    // Handle YES/NO bets (ShreejiLogic approach)
    else if (type === "YES" || type === "NO") {
      // For YES bets, find opposing NO bets on the same market (same run value)
      if (type === "YES") {
        const noBets = pendingBets.filter(bet => 
          bet.type === "NO" && 
          bet.run === run
        );
        
        if (noBets.length > 0) {
          // Check if there's an exact matching NO bet that should be cancelled
          const exactMatchNoBet = noBets.find(bet => 
            Math.abs(parseFloat(bet.stake) - parseFloat(stake)) < 0.01
          );
          
          if (exactMatchNoBet) {
            // If there's an exact match, cancel the NO bet and don't place this YES bet
            shouldCancelBet = true;
            betToCancel = exactMatchNoBet;
            console.log(`Found exact matching NO bet to cancel: ${betToCancel._id}`);
          } else {
            // Calculate total NO bet liabilities (stake × odds)
            const totalNoLiability = noBets.reduce((total, bet) => 
              total + (parseFloat(bet.stake) * parseFloat(bet.odds)), 0
            );
            
            // Calculate YES bet liability (stake amount)
            const yesLiability = parseFloat(stake);
            
            // Calculate net exposure - the absolute difference between YES liability and NO liability
            if (yesLiability <= totalNoLiability) {
              // If YES liability is less than or equal to total NO liability, we can reduce exposure
              amountToReturnToWallet = Math.min(totalNoLiability - yesLiability, totalNoLiability);
              exposureToAdd = 0; // No additional exposure needed
              console.log(`YES bet with opposing NO bets. YES liability: ${yesLiability}, NO liability: ${totalNoLiability}`);
              console.log(`Fully hedged. Amount to return: ${amountToReturnToWallet}`);
            } else {
              // If YES liability is greater than total NO liability, only add the difference to exposure
              exposureToAdd = yesLiability - totalNoLiability;
              console.log(`YES bet with opposing NO bets. YES liability: ${yesLiability}, NO liability: ${totalNoLiability}`);
              console.log(`Partially hedged. Net exposure: ${exposureToAdd}`);
            }
          }
        } else {
          // No opposing NO bets, use full YES stake as exposure
          exposureToAdd = parseFloat(stake);
          console.log(`YES bet with no opposing NO bets. Full exposure: ${exposureToAdd}`);
        }
      } 
      // For NO bets, find opposing YES bets on the same market (same run value)
      else if (type === "NO") {
        const yesBets = pendingBets.filter(bet => 
          bet.type === "YES" && 
          bet.run === run
        );
        
        if (yesBets.length > 0) {
          // Check if there's an exact matching YES bet that should be cancelled
          // For NO bets, we match based on stake amount directly
          const exactMatchYesBet = yesBets.find(bet => 
            Math.abs(parseFloat(bet.stake) - parseFloat(stake)) < 0.01
          );
          
          if (exactMatchYesBet) {
            // If there's an exact match, cancel the YES bet and don't place this NO bet
            shouldCancelBet = true;
            betToCancel = exactMatchYesBet;
            console.log(`Found exact matching YES bet to cancel: ${betToCancel._id}`);
            } else {
            // Calculate total YES bet stakes
            const totalYesStakes = yesBets.reduce((total, bet) => 
              total + parseFloat(bet.stake), 0
            );
            
            // Calculate NO bet liability (stake × odds)
            const noLiability = (parseFloat(stake) * parseFloat(odds)) / 100;
            
            // Calculate net exposure - the absolute difference between NO liability and YES stakes
            if (noLiability <= totalYesStakes) {
              // If NO liability is less than or equal to total YES stakes, we can reduce exposure
              amountToReturnToWallet = Math.min(totalYesStakes - noLiability, totalYesStakes);
              exposureToAdd = 0; // No additional exposure needed
              console.log(`NO bet with opposing YES bets. NO liability: ${noLiability}, YES stakes: ${totalYesStakes}`);
              console.log(`Fully hedged. Amount to return: ${amountToReturnToWallet}`);
            } else {
              // If NO liability is greater than total YES stakes, only add the difference to exposure
              exposureToAdd = noLiability - totalYesStakes;
              console.log(`NO bet with opposing YES bets. NO liability: ${noLiability}, YES stakes: ${totalYesStakes}`);
              console.log(`Partially hedged. Net exposure: ${exposureToAdd}`);
            }
          }
        } else {
          // No opposing YES bets, use full NO liability as exposure
          exposureToAdd = (parseFloat(stake) * parseFloat(odds)) / 100;
          console.log(`NO bet with no opposing YES bets. Full exposure: ${exposureToAdd}`);
        }
      }
    }

    // If we found a bet to cancel, cancel it and don't place this bet
    if (shouldCancelBet && betToCancel) {
      // Update the bet status to "Cancelled"
      await Bet2.findByIdAndUpdate(betToCancel._id, { status: "Cancelled" });
      
      // Return the amount to the user's wallet
      if (betToCancel.type === "Khaai" || betToCancel.type === "khaai") {
        // For Khaai bets, return the liability
        const amountToReturn = (parseFloat(betToCancel.odds) * parseFloat(betToCancel.stake)) / 100;
        
        // Update the correct wallet field based on which one exists
        if (userWallet.walletBalance !== undefined) {
          userWallet.walletBalance += amountToReturn;
        } else if (userWallet.balance !== undefined) {
          userWallet.balance += amountToReturn;
        }
      } else if (betToCancel.type === "Lgaai") {
        // For Lgaai bets, return the stake
        const amountToReturn = parseFloat(betToCancel.stake);
        
        // Update the correct wallet field based on which one exists
        if (userWallet.walletBalance !== undefined) {
          userWallet.walletBalance += amountToReturn;
        } else if (userWallet.balance !== undefined) {
          userWallet.balance += amountToReturn;
        }
      } else if (betToCancel.type === "YES") {
        // For YES bets, return the stake
        const amountToReturn = parseFloat(betToCancel.stake);
        
        // Update the correct wallet field based on which one exists
        if (userWallet.walletBalance !== undefined) {
          userWallet.walletBalance += amountToReturn;
        } else if (userWallet.balance !== undefined) {
          userWallet.balance += amountToReturn;
        }
      } else if (betToCancel.type === "NO") {
        // For NO bets, return the liability (stake × odds)
        const amountToReturn = (parseFloat(betToCancel.stake) * parseFloat(betToCancel.odds)) / 100;
        
        // Update the correct wallet field based on which one exists
        if (userWallet.walletBalance !== undefined) {
          userWallet.walletBalance += amountToReturn;
        } else if (userWallet.balance !== undefined) {
          userWallet.balance += amountToReturn;
        }
      }
      
      // Save the updated wallet
          await userWallet.save();
          
      // Return success response
      return res.json({
            success: true,
        message: "Bet cancelled and hedged successfully",
        walletBalance: userWallet.walletBalance !== undefined ? userWallet.walletBalance : userWallet.balance,
        exposureBalance: userWallet.exposureBalance || 0
      });
    }
    
    // Deduct the amount from the user's wallet
    if (userWallet.walletBalance !== undefined) {
      userWallet.walletBalance -= amountToDeduct;
    } else if (userWallet.balance !== undefined) {
      userWallet.balance -= amountToDeduct;
    }
    
    // Add to exposure balance
    if (exposureToAdd > 0) {
      userWallet.exposureBalance = (userWallet.exposureBalance || 0) + exposureToAdd;
    }
    
    // Return any amount to the wallet if hedging occurred
    if (amountToReturnToWallet > 0) {
      if (userWallet.walletBalance !== undefined) {
        userWallet.walletBalance += amountToReturnToWallet;
      } else if (userWallet.balance !== undefined) {
        userWallet.balance += amountToReturnToWallet;
      }
    }
    
    // Save the updated wallet
    await userWallet.save();
    
    // Create the new bet
    const newBet = new Bet2({
      user: userId, 
      label,
      odds,
      oddsYes: oddsYes || undefined,
      run,
      stake,
      profit: calculatedProfit,
      type,
      match,
      status: "Pending"
    });

    // Double-check profit calculation for YES bets to ensure it's correct
    if (type === "YES") {
      // Force the correct calculation for YES bets: (stake * odds) / 100
      const expectedProfit = (parseFloat(stake) * (oddsYes ? parseFloat(oddsYes) : parseFloat(odds))) / 100;
      console.log(`YES bet profit check - Original: ${calculatedProfit}, Corrected: ${expectedProfit}`);
      // Always use the correctly calculated value
      newBet.profit = expectedProfit;
    }

    // Save the new bet
    await newBet.save();
    
    // Emit socket event for real-time updates
    betSocketController.emitBetUpdate(newBet);
    
    // Return success response
    res.json({
      success: true,
      message: "Bet placed successfully",
      bet: newBet,
      walletBalance: userWallet.walletBalance !== undefined ? userWallet.walletBalance : userWallet.balance,
      exposureBalance: userWallet.exposureBalance || 0,
      netExposureAdded: exposureToAdd,
      amountReturnedToWallet: amountToReturnToWallet
    });
  } catch (error) {
    console.error("Error placing bet:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
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
}



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
   

    // Fetch all bets with required fields
    const allBets = await Bet2.find().select("label odds stake profit type createdAt result match");

    console.log("Fetched Bets:", allBets.length);
    
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
  try {
      const { userId, exposureBalance } = req.body;
      
      // Validate required fields
      if (!userId) {
          console.error("Missing userId in updateExposure request:", req.body);
          return res.status(400).json({ success: false, message: "User ID is required" });
      }
      
      // Ensure exposureBalance is a valid number
      const validExposure = exposureBalance === undefined ? 0 : parseFloat(exposureBalance);
      if (isNaN(validExposure)) {
          console.error(`Invalid exposureBalance value: ${exposureBalance}`);
          return res.status(400).json({ success: false, message: "Exposure balance must be a valid number" });
      }
      
      console.log(`Processing updateExposure for userId: ${userId}, exposureBalance: ${validExposure}`);
      
      // Try to find the user wallet using multiple possible ID fields
      let userWallet = null;
      
      // First try userId field
      userWallet = await User_Wallet.findOne({ userId });
      
      // If not found, try user field
      if (!userWallet) {
          userWallet = await User_Wallet.findOne({ user: userId });
      }
      
      // If still not found, try userNo field
      if (!userWallet) {
          userWallet = await User_Wallet.findOne({ userNo: userId });
      }
      
      // If still not found, try _id field (in case userId is actually the wallet document ID)
      if (!userWallet) {
          try {
              if (mongoose.Types.ObjectId.isValid(userId)) {
                  userWallet = await User_Wallet.findById(userId);
              }
          } catch (idError) {
              console.error("Error trying to find wallet by _id:", idError);
          }
      }
      
      // If still not found, try to find the user first and then get their wallet
      if (!userWallet) {
          try {
              // Find user by any of the possible ID fields
              const user = await User.findOne({
                  $or: [
                      { _id: mongoose.Types.ObjectId.isValid(userId) ? userId : null },
                      { userNo: userId },
                      { userId: userId }
                  ]
              });
              
              if (user) {
                  // Try to find wallet using user's _id
                  userWallet = await User_Wallet.findOne({ user: user._id });
                  
                  // If still not found, create a new wallet for this user
                  if (!userWallet) {
                      console.log(`Creating new wallet for user ${user._id}`);
                      userWallet = new User_Wallet({
                          user: user._id,
                          userId: user._id,
                          balance: 0,
                          exposureBalance: 0
                      });
                  }
              }
          } catch (userError) {
              console.error("Error trying to find user:", userError);
          }
      }
      
      // If wallet still not found, return error
      if (!userWallet) {
          console.error(`User wallet not found for userId: ${userId} after trying all possible fields`);
          return res.status(404).json({ success: false, message: "User wallet not found" });
      }
      
      // Get current exposure balance
      const currentExposure = userWallet.exposureBalance || 0;
      
      // Always update the exposure balance to ensure it persists
      console.log(`Updating exposure for user ${userId}: ${currentExposure} -> ${validExposure}`);
      
      // Calculate the difference in exposure
      const exposureDifference = validExposure - currentExposure;
      
      // Update the exposure balance
      userWallet.exposureBalance = validExposure;
      
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
        const noLiability = (parseFloat(bet.stake) * parseFloat(bet.odds)) / 100;
        
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
    const { match, label, result, type } = req.body;

    if (!match || !result) {
      return res.status(400).json({ success: false, message: "Match and result are required" });
    }

    // Find all pending bets that match the match
    const pendingBets = await Bet2.find({ 
      match: match, 
      status: "Pending",
      $or: [{ type: "Lgaai" }, { type: "Khaai" }, { type: "khaai" }]
    });

    if (pendingBets.length === 0) {
      return res.status(404).json({ success: false, message: "No pending bets found for this match" });
    }

    // Process each bet
    let processedCount = 0;
    let errorCount = 0;

    for (const bet of pendingBets) {
      try {
        // Find user wallet
        const userWallet = await User_Wallet.findOne({ user: bet.user });
        
        if (!userWallet) {
          console.error(`Wallet not found for user ${bet.user}`);
          errorCount++;
          continue;
        }
        
        // Handle different result types
        if (type === "cancel") {
          // For cancelled bets, return the stake to the user
          if (bet.type === "Lgaai") {
            // For Lgaai bets, return the stake
            userWallet.balance += parseFloat(bet.stake);
          } else if (bet.type === "Khaai" || bet.type === "khaai") {
            // For Khaai bets, return the liability
            userWallet.balance += (parseFloat(bet.odds) * parseFloat(bet.stake)) / 100;
          }
          
          // Update bet status to "Cancelled"
          bet.status = "Cancelled";
          bet.result = "Cancelled";
          
          // Update exposure balance
          if (userWallet.exposureBalance !== undefined) {
            // Calculate amount to release from exposure
            let exposureToRelease = 0;
            if (bet.type === "Lgaai") {
              exposureToRelease = parseFloat(bet.stake);
            } else if (bet.type === "Khaai" || bet.type === "khaai") {
              exposureToRelease = (parseFloat(bet.odds) * parseFloat(bet.stake)) / 100;
            }
            
            userWallet.exposureBalance = Math.max(0, userWallet.exposureBalance - exposureToRelease);
          }
        } 
        else if (type === "win") {
          // Check if this bet's label matches the winning result
          if (bet.label === result) {
            // This bet wins
            if (bet.type === "Lgaai") {
              // For Lgaai (Back) bets, return stake + profit
              userWallet.balance += parseFloat(bet.stake) + parseFloat(bet.profit);
              bet.status = "Won";
            } else if (bet.type === "Khaai" || bet.type === "khaai") {
              // For Khaai (Lay) bets, this is a loss
              bet.status = "Lost";
            }
          } else {
            // This bet loses
            if (bet.type === "Lgaai") {
              // For Lgaai (Back) bets, this is a loss
              bet.status = "Lost";
            } else if (bet.type === "Khaai" || bet.type === "khaai") {
              // For Khaai (Lay) bets, return stake (profit)
              userWallet.balance += parseFloat(bet.profit);
              bet.status = "Won";
            }
          }
          
          // Set the result
          bet.result = result;
          
          // Update exposure balance
          if (userWallet.exposureBalance !== undefined) {
            // Calculate amount to release from exposure
            let exposureToRelease = 0;
            if (bet.type === "Lgaai") {
              exposureToRelease = parseFloat(bet.stake);
            } else if (bet.type === "Khaai" || bet.type === "khaai") {
              exposureToRelease = (parseFloat(bet.odds) * parseFloat(bet.stake)) / 100;
            }
            
            userWallet.exposureBalance = Math.max(0, userWallet.exposureBalance - exposureToRelease);
          }
        }
        
        // Save changes
        await bet.save();
        await userWallet.save();
        
        // Emit socket event for the updated bet
        await betSocketController.emitBetUpdate(bet);
        
        processedCount++;
      } catch (error) {
        console.error(`Error processing bet ${bet._id}:`, error);
        errorCount++;
      }
    }
    
    // Emit an update for all user bets to refresh the list
    const uniqueUserIds = [...new Set(pendingBets.map(bet => bet.user))];
    for (const userId of uniqueUserIds) {
      await betSocketController.emitBetsUpdate(userId);
    }

    res.json({ 
      success: true, 
      message: `Result updated successfully. Processed ${processedCount} bets with ${errorCount} errors.` 
    });
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

    // Find all pending bets that match the market and match
    const pendingBets = await Bet2.find({ 
      match: match,
      label: market,
      status: "Pending",
      $or: [{ type: "YES" }, { type: "NO" }]
    });

    if (pendingBets.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "No pending fancy bets found for this market" 
      });
    }

    // Group bets by user to handle net profit/loss calculation
    const betsByUser = {};
    pendingBets.forEach(bet => {
      if (!betsByUser[bet.user]) {
        betsByUser[bet.user] = [];
      }
      betsByUser[bet.user].push(bet);
    });

    // Process each user's bets
    let processedCount = 0;
    let errorCount = 0;

    for (const userId in betsByUser) {
      try {
        const userBets = betsByUser[userId];
        
        // Find user wallet
        const userWallet = await User_Wallet.findOne({ user: userId });
        
        if (!userWallet) {
          console.error(`Wallet not found for user ${userId}`);
          errorCount += userBets.length;
          continue;
        }
        
        // Handle different result types
        if (type === "cancel") {
          // For cancelled bets, return the stake to the user
          for (const bet of userBets) {
            if (bet.type === "YES") {
              // For YES bets, return the stake
              userWallet.balance += parseFloat(bet.stake);
            } else if (bet.type === "NO") {
              // For NO bets, return the liability (stake × odds)
              userWallet.balance += (parseFloat(bet.stake) * parseFloat(bet.odds)) / 100;
            }
            
            // Update bet status to "Cancelled"
            bet.status = "Cancelled";
            bet.result = "Cancelled";
            
            
            // Update exposure balance
            if (userWallet.exposureBalance !== undefined) {
              // Calculate amount to release from exposure
              let exposureToRelease = 0;
              if (bet.type === "YES") {
                exposureToRelease = parseFloat(bet.stake);
              } else if (bet.type === "NO") {
                exposureToRelease = (parseFloat(bet.stake) * parseFloat(bet.odds)) / 100;
              }
              
              userWallet.exposureBalance = Math.max(0, userWallet.exposureBalance - exposureToRelease);
            }
            
            // Save bet changes
            await bet.save();
            
            // Emit socket event for the updated bet
            await betSocketController.emitBetUpdate(bet);
            
            processedCount++;
          }
        } 
        else {
          const resultValue = parseFloat(result);
          
          // Calculate net profit/loss for this user
          let netProfit = 0;
          let totalExposureToRelease = 0;
          
          // First, determine the outcome of each bet
          for (const bet of userBets) {
            const betRunValue = parseFloat(bet.run);
            
            // For YES bets
            if (bet.type === "YES") {
              // YES bet wins if the actual result equals the bet run value
              if (resultValue === betRunValue) {
                // Calculate profit using oddsYes if available, otherwise use odds
                const oddsToUse = bet.oddsYes ? parseFloat(bet.oddsYes) : parseFloat(bet.odds);
                const calculatedProfit = (parseFloat(bet.stake) * oddsToUse) / 100;
                
                // Add profit to net profit
                netProfit += calculatedProfit;
                bet.status = "Won";
                
                console.log(`YES bet won: Stake=${bet.stake}, OddsYes=${oddsToUse}, Profit=${calculatedProfit}`);
              } else {
                // Bet lost, stake is already deducted
                bet.status = "Lost";
                console.log(`YES bet lost: Stake=${bet.stake}, Run=${bet.run}, Result=${resultValue}`);
              }
              
              // Add stake to exposure to release
              totalExposureToRelease += parseFloat(bet.stake);
            } 
            // For NO bets
            else if (bet.type === "NO") {
              // NO bet wins if the actual result does NOT equal the bet run value
              if (resultValue !== betRunValue) {
                // Add profit to net profit (for NO bets, profit is the stake)
                const calculatedProfit = parseFloat(bet.stake);
                netProfit += calculatedProfit;
                bet.status = "Won";
                
                console.log(`NO bet won: Stake=${bet.stake}, Profit=${calculatedProfit}`);
              } else {
                // Bet lost, liability is already deducted
                bet.status = "Lost";
                console.log(`NO bet lost: Stake=${bet.stake}, Run=${bet.run}, Result=${resultValue}`);
              }
              
              // Add liability to exposure to release
              totalExposureToRelease += (parseFloat(bet.stake) * parseFloat(bet.odds)) / 100;
            }
            
            // Set the result
            bet.result = result.toString();
            
            // Save bet changes
            await bet.save();
            
            // Emit socket event for the updated bet
            await betSocketController.emitBetUpdate(bet);
            
            processedCount++;
          }
          
          // Update user wallet with net profit/loss
          if (netProfit > 0) {
            // Add net profit to wallet
            userWallet.balance += netProfit;
            console.log(`User ${userId} won ${netProfit} on fancy market ${market}`);
          }
          
          // Update exposure balance
          if (userWallet.exposureBalance !== undefined) {
            userWallet.exposureBalance = Math.max(0, userWallet.exposureBalance - totalExposureToRelease);
            console.log(`Released ${totalExposureToRelease} from exposure for user ${userId}`);
          }
        }
        
        // Save wallet changes
        await userWallet.save();
        
        // Emit an update for all user bets to refresh the list
        await betSocketController.emitBetsUpdate(userId);
      } catch (error) {
        console.error(`Error processing bets for user ${userId}:`, error);
        errorCount += betsByUser[userId].length;
      }
    }

    // Mark the fancy market as finished
    if (processedCount > 0 && errorCount === 0) {
      // Create or update a fancy market status record
      try {
        // Check if we have a FancyMarketStatus model, if not, create a simple one
        const FancyMarketStatus = mongoose.models.FancyMarketStatus || 
          mongoose.model('FancyMarketStatus', new mongoose.Schema({
            match: String,
            market: String,
            status: String,
            result: String,
            updatedAt: Date
          }));
        
        // Update or create fancy market status
        await FancyMarketStatus.findOneAndUpdate(
          { match: match, market: market },
          { 
            status: 'finished', 
            result: type === 'cancel' ? 'cancelled' : result,
            updatedAt: new Date()
          },
          { upsert: true, new: true }
        );
        
        console.log(`Fancy market ${market} in match ${match} marked as finished with result ${result}`);
      } catch (marketError) {
        console.error(`Error updating fancy market status: ${marketError}`);
      }
    }

    res.json({ 
      success: true, 
      message: `Fancy result updated successfully. Processed ${processedCount} bets with ${errorCount} errors.` 
    });
  } catch (error) {
    console.error("Error updating fancy result:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Revert a declared result
exports.revertResult = async (req, res) => {
  try {
    const { match, market, type } = req.body;

    if (!match || !type) {
      return res.status(400).json({ success: false, message: "Match and type are required" });
    }

    // Find bets to revert based on type
    let betsToRevert;
    if (type === "match") {
      // For match odds, find all non-pending bets for the match
      betsToRevert = await Bet2.find({ 
        match: match,
        status: { $ne: "Pending" },
        $or: [{ type: "Lgaai" }, { type: "Khaai" }, { type: "khaai" }]
      });
    } else if (type === "fancy") {
      // For fancy markets, find all non-pending bets for the specific market
      if (!market) {
        return res.status(400).json({ success: false, message: "Market is required for fancy revert" });
      }
      
      betsToRevert = await Bet2.find({ 
        match: match,
        label: market,
        status: { $ne: "Pending" },
        $or: [{ type: "YES" }, { type: "NO" }]
      });
    } else {
      return res.status(400).json({ success: false, message: "Invalid type" });
    }

    if (betsToRevert.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "No settled bets found to revert" 
      });
    }

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
          } else if (bet.type === "Khaai" || bet.type === "khaai") {
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
    // Find all distinct matches with pending bets
    const matches = await Bet2.distinct("match", { status: "Pending" });
    
    // Get match status information if available
    let matchesWithStatus = [];
    
    try {
      // Check if we have a MatchStatus model
      const MatchStatus = mongoose.models.MatchStatus || 
        mongoose.model('MatchStatus', new mongoose.Schema({
          match: String,
          status: String,
          result: String,
          updatedAt: Date
        }));
      
      // Get status for all matches
      const matchStatuses = await MatchStatus.find({ match: { $in: matches } });
      
      // Create a map of match to status
      const statusMap = {};
      matchStatuses.forEach(status => {
        statusMap[status.match] = status.status;
      });
      
      // Create the response with status information
      matchesWithStatus = matches.map(match => ({
        match,
        status: statusMap[match] || 'live' // Default to 'live' if no status found
      }));
    } catch (error) {
      // If there's an error or the model doesn't exist, just return the matches
      console.error("Error getting match statuses:", error);
      matchesWithStatus = matches.map(match => ({ match, status: 'live' }));
    }
    
    // Sort matches - live matches first, then finished
    matchesWithStatus.sort((a, b) => {
      if (a.status === 'live' && b.status !== 'live') return -1;
      if (a.status !== 'live' && b.status === 'live') return 1;
      return a.match.localeCompare(b.match);
    });
    
    res.json({ 
      success: true, 
      matches: matchesWithStatus
    });
  } catch (error) {
    console.error("Error fetching matches:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all fancy markets for a specific match
exports.getFancyMarketsForMatch = async (req, res) => {
  try {
    const { match } = req.params;
    
    if (!match) {
      return res.status(400).json({ success: false, message: "Match is required" });
    }
    
    // Find all distinct fancy markets (labels) for the match with pending YES/NO bets
    const markets = await Bet2.distinct("label", { 
      match,
      status: "Pending",
      $or: [{ type: "YES" }, { type: "NO" }]
    });
    
    // Get fancy market status information if available
    let marketsWithStatus = [];
    
    try {
      // Check if we have a FancyMarketStatus model
      const FancyMarketStatus = mongoose.models.FancyMarketStatus || 
        mongoose.model('FancyMarketStatus', new mongoose.Schema({
          match: String,
          market: String,
          status: String,
          result: String,
          updatedAt: Date
        }));
      
      // Get status for all markets in this match
      const marketStatuses = await FancyMarketStatus.find({ 
        match: match,
        market: { $in: markets }
      });
      
      // Create a map of market to status
      const statusMap = {};
      marketStatuses.forEach(status => {
        statusMap[status.market] = status.status;
      });
      
      // Create the response with status information
      marketsWithStatus = markets.map(market => ({
        market,
        status: statusMap[market] || 'live' // Default to 'live' if no status found
      }));
    } catch (error) {
      // If there's an error or the model doesn't exist, just return the markets
      console.error("Error getting fancy market statuses:", error);
      marketsWithStatus = markets.map(market => ({ market, status: 'live' }));
    }
    
    // Sort markets - live markets first, then finished
    marketsWithStatus.sort((a, b) => {
      if (a.status === 'live' && b.status !== 'live') return -1;
      if (a.status !== 'live' && b.status === 'live') return 1;
      return a.market.localeCompare(b.market);
    });
    
    res.json({ 
      success: true, 
      markets: marketsWithStatus
    });
  } catch (error) {
    console.error("Error fetching fancy markets:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

