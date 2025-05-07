/**
 * BettingLogic.js - Improved betting logic for Lagai-Khai and Fancy Market
 * 
 * This module provides utility functions for:
 * - Dynamic exposure calculation after every bet
 * - Full refund when an opposite bet reduces exposure
 * - Correct handling for continuous bets in the same and different sessions
 * - Profit/loss calculation on market settlement
 * - Real-time wallet and exposure updates
 */

const Bet2 = require('./crickbetModel');
const User_Wallet = require('./Wallet');
const betSocketController = require('../controller/betSocketController');

/**
 * Calculate profit for a bet based on its type
 * @param {Object} bet - The bet object
 * @returns {Number} - The calculated profit
 */
function calculateProfit(bet) {
  if (bet.type === "Lgaai") {
    return bet.stake * (bet.odds / 100);
  } else if (bet.type === "Khaai" || bet.type === "khaai") {
    return parseFloat(bet.stake);
  } else if (bet.type === "YES") {
    return bet.stake * bet.odds;
  } else if (bet.type === "NO") {
    return parseFloat(bet.stake);
  }
  return 0;
}

/**
 * Calculate liability for a bet based on its type
 * @param {Object} bet - The bet object
 * @returns {Number} - The calculated liability
 */
function calculateLiability(bet) {
  if (bet.type === "Khaai" || bet.type === "khaai") {
    return bet.stake * (bet.odds / 100);
  } else if (bet.type === "NO") {
    return bet.stake * bet.odds;
  }
  return 0;
}

/**
 * Get wallet balance from user wallet
 * @param {Object} userWallet - The user wallet object
 * @returns {Number} - The wallet balance
 */
function getWalletBalance(userWallet) {
  return userWallet.walletBalance !== undefined ? userWallet.walletBalance : userWallet.balance;
}

/**
 * Update user wallet balance
 * @param {Object} userWallet - The user wallet object
 * @param {Number} amount - The amount to add (positive) or subtract (negative)
 * @returns {Object} - The updated wallet
 */
async function updateWallet(userWallet, amount) {
  // Update the correct wallet field based on which one exists
  if (userWallet.walletBalance !== undefined) {
    userWallet.walletBalance += amount;
  } else if (userWallet.balance !== undefined) {
    userWallet.balance += amount;
  }
  
  await userWallet.save();
  return userWallet;
}

/**
 * Update user exposure balance
 * @param {Object} userWallet - The user wallet object
 * @param {Number} amount - The amount to add (positive) or subtract (negative)
 * @returns {Object} - The updated wallet
 */
async function updateExposure(userWallet, amount) {
  if (userWallet.exposureBalance !== undefined) {
    userWallet.exposureBalance = Math.max(0, userWallet.exposureBalance + amount);
  }
  
  await userWallet.save();
  return userWallet;
}

/**
 * Calculate exposure for match odds market (Lagai-Khai)
 * @param {Array} lagaiBets - Array of Lagai bets
 * @param {Array} khaiBets - Array of Khai bets
 * @returns {Number} - The calculated exposure
 */
function calculateMatchOddsExposure(lagaiBets, khaiBets) {
  const lagaiExposure = lagaiBets.reduce((total, bet) => total + parseFloat(bet.stake), 0);
  const khaiLiability = khaiBets.reduce((total, bet) => {
    return total + ((parseFloat(bet.odds) * parseFloat(bet.stake)) / 100);
  }, 0);
  
  return Math.abs(lagaiExposure - khaiLiability);
}

/**
 * Calculate exposure for fancy market (YES-NO)
 * @param {Array} yesBets - Array of YES bets
 * @param {Array} noBets - Array of NO bets
 * @returns {Number} - The calculated exposure
 */
function calculateFancyExposure(yesBets, noBets) {
  const yesExposure = yesBets.reduce((total, bet) => total + parseFloat(bet.stake), 0);
  const noLiability = noBets.reduce((total, bet) => {
    return total + (parseFloat(bet.stake) * parseFloat(bet.odds));
  }, 0);
  
  return Math.abs(yesExposure - noLiability);
}

/**
 * Place a bet for match odds (Lagai-Khai)
 * @param {Object} betData - The bet data
 * @param {Object} userWallet - The user wallet
 * @returns {Object} - Result of the bet placement
 */
async function placeMatchOddsBet(betData, userWallet) {
  const { userId, label, odds, stake, type, match } = betData;
  
  // Calculate amount to deduct from wallet based on bet type
  let amountToDeduct = 0;
  let calculatedProfit = 0;
  
  if (type === "Khaai" || type === "khaai") {
    // For Khaai (Lay) bets, deduct the liability (odds * stake / 100)
    amountToDeduct = (parseFloat(odds) * parseFloat(stake)) / 100;
    calculatedProfit = parseFloat(stake);
  } else if (type === "Lgaai") {
    // For Lgaai (Back) bets, deduct the stake
    amountToDeduct = parseFloat(stake);
    calculatedProfit = (parseFloat(odds) / 100) * parseFloat(stake);
  } else {
    return { success: false, message: "Invalid bet type for match odds" };
  }
  
  // Find all pending bets for the same label and match to handle hedging
  const pendingBets = await Bet2.find({
    user: userId,
    label: label,
    match: match,
    status: "Pending"
  });
  
  // Filter bets by type
  const lagaiBets = pendingBets.filter(bet => bet.type === "Lgaai");
  const khaiBets = pendingBets.filter(bet => bet.type === "Khaai" || bet.type === "khaai");
  
  // Calculate current exposure before this bet
  const currentExposure = calculateMatchOddsExposure(lagaiBets, khaiBets);
  
  // Create a temporary array with the new bet included to calculate new exposure
  let tempLagaiBets = [...lagaiBets];
  let tempKhaiBets = [...khaiBets];
  
  if (type === "Lgaai") {
    tempLagaiBets.push({ stake: parseFloat(stake) });
  } else {
    tempKhaiBets.push({ odds: parseFloat(odds), stake: parseFloat(stake) });
  }
  
  // Calculate new exposure with the new bet
  const newExposure = calculateMatchOddsExposure(tempLagaiBets, tempKhaiBets);
  
  // Deduct initial amount from wallet
  await updateWallet(userWallet, -amountToDeduct);
  
  // Calculate refund amount if exposure decreases
  let refundAmount = 0;
  if (newExposure < currentExposure) {
    refundAmount = currentExposure - newExposure;
    await updateWallet(userWallet, refundAmount);
  }
  
  // Create and save the new bet
  const newBet = new Bet2({
    user: userId,
    label,
    odds,
    stake,
    profit: calculatedProfit.toFixed(2),
    liability: type === "Khaai" || type === "khaai" ? amountToDeduct.toFixed(2) : 0,
    type,
    match,
    status: "Pending"
  });
  
  await newBet.save();
  
  // Update exposure balance - only add the net exposure
  const exposureToAdd = Math.max(0, newExposure - (currentExposure - refundAmount));
  await updateExposure(userWallet, exposureToAdd);
  
  // Emit socket event for the new bet
  await betSocketController.emitBetUpdate(newBet);
  
  return {
    success: true,
    message: "Bet placed successfully",
    bet: newBet,
    walletBalance: getWalletBalance(userWallet),
    exposureBalance: userWallet.exposureBalance || 0,
    refundAmount
  };
}

/**
 * Place a bet for fancy market (YES-NO)
 * @param {Object} betData - The bet data
 * @param {Object} userWallet - The user wallet
 * @returns {Object} - Result of the bet placement
 */
async function placeFancyBet(betData, userWallet) {
  const { userId, label, odds, run, stake, type, match } = betData;
  
  // Calculate amount to deduct from wallet based on bet type
  let amountToDeduct = 0;
  let calculatedProfit = 0;
  
  if (type === "YES") {
    // For YES bets, deduct the stake amount directly
    amountToDeduct = parseFloat(stake);
    // Profit = Stake × Odds
    calculatedProfit = parseFloat(stake) * parseFloat(odds);
  } else if (type === "NO") {
    // For NO bets, deduct the liability (stake × odds)
    amountToDeduct = parseFloat(stake) * parseFloat(odds);
    // Profit = Fixed stake amount
    calculatedProfit = parseFloat(stake);
  } else {
    return { success: false, message: "Invalid bet type for fancy market" };
  }
  
  // Find all pending bets for the same market and match to handle hedging
  const pendingBets = await Bet2.find({
    user: userId,
    label: label,
    match: match,
    run: run,
    status: "Pending",
    $or: [{ type: "YES" }, { type: "NO" }]
  });
  
  // Check for exact opposite bet to cancel
  const oppositeBets = pendingBets.filter(bet => 
    bet.type !== type && Math.abs(parseFloat(bet.stake) - parseFloat(stake)) < 0.01
  );
  
  // If there's an exact match, cancel the opposite bet and don't place this bet
  if (oppositeBets.length > 0) {
    const betToCancel = oppositeBets[0];
    
    // Update the bet status to Cancelled
    betToCancel.status = "Cancelled";
    betToCancel.result = "Cancelled by opposing bet";
    await betToCancel.save();
    
    // Calculate amount to return to wallet based on bet type
    let amountToReturn = 0;
    
    if (betToCancel.type === "YES") {
      // For YES bets, return the stake
      amountToReturn = parseFloat(betToCancel.stake);
    } else if (betToCancel.type === "NO") {
      // For NO bets, return the liability (stake × odds)
      amountToReturn = parseFloat(betToCancel.stake) * parseFloat(betToCancel.odds);
    }
    
    // Update user wallet
    await updateWallet(userWallet, amountToReturn);
    
    // Update exposure balance
    await updateExposure(userWallet, -amountToReturn);
    
    // Emit socket event for the cancelled bet
    await betSocketController.emitBetUpdate(betToCancel);
    
    return {
      success: true,
      message: "Opposing bet cancelled, no new bet placed",
      cancelledBet: betToCancel,
      walletBalance: getWalletBalance(userWallet),
      exposureBalance: userWallet.exposureBalance || 0
    };
  }
  
  // Filter bets by type
  const yesBets = pendingBets.filter(bet => bet.type === "YES");
  const noBets = pendingBets.filter(bet => bet.type === "NO");
  
  // Calculate current exposure before this bet
  const currentExposure = calculateFancyExposure(yesBets, noBets);
  
  // Create a temporary array with the new bet included to calculate new exposure
  let tempYesBets = [...yesBets];
  let tempNoBets = [...noBets];
  
  if (type === "YES") {
    tempYesBets.push({ stake: parseFloat(stake) });
  } else {
    tempNoBets.push({ stake: parseFloat(stake), odds: parseFloat(odds) });
  }
  
  // Calculate new exposure with the new bet
  const newExposure = calculateFancyExposure(tempYesBets, tempNoBets);
  
  // Deduct initial amount from wallet
  await updateWallet(userWallet, -amountToDeduct);
  
  // Calculate refund amount if exposure decreases
  let refundAmount = 0;
  if (newExposure < currentExposure) {
    refundAmount = currentExposure - newExposure;
    await updateWallet(userWallet, refundAmount);
  }
  
  // Create and save the new bet
  const newBet = new Bet2({
    user: userId,
    label,
    odds,
    run,
    stake,
    profit: calculatedProfit.toFixed(2),
    liability: type === "NO" ? amountToDeduct.toFixed(2) : 0,
    type,
    match,
    status: "Pending"
  });
  
  await newBet.save();
  
  // Update exposure balance - only add the net exposure
  const exposureToAdd = Math.max(0, newExposure - (currentExposure - refundAmount));
  await updateExposure(userWallet, exposureToAdd);
  
  // Emit socket event for the new bet
  await betSocketController.emitBetUpdate(newBet);
  
  return {
    success: true,
    message: "Bet placed successfully",
    bet: newBet,
    walletBalance: getWalletBalance(userWallet),
    exposureBalance: userWallet.exposureBalance || 0,
    refundAmount
  };
}

/**
 * Settle a match odds market
 * @param {String} match - The match identifier
 * @param {String} label - The market label
 * @param {String} result - The result (winner)
 * @returns {Object} - Result of the settlement
 */
async function settleMatchOddsMarket(match, label, result) {
  // Find all pending bets for this market
  const pendingBets = await Bet2.find({
    match,
    label,
    status: "Pending",
    $or: [{ type: "Lgaai" }, { type: "Khaai" }, { type: "khaai" }]
  });
  
  if (pendingBets.length === 0) {
    return { success: false, message: "No pending bets found for this market" };
  }
  
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
      
      // Process the bet based on result
      if (bet.type === "Lgaai") {
        if (result === "Lgaai") {
          // Lgaai bet wins
          const winAmount = parseFloat(bet.stake) + parseFloat(bet.profit);
          await updateWallet(userWallet, winAmount);
          bet.status = "Won";
        } else {
          // Lgaai bet loses (stake already deducted)
          bet.status = "Lost";
        }
      } else if (bet.type === "Khaai" || bet.type === "khaai") {
        if (result === "Khaai" || result === "khaai") {
          // Khai bet wins
          const winAmount = parseFloat(bet.stake);
          await updateWallet(userWallet, winAmount);
          bet.status = "Won";
        } else {
          // Khai bet loses (liability already deducted)
          bet.status = "Lost";
        }
      }
      
      // Set the result
      bet.result = result;
      
      // Update exposure balance - release the exposure
      let exposureToRelease = 0;
      if (bet.type === "Lgaai") {
        exposureToRelease = parseFloat(bet.stake);
      } else if (bet.type === "Khaai" || bet.type === "khaai") {
        exposureToRelease = parseFloat(bet.liability) || (parseFloat(bet.odds) * parseFloat(bet.stake)) / 100;
      }
      
      await updateExposure(userWallet, -exposureToRelease);
      
      // Save the bet
      await bet.save();
      
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
  
  return {
    success: true,
    message: `Market settled successfully. Processed ${processedCount} bets with ${errorCount} errors.`
  };
}

/**
 * Settle a fancy market
 * @param {String} match - The match identifier
 * @param {String} market - The market label
 * @param {Number} result - The result value
 * @returns {Object} - Result of the settlement
 */
async function settleFancyMarket(match, market, result) {
  // Find all pending bets for this market
  const pendingBets = await Bet2.find({
    match,
    label: market,
    status: "Pending",
    $or: [{ type: "YES" }, { type: "NO" }]
  });
  
  if (pendingBets.length === 0) {
    return { success: false, message: "No pending bets found for this market" };
  }
  
  const resultValue = parseFloat(result);
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
      
      const betRunValue = parseFloat(bet.run);
      
      // Process the bet based on result
      if (bet.type === "YES") {
        // YES bet wins if the actual result equals or exceeds the bet run value
        if (resultValue >= betRunValue) {
          // Add profit to wallet
          const winAmount = parseFloat(bet.profit);
          await updateWallet(userWallet, winAmount);
          bet.status = "Won";
        } else {
          // Bet lost (stake already deducted)
          bet.status = "Lost";
        }
      } else if (bet.type === "NO") {
        // NO bet wins if the actual result is less than the bet run value
        if (resultValue < betRunValue) {
          // Add profit to wallet
          const winAmount = parseFloat(bet.profit);
          await updateWallet(userWallet, winAmount);
          bet.status = "Won";
        } else {
          // Bet lost (liability already deducted)
          bet.status = "Lost";
        }
      }
      
      // Set the result
      bet.result = result.toString();
      
      // Update exposure balance - release the exposure
      let exposureToRelease = 0;
      if (bet.type === "YES") {
        exposureToRelease = parseFloat(bet.stake);
      } else if (bet.type === "NO") {
        exposureToRelease = parseFloat(bet.liability) || parseFloat(bet.stake) * parseFloat(bet.odds);
      }
      
      await updateExposure(userWallet, -exposureToRelease);
      
      // Save the bet
      await bet.save();
      
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
  
  return {
    success: true,
    message: `Market settled successfully. Processed ${processedCount} bets with ${errorCount} errors.`
  };
}

/**
 * Cancel all bets for a market
 * @param {String} match - The match identifier
 * @param {String} market - The market label (optional for match odds)
 * @param {String} type - The market type ("matchOdds" or "fancy")
 * @returns {Object} - Result of the cancellation
 */
async function cancelMarket(match, market, type) {
  // Build the query based on market type
  const query = {
    match,
    status: "Pending"
  };
  
  if (type === "fancy" && market) {
    query.label = market;
    query.$or = [{ type: "YES" }, { type: "NO" }];
  } else if (type === "matchOdds") {
    if (market) query.label = market;
    query.$or = [{ type: "Lgaai" }, { type: "Khaai" }, { type: "khaai" }];
  }
  
  // Find all pending bets for this market
  const pendingBets = await Bet2.find(query);
  
  if (pendingBets.length === 0) {
    return { 
      success: false, 
      message: `No pending bets found for ${type === "fancy" ? "fancy market" : "match odds"}`
    };
  }
  
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
      
      // Calculate amount to return based on bet type
      let amountToReturn = 0;
      
      if (bet.type === "Lgaai" || bet.type === "YES") {
        // Return the stake
        amountToReturn = parseFloat(bet.stake);
      } else if (bet.type === "Khaai" || bet.type === "khaai") {
        // Return the liability (odds * stake / 100)
        amountToReturn = parseFloat(bet.liability) || (parseFloat(bet.odds) * parseFloat(bet.stake)) / 100;
      } else if (bet.type === "NO") {
        // Return the liability (stake * odds)
        amountToReturn = parseFloat(bet.liability) || parseFloat(bet.stake) * parseFloat(bet.odds);
      }
      
      // Update user wallet
      await updateWallet(userWallet, amountToReturn);
      
      // Update exposure balance - release the exposure
      await updateExposure(userWallet, -amountToReturn);
      
      // Update bet status
      bet.status = "Cancelled";
      bet.result = "Cancelled";
      await bet.save();
      
      // Emit socket event for the updated bet
      await betSocketController.emitBetUpdate(bet);
      
      processedCount++;
    } catch (error) {
      console.error(`Error cancelling bet ${bet._id}:`, error);
      errorCount++;
    }
  }
  
  // Emit an update for all user bets to refresh the list
  const uniqueUserIds = [...new Set(pendingBets.map(bet => bet.user))];
  for (const userId of uniqueUserIds) {
    await betSocketController.emitBetsUpdate(userId);
  }
  
  return {
    success: true,
    message: `Market cancelled successfully. Processed ${processedCount} bets with ${errorCount} errors.`
  };
}

module.exports = {
  calculateProfit,
  calculateLiability,
  updateWallet,
  updateExposure,
  calculateMatchOddsExposure,
  calculateFancyExposure,
  placeMatchOddsBet,
  placeFancyBet,
  settleMatchOddsMarket,
  settleFancyMarket,
  cancelMarket
}; 