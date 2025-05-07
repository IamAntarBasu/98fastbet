const Bet2 = require('../models/crickbetModel');
const mongoose = require('mongoose');
const User_Wallet = require('../models/Wallet');

// Initialize socket connection
let io;

// Function to initialize socket with the io instance from the main server
const initSocket = (socketIo) => {
  io = socketIo;
  setupSocketListeners();
};

// Set up socket event listeners
const setupSocketListeners = () => {
  if (!io) return;

  io.on('connection', (socket) => {
    console.log('Client connected to bet socket');

    // Handle joining a room for specific user's bets
    socket.on('joinUserBets', (userId) => {
      if (!userId) return;
      socket.join(`user-bets-${userId}`);
      console.log(`User ${userId} joined their bet room`);
    });

    // Handle joining a room for specific match bets
    socket.on('joinMatchBets', (matchId) => {
      if (!matchId) return;
      socket.join(`match-bets-${matchId}`);
      console.log(`Joined match bets room for ${matchId}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected from bet socket');
    });
  });
};

// Function to emit an update for a specific bet
const emitBetUpdate = async (bet) => {
  try {
    if (!io) return;
    
    // Emit to the user's room
    io.to(`user-bets-${bet.user}`).emit('betUpdated', bet);
    
    // Also emit to the match room if available
    if (bet.match) {
      io.to(`match-bets-${bet.match}`).emit('matchBetUpdated', bet);
    }
    
    console.log(`Emitted update for bet ${bet._id} to user ${bet.user}`);
  } catch (error) {
    console.error('Error emitting bet update:', error);
  }
};

// Function to emit an update for all of a user's bets
const emitBetsUpdate = async (userId) => {
  try {
    if (!io) return;
    
    // Find all bets for the user
    const userBets = await Bet2.find({ user: userId });
    
    // Emit the updated list to the user's room
    io.to(`user-bets-${userId}`).emit('betsUpdated', userBets);
    
    console.log(`Emitted update for all bets to user ${userId}`);
  } catch (error) {
    console.error('Error emitting bets update:', error);
  }
};

module.exports = {
  initSocket,
  emitBetUpdate,
  emitBetsUpdate
}; 