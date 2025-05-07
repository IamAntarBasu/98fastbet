const express = require('express');
const router = express.Router();
const aviatorController = require('../controller/avaitorController'); // Adjust path as needed

// Create a new game record
router.post('/avaitor/create', aviatorController.createGameRecord);
router.put('/avaitor/update', aviatorController.updateGameRecord);

// Get all game records for a specific user
router.get('/avaitor/gamehistory/:userId', aviatorController.getUserGameHistory);

// Get all Aviator game records
router.get('/avaitor/get-all', aviatorController.getAllGames);

// Get a single game record by ID
router.get('/avaitor/gat-by-id/:id', aviatorController.getGameById);
router.get('/avaitor/gat-by-last-round-id', aviatorController.getLastRoundId);

// Delete a game record
router.delete('/avaitor/delete/:id', aviatorController.deleteGameRecord);
router.delete('/avaitor/all/delete', aviatorController.resetAll);

module.exports = router;