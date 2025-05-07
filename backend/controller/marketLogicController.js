// // const MarketLK = require('../models/marketLogicModel');
// // const User = require('../models/UserSignUp');
// // const User_Wallet = require('../models/Wallet');
// // // Place a new bet
// // const placeBet = async (req, res) => {
// //   console.log(req.body);
// //   try {
// //     const { userId, label, odds, stake, teamAProfit, teamBProfit, balance, exposure, time, type, match } = req.body;
// //     if (balance < 0) {
// //       return res.status(400).json({ success: false, message: 'You are not able to place bet' });
// //     } else {
// //       // Validate all fields
// //       if (!userId || !label || !odds || !stake || !balance || !exposure || !time || !type || !match) {
// //         return res.status(400).json({ success: false, message: 'All fields are required.' });
// //       }

// //       // Parse numerical values
// //       const parsedOdds = parseFloat(odds);
// //       const parsedStake = parseFloat(stake);
// //       const parsedTeamAProfit = parseFloat(teamAProfit || 0);
// //       const parsedTeamBProfit = parseFloat(teamBProfit || 0);
// //       const parsedBalance = parseFloat(balance);
// //       const parsedExposure = parseFloat(exposure);

// //       // Validate numerical values
// //       if (isNaN(parsedOdds) || isNaN(parsedStake) || isNaN(parsedBalance) || isNaN(parsedExposure)) {
// //         return res.status(400).json({ success: false, message: 'Invalid numerical values provided.' });
// //       }

// //       // Check if user exists
// //       const user = await User.findById(userId);
// //       if (!user) {
// //         return res.status(404).json({ success: false, message: 'User not found.' });
// //       }

// //       await MarketLK.updateMany(
// //         { user: userId, match, current_status: "Pending" },
// //         { $set: { current_status: "Complete" } }
// //       );

// //       // Create and save the bet
// //       const newBet = new MarketLK({
// //         user: userId,
// //         label,
// //         odds: parsedOdds,
// //         stake: parsedStake,
// //         teamAProfit: parsedTeamAProfit,
// //         teamBProfit: parsedTeamBProfit,
// //         balance: parsedBalance,
// //         exposure: parsedExposure,
// //         time,
// //         type,
// //         match
// //       });
// //       await newBet.save();

// //       const wallet = await User_Wallet.findOne({ user: userId });

// //       if (!wallet) {
// //         return res.status(404).json({ success: false, message: 'Wallet not found.' });
// //       }

// //       wallet.exposureBalance = parsedExposure;
// //       wallet.balance = parsedBalance;
// //       wallet.teamAProfit = parsedTeamAProfit;
// //       wallet.teamBProfit = parsedTeamBProfit;

// //       await wallet.save();
// //       res.status(201).json({ success: true, message: 'Bet placed successfully!', bet: newBet });
// //     }
// //   } catch (error) {
// //     console.error('Error placing bet:', error);
// //     res.status(500).json({ success: false, message: 'Internal server error' });
// //   }
// // };

// // const updateResult = async (req, res) => {
// //   try {
// //     const { matchName, result } = req.body;

// //     // Fetch bets for this match
// //     const marketOddsData = await MarketLK.find({ label: matchName }).sort({ createdAt: 1 }); // Sort by creation time

// //     if (!marketOddsData.length) {
// //       return res.status(404).json({ success: false, message: "No market data found for this match" });
// //     }

// //     const userWalletUpdates = {};
// //     const userLastBets = {};

// //     // First, find the last bet for each user
// //     marketOddsData.forEach(bet => {
// //       const userId = bet.user.toString();
// //       if (!userLastBets[userId] || bet.createdAt > userLastBets[userId].createdAt) {
// //         userLastBets[userId] = bet;
// //       }
// //     });

// //     // Process only the last bets
// //     for (const userId in userLastBets) {
// //       const bet = userLastBets[userId];
      
// //       bet.result = result; // Update result for each bet
// //       await bet.save(); // Save updated bet

// //       // Fetch user wallet if not already retrieved
// //       if (!userWalletUpdates[userId]) {
// //         const userWallet = await User_Wallet.findOne({ user: userId });
// //         if (!userWallet) continue;
// //         userWalletUpdates[userId] = userWallet;
// //       }
// //       const userWallet = userWalletUpdates[userId];

// //       // Convert values safely (default to 0 if undefined/null)
// //       const exposure = Math.abs(Number(bet.exposure));
// //       const profitA = Number(bet.teamBProfit);
// //       const profitB = Number(bet.teamAProfit);
// //       const profit = profitA > 0 ? profitA : profitB > 0 ? profitB : 0;

// //       // Prevent balance from being set to NaN
// //       if (isNaN(exposure) || isNaN(profitA)) {
// //         console.error(`Invalid number detected: exposure=${bet.exposure}, profitA=${bet.profitA}`);
// //         continue; // Skip this bet to prevent errors
// //       }

// //       // Apply logic based on match result
// //       if (result === "Winner") {
// //         userWallet.balance += (profit + exposure);
// //         if (userWallet.exposureBalance > 0) {
// //           userWallet.exposureBalance -= exposure;
// //         }
// //       } else if (result === "Draw") {
// //         userWallet.balance += exposure;
// //         if (userWallet.exposureBalance > 0) {
// //           userWallet.exposureBalance -= exposure;
// //         }
// //       } else {
// //         if (userWallet.exposureBalance > 0) {
// //           userWallet.exposureBalance -= exposure;
// //         }
// //       }
// //     }

// //     // Save all updated wallets in one go
// //     await Promise.all(Object.values(userWalletUpdates).map((wallet) => wallet.save()));

// //     res.status(200).json({ success: true, message: "Results and wallets updated successfully" });
// //   } catch (error) {
// //     console.error("Error updating result:", error);
// //     res.status(500).json({ success: false, message: "Server Error", error: error.message });
// //   }
// // };



// // const resetAllData = async (req, res) => {
// //   try {
// //     // Fetch all bets
// //     const { oddstype } = req.body
// //     // if (oddstype == "lgaai" || oddstype == "khaai") {
// //       // const allBets = await MarketLK.find({ type: oddstype });
// //       const allBets = await MarketLK.find();

// //       // Dictionary to track user wallet updates
// //       const userWalletUpdates = new Map();

// //       for (let bet of allBets) {
// //         const userId = bet.user.toString();
// //         // Fetch user's wallet only if not already cached
// //         if (!userWalletUpdates.has(userId)) {
// //           const userWallet = await User_Wallet.findOne({ user: userId });
// //           if (userWallet) userWalletUpdates.set(userId, userWallet);
// //         }
// //         const userWallet = userWalletUpdates.get(userId);
// //         if (!userWallet) continue; // Skip if wallet not found

// //         // Add exposure amount back to balance
// //         userWallet.balance += Math.abs(bet.exposure);
// //         // userWallet.exposureBalance -= Math.abs(bet.exposure)
// //         userWallet.exposureBalance = 0
// //         // Reset exposure to 0
// //         bet.exposure = 0;
// //         await bet.save(); // Save the updated bet
// //       }

// //       // Save all updated wallets
// //       for (const wallet of userWalletUpdates.values()) {
// //         await wallet.save();
// //       }

// //       res.status(200).json({ success: true, message: "All data has been reset, exposure added back to balances" });
// //     // }
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ success: false, message: "Server Error", error: error.message });
// //   }
// // };

// // // Get bets by user
// // const getUserBets = async (req, res) => {
// //   try {
// //     const { userId, match } = req.params;
// //     console.log(userId)
// //     const bets = await MarketLK.find({ user: userId , match:match}).sort({ createdAt: -1 });
// //     res.status(200).json({ success: true, bets });
// //   } catch (error) {
// //     console.error('Error fetching bets:', error);
// //     res.status(500).json({ success: false, message: 'Internal server error' });
// //   }
// // };


// // const getAllMatchOddsBets = async (req, res) => {
// //   try {
// //     console.log("ok111")
// //     const { matchname } = req.params
// //     console.log(matchname, "matchname")
// //     const bets = await MarketLK.find({ match: matchname });
// //     console.log(bets)
// //     res.status(200).json({ success: true, bets });
// //   } catch (error) {
// //     console.error('Error fetching bets:', error);
// //     res.status(500).json({ success: false, message: 'Internal server error' });
// //   }
// // };


// // const getUserBetByLabel = async (req, res) => {
// //   try {
// //     const { match } = req.params;
// //     console.log(match, "label");
// //     const bets = await MarketLK.find({ label: match });
// //     res.status(200).json({ success: true, bets });
// //   } catch (error) {
// //     console.error('Error fetching bets:', error);
// //     res.status(500).json({ success: false, message: 'Internal server error' });
// //   }
// // };

// // const getwalletandexposure = async (req, res) => {
// //   const { userId } = req.params;

// //   try {
// //     const wallet = await User_Wallet.findOne({ user: userId });

// //     if (!wallet) {
// //       return res.status(404).json({ error: 'Wallet not found' });
// //     }

// //     res.status(200).json({
// //       balance: wallet.balance || 0,
// //       exposureBalance: wallet.exposureBalance || 0,
// //       teamAProfit: wallet.teamAProfit || 0,
// //       teamBProfit: wallet.teamBProfit || 0
// //     });
// //   } catch (error) {
// //     console.error('Error fetching wallet data:', error);
// //     res.status(500).json({ error: 'Internal server error' });
// //   }
// // };

// // const getUniqueMatchesAndLabels = async (req, res) => {
// //   try {
// //     const uniqueData = await MarketLK.aggregate([
// //       {
// //         $group: {
// //           _id: "$match",
// //           match: { $first: "$match" },
// //           status: { $first: "$status" },
// //           teams: { $addToSet: "$label" }
// //         }
// //       }
// //     ]);

// //     res.status(200).json(uniqueData);
// //   } catch (error) {
// //     console.error('Error fetching unique matches and labels:', error);
// //     res.status(500).json({ error: 'Internal server error' });
// //   }
// // };

// // const ResultDeclaration = require('../models/resultDeclartion');
// // const submitNewDeclaration = async (req, res) => {
// //   const { match, winner, resultType } = req.body;
// //   try {

// //     const bets = await MarketLK.find({ match, current_status: "Pending" });

// //     if (!bets.length) {
// //       return res.status(404).json({ message: "No pending bets found for this match." });
// //     }

// //     for (const bet of bets) {
// //       const userWallet = await User_Wallet.findOne({ user: bet.user });

// //       if (!userWallet) {
// //         console.error(`Wallet not found for user: ${bet.user}`);
// //         continue;
// //       }

// //       // Check conditions and update wallet
// //       if ((bet.match === match && bet.label === winner && resultType == "win")) {
// //         // User wins
// //         if (bet.teamAProfit > 0) {
// //           userWallet.balance += Number(bet.teamAProfit) + Number(userWallet.exposureBalance);
// //           userWallet.exposureBalance = 0;
// //         } else {
// //           userWallet.exposureBalance = 0;
// //         }
// //         // userWallet.balance += bet.teamAProfit;
// //       } else if ((bet.match === match && bet.label === winner && resultType == "loss")) {
// //         // User wins
// //         if (bet.teamBProfit > 0) {
// //           userWallet.balance += Number(bet.teamBProfit) + Number(userWallet.exposureBalance);
// //           userWallet.exposureBalance = 0;
// //         } else {
// //           userWallet.exposureBalance = 0;
// //         }
// //       }

// //       // Adjust exposure and mark bet as completed

// //       bet.current_status = "Complete";

// //       await userWallet.save();
// //       await bet.save();
// //     }


// //     console.log('Received payload:', req.body);

// //     const newDeclaration = new ResultDeclaration(req.body);
// //     await newDeclaration.save();

// //     res.status(200).json({ message: 'Declaration saved successfully' });
// //   } catch (error) {
// //     console.error('Error saving declaration:', error);
// //     res.status(500).json({ error: 'Internal server error' });
// //   }
// // };


// // const fatchrecentresultdeclation = async (req, res) => {
// //   try {
// //     const declarations = await ResultDeclaration.find({});
// //     res.status(200).json(declarations);
// //   } catch (error) {
// //     console.error('Error fetching declarations:', error);
// //     res.status(500).json({ error: 'Internal server error' });
// //   }
// // };

// // module.exports = {getAllMatchOddsBets, placeBet, getUserBets, getwalletandexposure, getUniqueMatchesAndLabels, submitNewDeclaration, fatchrecentresultdeclation, updateResult, resetAllData, getUserBetByLabel };



// const MarketLK = require('../models/marketLogicModel');
// const User = require('../models/UserSignUp');
// const User_Wallet = require('../models/Wallet');
// // Place a new bet
// const placeBet = async (req, res) => {
//   console.log(req.body);
//   try {
//     const { userId, label, odds, stake, teamAProfit, teamBProfit, balance, exposure, time, type, match, teamIndex } = req.body;
//     if (balance < 0) {
//       return res.status(400).json({ success: false, message: 'You are not able to place bet' });
//     } else {
//       // Validate all fields
//       if (!userId || !label || !odds || !stake || !balance || !exposure || !time || !type || !match) {
//         return res.status(400).json({ success: false, message: 'All fields are required.' });
//       }

//       // Parse numerical values
//       const parsedOdds = parseFloat(odds);
//       const parsedStake = parseFloat(stake);
//       const parsedTeamAProfit = parseFloat(teamAProfit || 0);
//       const parsedTeamBProfit = parseFloat(teamBProfit || 0);
//       const parsedBalance = parseFloat(balance);
//       const parsedExposure = parseFloat(exposure);

//       // Validate numerical values
//       if (isNaN(parsedOdds) || isNaN(parsedStake) || isNaN(parsedBalance) || isNaN(parsedExposure)) {
//         return res.status(400).json({ success: false, message: 'Invalid numerical values provided.' });
//       }

//       // Check if user exists
//       const user = await User.findById(userId);
//       if (!user) {
//         return res.status(404).json({ success: false, message: 'User not found.' });
//       }

//       await MarketLK.updateMany(
//         { user: userId, match, current_status: "Pending" },
//         { $set: { current_status: "Complete" } }
//       );

//       // Create and save the bet
//       const newBet = new MarketLK({
//         user: userId,
//         label,
//         odds: parsedOdds,
//         stake: parsedStake,
//         teamAProfit: parsedTeamAProfit,
//         teamBProfit: parsedTeamBProfit,
//         balance: parsedBalance,
//         exposure: parsedExposure,
//         time,
//         type,
//         match,
//         teamIndex
//       });
//       await newBet.save();

//       const wallet = await User_Wallet.findOne({ user: userId });

//       if (!wallet) {
//         return res.status(404).json({ success: false, message: 'Wallet not found.' });
//       }

//       wallet.exposureBalance = parsedExposure;
//       wallet.balance = parsedBalance;
//       wallet.teamAProfit = parsedTeamAProfit;
//       wallet.teamBProfit = parsedTeamBProfit;

//       await wallet.save();
//       res.status(201).json({ success: true, message: 'Bet placed successfully!', bet: newBet });
//     }
//   } catch (error) {
//     console.error('Error placing bet:', error);
//     res.status(500).json({ success: false, message: 'Internal server error' });
//   }
// };

// const updateResult = async (req, res) => {
//   try {
//     const { matchName, result } = req.body;

//     // Fetch bets for this match
//     const marketOddsData = await MarketLK.find({ label: matchName }).sort({ createdAt: 1 }); // Sort by creation time
//     console.log(marketOddsData)
//     if (!marketOddsData.length) {
//       return res.status(404).json({ success: false, message: "No market data found for this match" });
//     }

//     const userWalletUpdates = {};
//     const userLastBets = {};

//     // First, find the last bet for each user
//     marketOddsData.forEach(bet => {
//       const userId = bet.user.toString();
//       if (!userLastBets[userId] || bet.createdAt > userLastBets[userId].createdAt) {
//         userLastBets[userId] = bet;
//       }
//     });

//     // Process only the last bets
//     for (const userId in userLastBets) {
//       const bet = userLastBets[userId];

//       bet.result = result; // Update result for each bet
//       await bet.save(); // Save updated bet

//       // Fetch user wallet if not already retrieved
//       if (!userWalletUpdates[userId]) {
//         const userWallet = await User_Wallet.findOne({ user: userId });
//         if (!userWallet) continue;
//         userWalletUpdates[userId] = userWallet;
//       }
//       const userWallet = userWalletUpdates[userId];

//       // Convert values safely (default to 0 if undefined/null)
//       const exposure = Math.abs(Number(bet.exposure));
//       const profitA = Number(bet.teamBProfit);
//       const profitB = Number(bet.teamAProfit);
//       const profit = profitA > 0 ? profitA : profitB > 0 ? profitB : 0;

//       // Prevent balance from being set to NaN
//       if (isNaN(exposure) || isNaN(profitA)) {
//         console.error(`Invalid number detected: exposure=${bet.exposure}, profitA=${bet.profitA}`);
//         continue; // Skip this bet to prevent errors
//       }

//       // Apply logic based on match result
//       if (result === "Winner") {
//         if (profitA > 0) {
//           userWallet.balance += (profitA + exposure);
//           if (userWallet.exposureBalance > 0) {
//             userWallet.exposureBalance -= exposure;
//           }
//           bet.teamAProfit = 0
//           bet.teamBProfit = 0
//         }
//         else {
//           userWallet.exposureBalance -= exposure;
//         }
//       } else if (result === "Draw") {
//         if (profitA > 0) {
//           userWallet.balance += exposure;
//           if (userWallet.exposureBalance > 0) {
//             userWallet.exposureBalance -= exposure;
//           }
//           bet.teamAProfit = 0
//           bet.teamBProfit = 0
//         } else {
//           userWallet.exposureBalance -= exposure;
//         }

//       } else {
//         if (userWallet.exposureBalance > 0) {
//           userWallet.exposureBalance -= exposure;
//         }
//         bet.teamAProfit = 0
//         bet.teamBProfit = 0
//       }
//     }
//     // Save all updated wallets in one go
//     await Promise.all(Object.values(userWalletUpdates).map((wallet) => wallet.save()));

//     res.status(200).json({ success: true, message: "Results and wallets updated successfully" });
//   } catch (error) {
//     console.error("Error updating result:", error);
//     res.status(500).json({ success: false, message: "Server Error", error: error.message });
//   }
// };



// const resetAllData = async (req, res) => {
//   try {
//     // Fetch all bets
//     const { oddstype } = req.body
//     // if (oddstype == "lgaai" || oddstype == "khaai") {
//     // const allBets = await MarketLK.find({ type: oddstype });
//     const allBets = await MarketLK.find();

//     // Dictionary to track user wallet updates
//     const userWalletUpdates = new Map();

//     for (let bet of allBets) {
//       const userId = bet.user.toString();
//       // Fetch user's wallet only if not already cached
//       if (!userWalletUpdates.has(userId)) {
//         const userWallet = await User_Wallet.findOne({ user: userId });
//         if (userWallet) userWalletUpdates.set(userId, userWallet);
//       }
//       const userWallet = userWalletUpdates.get(userId);
//       if (!userWallet) continue; // Skip if wallet not found

//       // Add exposure amount back to balance
//       userWallet.balance += Math.abs(bet.exposure);
//       // userWallet.exposureBalance -= Math.abs(bet.exposure)
//       userWallet.exposureBalance = 0
//       // Reset exposure to 0
//       bet.exposure = 0;
//       await bet.save(); // Save the updated bet
//     }

//     // Save all updated wallets
//     for (const wallet of userWalletUpdates.values()) {
//       await wallet.save();
//     }

//     res.status(200).json({ success: true, message: "All data has been reset, exposure added back to balances" });
//     // }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Server Error", error: error.message });
//   }
// };


// // Get bets by user
// const getUserBets = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     console.log(userId)
//     const bets = await MarketLK.find({ user: userId }).sort({ createdAt: -1 });
//     res.status(200).json({ success: true, bets });
//   } catch (error) {
//     console.error('Error fetching bets:', error);
//     res.status(500).json({ success: false, message: 'Internal server error' });
//   }
// };
// const getUserMatchBetsBets = async (req, res) => {
//   try {
//     const { userId, match } = req.params;
//     // console.log(userId)
//     const bets = await MarketLK.find({ user: userId, match: match }).sort({ createdAt: -1 });
//     res.status(200).json({ success: true, bets });
//   } catch (error) {
//     console.error('Error fetching bets:', error);
//     res.status(500).json({ success: false, message: 'Internal server error' });
//   }
// };
// const getAllMatchOddsBets = async (req, res) => {
//   try {
//     console.log("ok111")
//     const { matchname } = req.params
//     console.log(matchname, "matchname")
//     const bets = await MarketLK.find({ match: matchname });
//     console.log(bets)
//     res.status(200).json({ success: true, bets });
//   } catch (error) {
//     console.error('Error fetching bets:', error);
//     res.status(500).json({ success: false, message: 'Internal server error' });
//   }
// };

// const getUserBetByLabel = async (req, res) => {
//   try {
//     const { match } = req.params;
//     console.log(match, "label");
//     const bets = await MarketLK.find({ label: match });
//     res.status(200).json({ success: true, bets });
//   } catch (error) {
//     console.error('Error fetching bets:', error);
//     res.status(500).json({ success: false, message: 'Internal server error' });
//   }
// };

// const getwalletandexposure = async (req, res) => {
//   const { userId } = req.params;

//   try {
//     const wallet = await User_Wallet.findOne({ user: userId });

//     if (!wallet) {
//       return res.status(404).json({ error: 'Wallet not found' });
//     }

//     res.status(200).json({
//       balance: wallet.balance || 0,
//       exposureBalance: wallet.exposureBalance || 0,
//       teamAProfit: wallet.teamAProfit || 0,
//       teamBProfit: wallet.teamBProfit || 0
//     });
//   } catch (error) {
//     console.error('Error fetching wallet data:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// const getUniqueMatchesAndLabels = async (req, res) => {
//   try {
//     const uniqueData = await MarketLK.aggregate([
//       {
//         $group: {
//           _id: "$match",
//           match: { $first: "$match" },
//           status: { $first: "$status" },
//           teams: { $addToSet: "$label" }
//         }
//       }
//     ]);

//     res.status(200).json(uniqueData);
//   } catch (error) {
//     console.error('Error fetching unique matches and labels:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// const ResultDeclaration = require('../models/resultDeclartion');
// const submitNewDeclaration = async (req, res) => {
//   console.log(req.body, "okkkk")
//   const { match, winner, resultType } = req.body;

//   try {

//     const bets = await MarketLK.find({ match, current_status: "Pending" });
//     if (!bets.length) {
//       return res.status(404).json({ message: "No pending bets found for this match." });
//     }

//     for (const bet of bets) {
//       const userWallet = await User_Wallet.findOne({ user: bet.user });

//       if (!userWallet) {
//         console.error(`Wallet not found for user: ${bet.user}`);
//         continue;
//       }
//       const profitA = bet.teamIndex === 0 ? bet.teamAProfit : bet.teamBProfit
//       const profitB = bet.teamIndex === 1 ? bet.teamAProfit : bet.teamBProfit
//       console.log(profitA, profitB)
//       // Check conditions and update wallet
//       if ((bet.match === match && bet.label === winner && resultType == "Winner")) {
//         // User wins
//         if (profitA > 0&&profitB<0) {
//           userWallet.balance += Number(profitA) + Number(userWallet.exposureBalance);
//           userWallet.exposureBalance -= Math.abs(Number(profitB));
//         }
//         else {
//           // userWallet.balance += Number(teamBProfit) + Number(userWallet.exposureBalance); 
//           userWallet.exposureBalance -= Math.abs(Number(profitB));
//         }
//         // userWallet.balance += bet.teamAProfit;
//       } else if ((bet.match === match && bet.label === winner && resultType == "loss")) {
//         // User wins
//         if (profitB > 0&&profitA<0) {
//           userWallet.balance += Number(profitB) + Number(userWallet.exposureBalance);
//           userWallet.exposureBalance -= Number(profitA);
//         } else {
//           userWallet.exposureBalance -= Number(profitA);
//         }
//       } else if ((bet.match === match && bet.label === winner && resultType == "Draw")) {
//         userWallet.balance += Number(bet.exposure)
//         userWallet.exposureBalance = 0;
//       }
//       // Adjust exposure and mark bet as completed

//       bet.current_status = "Complete";
//       userWallet.teamAProfit = 0;
//       userWallet.teamBProfit = 0;

//       await userWallet.save();
//       await bet.save();
//     }


//     console.log('Received payload:', req.body);

//     const newDeclaration = new ResultDeclaration(req.body);
//     await newDeclaration.save();

//     res.status(200).json({ message: 'Declaration saved successfully' });
//   } catch (error) {
//     console.error('Error saving declaration:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };


// const fatchrecentresultdeclation = async (req, res) => {
//   try {
//     const declarations = await ResultDeclaration.find({});
//     res.status(200).json(declarations);
//   } catch (error) {
//     console.error('Error fetching declarations:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// module.exports = { placeBet, getUserBets, getwalletandexposure, getUniqueMatchesAndLabels, submitNewDeclaration, fatchrecentresultdeclation, updateResult, resetAllData, getUserBetByLabel, getAllMatchOddsBets, getUserMatchBetsBets };


















const MarketLK = require('../models/marketLogicModel');
const User = require('../models/UserSignUp');
const User_Wallet = require('../models/Wallet');
// Place a new bet
const placeBet = async (req, res) => {
  console.log(req.body);
  try {
    const { userId, label, odds, stake, teamAProfit, teamBProfit, balance, exposure, time, type, match, teamIndex } = req.body;
    if (balance < 0) {
      return res.status(400).json({ success: false, message: 'You are not able to place bet' });
    } else {
      // Validate all fields
      if (!userId || !label || !odds || !stake || !balance || !exposure || !time || !type || !match) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
      }

      // Parse numerical values
      const parsedOdds = parseFloat(odds);
      const parsedStake = parseFloat(stake);
      const parsedTeamAProfit = parseFloat(teamAProfit || 0);
      const parsedTeamBProfit = parseFloat(teamBProfit || 0);
      const parsedBalance = parseFloat(balance);
      const parsedExposure = parseFloat(exposure);

      // Validate numerical values
      if (isNaN(parsedOdds) || isNaN(parsedStake) || isNaN(parsedBalance) || isNaN(parsedExposure)) {
        return res.status(400).json({ success: false, message: 'Invalid numerical values provided.' });
      }

      // Check if user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      await MarketLK.updateMany(
        { user: userId, match, current_status: "Pending" },
        { $set: { current_status: "Complete" } }
      );

      // Create and save the bet
      const newBet = new MarketLK({
        user: userId,
        label,
        odds: parsedOdds,
        stake: parsedStake,
        teamAProfit: parsedTeamAProfit,
        teamBProfit: parsedTeamBProfit,
        balance: parsedBalance,
        exposure: parsedExposure,
        time,
        type,
        match,
        teamIndex
      });
      await newBet.save();

      const wallet = await User_Wallet.findOne({ user: userId });

      if (!wallet) {
        return res.status(404).json({ success: false, message: 'Wallet not found.' });
      }

      wallet.exposureBalance = parsedExposure;
      wallet.balance = parsedBalance;
      wallet.teamAProfit = parsedTeamAProfit;
      wallet.teamBProfit = parsedTeamBProfit;

      await wallet.save();
      res.status(201).json({ success: true, message: 'Bet placed successfully!', bet: newBet });
    }
  } catch (error) {
    console.error('Error placing bet:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const updateResult = async (req, res) => {
  try {
    const { matchName, result } = req.body;

    // Fetch bets for this match
    const marketOddsData = await MarketLK.find({ label: matchName }).sort({ createdAt: 1 }); // Sort by creation time
    console.log(marketOddsData ,"updateresult 446 bala")
    if (!marketOddsData.length) {
      return res.status(404).json({ success: false, message: "No market data found for this match" });
    }

    const userWalletUpdates = {};
    const userLastBets = {};

    // First, find the last bet for each user
    marketOddsData.forEach(bet => {
      const userId = bet.user.toString();
      if (!userLastBets[userId] || bet.createdAt > userLastBets[userId].createdAt) {
        userLastBets[userId] = bet;
      }
    });

    // Process only the last bets
    for (const userId in userLastBets) {
      const bet = userLastBets[userId];

      bet.result = result; // Update result for each bet
      await bet.save(); // Save updated bet

      // Fetch user wallet if not already retrieved
      if (!userWalletUpdates[userId]) {
        const userWallet = await User_Wallet.findOne({ user: userId });
        if (!userWallet) continue;
        userWalletUpdates[userId] = userWallet;
      }
      const userWallet = userWalletUpdates[userId];

      // Convert values safely (default to 0 if undefined/null)
      const exposure = Math.abs(Number(bet.exposure));
      const profitA = Number(bet.teamBProfit);
      const profitB = Number(bet.teamAProfit);
      const profit = profitA > 0 ? profitA : profitB > 0 ? profitB : 0;

      // Prevent balance from being set to NaN
      if (isNaN(exposure) || isNaN(profitA)) {
        console.error(`Invalid number detected: exposure=${bet.exposure}, profitA=${bet.profitA}`);
        continue; // Skip this bet to prevent errors
      }

      // Apply logic based on match result
      if (result === "Winner") {
        if (profitA > 0) {
          userWallet.balance += (profitA + exposure);
          if (userWallet.exposureBalance > 0) {
            userWallet.exposureBalance -= exposure;
          }
          bet.teamAProfit = 0
          bet.teamBProfit = 0
        }
        else {
          userWallet.exposureBalance -= exposure;
        }
      } else if (result === "Draw") {
        if (profitA > 0) {
          userWallet.balance += exposure;
          if (userWallet.exposureBalance > 0) {
            userWallet.exposureBalance -= exposure;
          }
          bet.teamAProfit = 0
          bet.teamBProfit = 0
        } else {
          userWallet.exposureBalance -= exposure;
        }

      } else {
        if (userWallet.exposureBalance > 0) {
          userWallet.exposureBalance -= exposure;
        }
        bet.teamAProfit = 0
        bet.teamBProfit = 0
      }
    }
    // Save all updated wallets in one go
    await Promise.all(Object.values(userWalletUpdates).map((wallet) => wallet.save()));

    res.status(200).json({ success: true, message: "Results and wallets updated successfully" });
  } catch (error) {
    console.error("Error updating result:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};



const resetAllData = async (req, res) => {
  try {
    // Fetch all bets
    const { oddstype } = req.body
    // if (oddstype == "lgaai" || oddstype == "khaai") {
    // const allBets = await MarketLK.find({ type: oddstype });
    const allBets = await MarketLK.find();

    // Dictionary to track user wallet updates
    const userWalletUpdates = new Map();

    for (let bet of allBets) {
      const userId = bet.user.toString();
      // Fetch user's wallet only if not already cached
      if (!userWalletUpdates.has(userId)) {
        const userWallet = await User_Wallet.findOne({ user: userId });
        if (userWallet) userWalletUpdates.set(userId, userWallet);
      }
      const userWallet = userWalletUpdates.get(userId);
      if (!userWallet) continue; // Skip if wallet not found

      // Add exposure amount back to balance
      userWallet.balance += Math.abs(bet.exposure);
      // userWallet.exposureBalance -= Math.abs(bet.exposure)
      userWallet.exposureBalance = 0
      // Reset exposure to 0
      bet.exposure = 0;
      await bet.save(); // Save the updated bet
    }

    // Save all updated wallets
    for (const wallet of userWalletUpdates.values()) {
      await wallet.save();
    }

    res.status(200).json({ success: true, message: "All data has been reset, exposure added back to balances" });
    // }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};


// Get bets by user
const getUserBets = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId)
    const bets = await MarketLK.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, bets });
  } catch (error) {
    console.error('Error fetching bets:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
const getUserMatchBetsBets = async (req, res) => {
  try {
    const { userId, match } = req.params;
    // console.log(userId)
    const bets = await MarketLK.find({ user: userId, match: match }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, bets });
  } catch (error) {
    console.error('Error fetching bets:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// const getAllMatchOddsBets = async (req, res) => {
//   try {
//     console.log("ok111")
//     const { matchname } = req.params
//     console.log(matchname, "matchname")
//     const bets = await MarketLK.find({ match: matchname });
//     console.log(bets)
//     res.status(200).json({ success: true, bets });
//   } catch (error) {
//     console.error('Error fetching bets:', error);
//     res.status(500).json({ success: false, message: 'Internal server error' });
//   }
// };


const getAllMatchOddsBets = async (req, res) => {
  try {
    console.log("ok111");
    const { matchname } = req.params;
    console.log(matchname, "matchname");

    // 1. Find all bets for the match
    const bets = await MarketLK.find({ match: matchname });

    // 2. Filter only pending bets
    const pendingBets = bets.filter(bet => bet.current_status=== "Pending");

    // 3. Use a Set to store unique labels
    const seenLabels = new Set();
    const uniqueLabelBets = [];

    for (const bet of pendingBets) {
      if (!seenLabels.has(bet.label)) {
        seenLabels.add(bet.label);
        uniqueLabelBets.push(bet);
      }
    }

    // 4. Send only one bet per unique label
    res.status(200).json({ success: true, bets: uniqueLabelBets });

  } catch (error) {
    console.error('Error fetching bets:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


const getUserBetByLabel = async (req, res) => {
  try {
    const { match } = req.params;
    console.log(match, "label");
    const bets = await MarketLK.find({ label: match });
    res.status(200).json({ success: true, bets });
  } catch (error) {
    console.error('Error fetching bets:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getwalletandexposure = async (req, res) => {
  const { userId } = req.params;

  try {
    const wallet = await User_Wallet.findOne({ user: userId });

    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    res.status(200).json({
      balance: wallet.balance || 0,
      exposureBalance: wallet.exposureBalance || 0,
      teamAProfit: wallet.teamAProfit || 0,
      teamBProfit: wallet.teamBProfit || 0
    });
  } catch (error) {
    console.error('Error fetching wallet data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getUniqueMatchesAndLabels = async (req, res) => {
  try {
    const uniqueData = await MarketLK.aggregate([
      {
        $group: {
          _id: "$match",
          match: { $first: "$match" },
          status: { $first: "$status" },
          teams: { $addToSet: "$label" }
        }
      }
    ]);

    res.status(200).json(uniqueData);
  } catch (error) {
    console.error('Error fetching unique matches and labels:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const ResultDeclaration = require('../models/resultDeclartion');
const submitNewDeclaration = async (req, res) => {
  console.log(req.body, "okkkk laggai khai")
  const { match, winner, resultType } = req.body;

  try {

    const bets = await MarketLK.find({ match, current_status: "Pending" });
    if (!bets.length) {
      return res.status(404).json({ message: "No pending bets found for this match." });
    }

    for (const bet of bets) {
      const userWallet = await User_Wallet.findOne({ user: bet.user });

      if (!userWallet) {
        console.error(`Wallet not found for user: ${bet.user}`);
        continue;
      }
      const profitA = bet.teamIndex === 0 ? bet.teamAProfit : bet.teamBProfit
      const profitB = bet.teamIndex === 1 ? bet.teamAProfit : bet.teamBProfit
      console.log(profitA, profitB)
      // Check conditions and update wallet
      if ((bet.match === match && bet.label === winner && resultType == "Winner")) {
        // User wins
        if (profitA > 0&&profitB<0) {
          userWallet.balance += Number(profitA) + Number(userWallet.exposureBalance);
          userWallet.exposureBalance -= Math.abs(Number(profitB));
        }
        else {
          // userWallet.balance += Number(teamBProfit) + Number(userWallet.exposureBalance); 
          userWallet.exposureBalance -= Math.abs(Number(profitA));
        }
        // userWallet.balance += bet.teamAProfit;
      } else if ((bet.match === match && bet.label === winner && resultType == "loss")) {
        // User wins
        if (profitB > 0&&profitA<0) {
          userWallet.balance += Number(profitB) + Number(userWallet.exposureBalance);
          userWallet.exposureBalance -= Math.abs(Number(profitA));
        } else {
          userWallet.exposureBalance -= Math.abs(Number(profitB));
        }
      } else if ((bet.match === match && bet.label === winner && resultType == "Draw")) {
        userWallet.balance += Number(bet.exposure)
        userWallet.exposureBalance = 0;
      }
      // Adjust exposure and mark bet as completed
      bet.teamAProfit=0;
      bet.teamBProfit=0;
      bet.current_status = "Complete";
      userWallet.teamAProfit = 0;
      userWallet.teamBProfit = 0;

      await userWallet.save();
      await bet.save();
    }


    // console.log('Received payload:', req.body);

    const newDeclaration = new ResultDeclaration(req.body);
    await newDeclaration.save();

    res.status(200).json({ message: 'Declaration saved successfully' });
  } catch (error) {
    console.error('Error saving declaration:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const fatchrecentresultdeclation = async (req, res) => {
  try {
    const declarations = await ResultDeclaration.find({});
    res.status(200).json(declarations);
  } catch (error) {
    console.error('Error fetching declarations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { placeBet, getUserBets, getwalletandexposure, getUniqueMatchesAndLabels, submitNewDeclaration, fatchrecentresultdeclation, updateResult, resetAllData, getUserBetByLabel, getAllMatchOddsBets, getUserMatchBetsBets };




