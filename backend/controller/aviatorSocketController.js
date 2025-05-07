const User_Wallet = require('../models/Wallet');
const Aviator = require('../models/avaitorModel');
const CrashAviator = require('../models/crashAviator');
const crypto = require('crypto');
const mongoose = require('mongoose');

// Active connections and game state
const activeConnections = new Map();
let gameState = {
  phase: 'countdown',       // countdown, flying, crashed
  countdown: 7,             // Countdown before flight starts
  multiplier: 0.5,          // Current multiplier
  crashPoint: 1,            // Point at which game will crash
  roundId: null,            // Current round ID
  startTime: null,          // Time when the flight started
  isActive: false,          // Whether the game is in progress
  activeBets: new Map(),    // Map of active bets: userId -> bet details
  crashHistory: [],         // History of crash points
  userBalances: new Map(),  // Track user balances during a game session
};

// Round ID generator
const generateRoundId = () => {
  const uniquePart = Date.now().toString().slice(-6);
  return `AV${uniquePart}`;
};

// Provably fair crash point generator
const generateCrashPoint = (seed) => {
  // Create a predictable but secure random number from the seed
  const hash = crypto.createHash('sha256').update(seed).digest('hex');
  
  // Use the first 8 characters of the hash as a hex number
  const randomValue = parseInt(hash.substring(0, 8), 16);
  
  // Scale the randomValue to a range between 1 and 10
  // Using a house edge factor to make the game profitable
  const houseEdge = 0.05; // 5% house edge
  const e = Math.pow(2, 32);
  const result = (100 * e - randomValue * houseEdge) / (randomValue * (1 - houseEdge));
  
  // Limit maximum multiplier and round to 2 decimal places
  // const maxMultiplier = 30;
  const maxMultiplier = 10;
  const multiplier = Math.min(result / 100, maxMultiplier);
  
  return Math.round(multiplier * 100) / 100;
};

// Store the crash point in the database
const storeCrashPoint = async (roundId, crashPoint) => {
  try {
    const crashEntry = new CrashAviator({
      round_id: roundId,
      crashMultiplier: crashPoint.toString()
    });
    await crashEntry.save();
    return true;
  } catch (error) {
    console.error('Error storing crash point:', error);
    return false;
  }
};

// Get the current balance for a user from the database
const getUserBalance = async (userId) => {
  try {
    // Try getting from cache first
    if (gameState.userBalances.has(userId)) {
      return gameState.userBalances.get(userId);
    }

    // Otherwise get from database
    const wallet = await User_Wallet.findOne({ user: userId });
    if (!wallet) {
      throw new Error('Wallet not found for user');
    }
    
    // Cache the balance
    gameState.userBalances.set(userId, wallet.balance);
    
    return wallet.balance;
  } catch (error) {
    console.error('Error getting user balance:', error);
    throw error;
  }
};

// Update user balance with proper locking to prevent race conditions
const updateUserBalance = async (userId, amount, type) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    // Find user's wallet with session-based locking
    const wallet = await User_Wallet.findOne({ user: userId }).session(session);
    if (!wallet) {
      throw new Error('Wallet not found for user');
    }
    
    // Calculate new balance based on type
    let newBalance;
    if (type === 'deduct') {
      newBalance = Number((wallet.balance - amount).toFixed(2));
      if (newBalance < 0) {
        throw new Error('Insufficient balance');
      }
    } else if (type === 'add') {
      newBalance = Number((wallet.balance + amount).toFixed(2));
    } else {
      throw new Error('Invalid update type');
    }
    
    // Update wallet balance
    wallet.balance = newBalance;
    await wallet.save({ session });
    
    // Update cache
    gameState.userBalances.set(userId, newBalance);
    
    // Commit transaction
    await session.commitTransaction();
    session.endSession();
    
    return newBalance;
  } catch (error) {
    // Abort transaction on error
    await session.abortTransaction();
    session.endSession();
    console.error('Error updating user balance:', error);
    throw error;
  }
};

// Start a new game round
const startNewGameRound = async () => {
  // Reset game state for a new round
  const roundId = generateRoundId();
  
  // Generate a provably fair seed using the round ID and a server secret
  const serverSecret = process.env.SERVER_SECRET || 'default-secret-key-change-in-production';
  const seed = `${roundId}-${serverSecret}-${Date.now()}`;
  
  // Generate crash point
  const crashPoint = generateCrashPoint(seed);
  
  // Store the crash point in the database
  await storeCrashPoint(roundId, crashPoint);
  
  // Refund any pending bets from previous round (in case of server restart)
  const pendingBets = Array.from(gameState.activeBets.values());
  for (const bet of pendingBets) {
    try {
      if (!bet.processed) {
        // Refund bet amount to user's balance
        await updateUserBalance(bet.userId, bet.amount, 'add');
        
        // Broadcast updated balance to the user
        io.to(`user_${bet.userId}`).emit('balance_update', {
          userId: bet.userId,
          balance: gameState.userBalances.get(bet.userId)
        });
      }
    } catch (error) {
      console.error('Error refunding pending bet:', error);
    }
  }
  
  // Update game state
  gameState = {
    ...gameState,
    phase: 'countdown',
    countdown: 7,
    multiplier: 0.5,
    crashPoint: crashPoint,
    roundId: roundId,
    startTime: null,
    isActive: false,
    activeBets: new Map(),
    // Preserve userBalances map
    userBalances: gameState.userBalances,
  };
  
  // Store crash in history
  if (gameState.crashHistory.length >= 10) {
    gameState.crashHistory.shift(); // Remove oldest
  }
  gameState.crashHistory.push(crashPoint);
  
  // Start countdown
  let count = 7;
  const countdownInterval = setInterval(() => {
    gameState.countdown = count;
    
    // Broadcast game state update
    io.to('aviator_game').emit('aviator_game_state', {
      phase: gameState.phase,
      countdown: gameState.countdown,
      multiplier: gameState.multiplier,
      roundId: gameState.roundId,
      crashHistory: gameState.crashHistory,
      isActive: gameState.isActive,
    });
    
    count--;
    
    if (count < 0) {
      clearInterval(countdownInterval);
      startFlight();
    }
  }, 1000);
};

// Start the flight (multiplier increasing)
const startFlight = () => {
  gameState.phase = 'flying';
  gameState.startTime = Date.now();
  gameState.isActive = true;
  
  // Broadcast flight start
  io.to('aviator_game').emit('aviator_game_state', {
    phase: gameState.phase,
    countdown: 0,
    multiplier: gameState.multiplier,
    roundId: gameState.roundId,
    isActive: gameState.isActive,
  });
  
  // Start increasing multiplier
  const multiplierInterval = setInterval(() => {
    const elapsedTime = (Date.now() - gameState.startTime) / 1000;
    const newMultiplier = 0.5 + elapsedTime * 0.5; // Adjust the speed here
    
    gameState.multiplier = parseFloat(newMultiplier.toFixed(2));
    
    // Broadcast multiplier update
    io.to('aviator_game').emit('aviator_game_state', {
      phase: gameState.phase,
      countdown: 0,
      multiplier: gameState.multiplier,
      roundId: gameState.roundId,
      isActive: gameState.isActive,
    });
    
    // Check if crash point reached
    if (gameState.multiplier >= gameState.crashPoint) {
      clearInterval(multiplierInterval);
      handleCrash();
    }
  }, 100); // Update every 100ms for smoothness
};

// Handle the crash
const handleCrash = async () => {
  gameState.phase = 'crashed';
  gameState.isActive = false;
  
  // Broadcast crash
  io.to('aviator_game').emit('aviator_game_state', {
    phase: gameState.phase,
    countdown: 0,
    multiplier: gameState.crashPoint,
    roundId: gameState.roundId,
    isActive: gameState.isActive,
    crashPoint: gameState.crashPoint,
  });
  
  // Process unclaimed bets (players who didn't cash out)
  const unclaimedBets = Array.from(gameState.activeBets.values()).filter(bet => !bet.hasCashedOut && bet.processed);
  for (const bet of unclaimedBets) {
    try {
      // Mark the game as lost in the database
      await Aviator.findOneAndUpdate(
        { user: bet.userId, round_id: gameState.roundId },
        { 
          isWin: "Lost",
          multiplier: gameState.crashPoint,
          crash: gameState.crashPoint,
          winningAmt: 0
        }
      );
      
      // Notify user of loss
      io.to(`user_${bet.userId}`).emit('bet_result', {
        roundId: gameState.roundId,
        success: false,
        stake: bet.amount,
        multiplier: gameState.crashPoint,
        winnings: 0,
        balance: gameState.userBalances.get(bet.userId)
      });
    } catch (error) {
      console.error('Error updating unclaimed bet:', error);
    }
  }
  
  // Send game results
  io.to('aviator_game').emit('aviator_game_result', {
    roundId: gameState.roundId,
    crashPoint: gameState.crashPoint,
    winners: Array.from(gameState.activeBets.values())
      .filter(bet => bet.hasCashedOut && bet.processed)
      .map(bet => ({
        userId: bet.userId,
        amount: bet.amount,
        cashoutMultiplier: bet.cashoutMultiplier,
        winnings: bet.winnings
      })),
    losers: unclaimedBets.map(bet => ({
      userId: bet.userId,
      amount: bet.amount
    }))
  });
  
  // Wait 5 seconds before starting a new round
  setTimeout(() => {
    startNewGameRound();
  }, 5000);
};

// Handle a player placing a bet
const handlePlaceBet = async (socket, { userId, amount, roundId }) => {
  try {
    // Validate bet
    if (!userId || !amount || amount <= 0) {
      socket.emit('error', { message: 'Invalid bet parameters' });
      return;
    }
    
    // Check if bet is for current round
    if (roundId !== gameState.roundId) {
      socket.emit('error', { message: 'Invalid round ID' });
      return;
    }
    
    // Check if game is in countdown phase
    if (gameState.phase !== 'countdown') {
      socket.emit('error', { message: 'Betting is closed for this round' });
      return;
    }
    
    // Verify user has sufficient balance
    let currentBalance;
    try {
      currentBalance = await getUserBalance(userId);
      
      if (currentBalance < amount) {
        socket.emit('error', { message: 'Insufficient balance' });
        return;
      }
    } catch (error) {
      socket.emit('error', { message: 'Error verifying balance' });
      return;
    }
    
    // Deduct bet amount from user's balance
    try {
      const newBalance = await updateUserBalance(userId, amount, 'deduct');
      
      // Notify user of balance update
      socket.emit('balance_update', {
        userId,
        balance: newBalance,
        type: 'deduct',
        amount,
        reason: 'bet_placed'
      });
    } catch (error) {
      socket.emit('error', { message: error.message || 'Error processing bet' });
      return;
    }
    
    // Create game record in database
    try {
      const newGame = new Aviator({
        user: userId,
        round_id: roundId,
        betAmt: amount,
      });
      await newGame.save();
    } catch (dbError) {
      console.error('Error creating game record:', dbError);
      // If DB error, refund the bet
      try {
        await updateUserBalance(userId, amount, 'add');
        socket.emit('balance_update', {
          userId,
          balance: gameState.userBalances.get(userId),
          type: 'add',
          amount,
          reason: 'bet_refunded'
        });
      } catch (refundError) {
        console.error('Error refunding bet after DB error:', refundError);
      }
      socket.emit('error', { message: 'Server error creating game record' });
      return;
    }
    
    // Add bet to active bets
    gameState.activeBets.set(userId, {
      userId,
      amount,
      placedAt: new Date(),
      hasCashedOut: false,
      cashoutMultiplier: null,
      winnings: 0,
      processed: true // Mark as processed (balance deducted)
    });
    
    // Broadcast updated bets
    broadcastActiveBets();
    
    // Confirm bet placement
    socket.emit('bet_placed', { 
      success: true, 
      roundId: gameState.roundId,
      amount,
      balance: gameState.userBalances.get(userId)
    });
    
  } catch (error) {
    console.error('Error placing bet:', error);
    socket.emit('error', { message: 'Server error placing bet' });
  }
};

// Handle a player cashing out
const handleCashOut = async (socket, { userId, roundId }) => {
  try {
    // Validate cashout
    if (!userId || !roundId) {
      socket.emit('error', { message: 'Invalid cashout parameters' });
      return;
    }
    
    // Check if cashout is for current round
    if (roundId !== gameState.roundId) {
      socket.emit('error', { message: 'Invalid round ID' });
      return;
    }
    
    // Check if game is in flying phase
    if (gameState.phase !== 'flying') {
      socket.emit('error', { message: 'Cannot cash out at this time' });
      return;
    }
    
    // Check if user has an active bet
    if (!gameState.activeBets.has(userId)) {
      socket.emit('error', { message: 'No active bet found' });
      return;
    }
    
    // Get bet details
    const bet = gameState.activeBets.get(userId);
    
    // Check if already cashed out
    if (bet.hasCashedOut) {
      socket.emit('error', { message: 'Already cashed out' });
      return;
    }
    
    // Calculate winnings
    const actualMultiplier = gameState.multiplier;
    const stakeAmount = bet.amount;
    const profit = stakeAmount * actualMultiplier - stakeAmount;
    const totalWinnings = stakeAmount + profit;
    
    // Update bet status
    bet.hasCashedOut = true;
    bet.cashoutMultiplier = actualMultiplier;
    bet.winnings = totalWinnings;
    bet.profit = profit;
    gameState.activeBets.set(userId, bet);
    
    try {
      // Update user's balance in database
      const newBalance = await updateUserBalance(userId, totalWinnings, 'add');
      
      // Update game record in database
      await Aviator.findOneAndUpdate(
        { user: userId, round_id: roundId },
        {
          isWin: "Won",
          multiplier: actualMultiplier,
          crash: gameState.crashPoint,
          winningAmt: totalWinnings
        }
      );
      
      // Notify user of successful cashout and balance update
      socket.emit('cash_out_success', { 
        success: true, 
        stake: stakeAmount,
        multiplier: actualMultiplier,
        profit: profit,
        totalWinnings: totalWinnings,
        balance: newBalance
      });
      
      // Notify all clients about this user's cashout
      socket.broadcast.to('aviator_game').emit('user_cashed_out', {
        userId,
        multiplier: actualMultiplier,
        totalWinnings
      });
    } catch (error) {
      console.error('Error processing cashout:', error);
      socket.emit('error', { message: 'Server error processing cashout' });
      
      // Revert bet status in case of error
      bet.hasCashedOut = false;
      bet.cashoutMultiplier = null;
      bet.winnings = 0;
      bet.profit = 0;
      gameState.activeBets.set(userId, bet);
      return;
    }
    
    // Broadcast updated bets
    broadcastActiveBets();
    
  } catch (error) {
    console.error('Error cashing out:', error);
    socket.emit('error', { message: 'Server error cashing out' });
  }
};

// Cancel a bet before the round starts (during countdown)
const handleCancelBet = async (socket, { userId, roundId }) => {
  try {
    // Validate parameters
    if (!userId || !roundId) {
      socket.emit('error', { message: 'Invalid cancel bet parameters' });
      return;
    }
    
    // Check if cancellation is for current round
    if (roundId !== gameState.roundId) {
      socket.emit('error', { message: 'Invalid round ID' });
      return;
    }
    
    // Check if game is still in countdown phase
    if (gameState.phase !== 'countdown') {
      socket.emit('error', { message: 'Cannot cancel bet after game has started' });
      return;
    }
    
    // Check if user has an active bet
    if (!gameState.activeBets.has(userId)) {
      socket.emit('error', { message: 'No active bet found to cancel' });
      return;
    }
    
    // Get bet details
    const bet = gameState.activeBets.get(userId);
    
    // Refund bet amount to user's balance
    try {
      const newBalance = await updateUserBalance(userId, bet.amount, 'add');
      
      // Remove bet from active bets
      gameState.activeBets.delete(userId);
      
      // Remove bet from database
      await Aviator.findOneAndDelete({ user: userId, round_id: roundId });
      
      // Notify user of successful cancellation and balance update
      socket.emit('bet_cancelled', { 
        success: true, 
        refundAmount: bet.amount,
        balance: newBalance
      });
      
      // Broadcast updated bets
      broadcastActiveBets();
    } catch (error) {
      console.error('Error cancelling bet:', error);
      socket.emit('error', { message: 'Server error cancelling bet' });
    }
  } catch (error) {
    console.error('Error handling bet cancellation:', error);
    socket.emit('error', { message: 'Server error processing bet cancellation' });
  }
};

// Broadcast active bets to all clients
const broadcastActiveBets = () => {
  const betsArray = Array.from(gameState.activeBets.values())
    .filter(bet => bet.processed)
    .map(bet => ({
      username: bet.userId.substring(0, 3) + '****' + bet.userId.substring(bet.userId.length - 2),
      amount: bet.amount,
      multiplier: bet.hasCashedOut ? bet.cashoutMultiplier : gameState.multiplier,
      winnings: bet.hasCashedOut ? bet.winnings : 0,
      hasCashedOut: bet.hasCashedOut
    }));
  
  io.to('aviator_game').emit('aviator_bet_update', betsArray);
};

// Initialize game on server start
let io;
const initializeGame = (socketIo) => {
  io = socketIo;
  
  // Start first game round
  startNewGameRound();
  
  // Setup socket events
  io.on('connection', (socket) => {
    console.log('User connected to Aviator game:', socket.id);
    
    // Join Aviator game room
    socket.join('aviator_game');
    
    // Send current game state to newly connected client
    socket.emit('aviator_game_state', {
      phase: gameState.phase,
      countdown: gameState.countdown,
      multiplier: gameState.multiplier,
      roundId: gameState.roundId,
      crashHistory: gameState.crashHistory,
      isActive: gameState.isActive,
    });
    
    // Authentication - associate socket with user
    socket.on('authenticate', async ({ userId }) => {
      if (userId) {
        // Join user-specific room for targeted messages
        socket.join(`user_${userId}`);
        
        // Get user's current balance
        try {
          const balance = await getUserBalance(userId);
          
          // Send balance to user
          socket.emit('balance_update', {
            userId,
            balance,
            type: 'init'
          });
        } catch (error) {
          console.error('Error retrieving user balance:', error);
          socket.emit('error', { message: 'Error retrieving balance' });
        }
      }
    });
    
    // Handle bet placement
    socket.on('place_bet', (data) => handlePlaceBet(socket, data));
    
    // Handle cash out
    socket.on('cash_out', (data) => handleCashOut(socket, data));
    
    // Handle bet cancellation
    socket.on('cancel_bet', (data) => handleCancelBet(socket, data));
    
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected from Aviator game:', socket.id);
    });
    
    // Handle ping
    socket.on('ping', () => {
      socket.emit('pong');
    });
  });
};

module.exports = {
  initializeGame
}; 
