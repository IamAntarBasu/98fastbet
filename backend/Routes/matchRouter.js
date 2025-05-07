const express = require('express');
const router = express.Router();
const matchController = require('../controller/matchController');

// Create a new match
router.post('/match/create', matchController.createMatch);

// Get all matches
router.get('/match/get-all-recent-matches', matchController.getAllMatches);

// Get match by ID
router.get('/match/get-all/:id', matchController.getMatchById);
router.get('/match/get-players-by-matchname/:matchName', matchController.getMatchByMatchName);


router.delete('/match/delete/:id', matchController.deleteMatch);
router.put('/match/update/:id', matchController.updateMatch);

module.exports = router;
