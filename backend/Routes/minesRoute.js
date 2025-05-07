// // const express = require('express');
// // // const router = express.Router();
// // const minesController = require('../controller/minesController');
// // const minesRouter = express.Router()
// // // Create a new game record
// // minesRouter.post('/create', minesController.createGameRecord);
// // minesRouter.get('/get-all', minesController.getAllGames);
// // // Get all games for a user
// // minesRouter.get('/history/:userId', minesController.getUserGameHistory);

// // // Get a specific game by ID
// // minesRouter.get('/:id', minesController.getGameById);

// // // Delete a game record
// // minesRouter.delete('/delete/:id', minesController.deleteGameRecord);
// // minesRouter.get('/admin/getAllMines', minesController.getAllMines);
// // module.exports = minesRouter;

// const express = require('express');
// // const router = express.Router();
// const minesController = require('../controller/minesController');
// const minesRouter = express.Router()
// // Create a new game record
// minesRouter.post('/create', minesController.createGameRecord);
// minesRouter.get('/get-all', minesController.getAllGames);
// // Get all games for a user
// minesRouter.get('/history/:userId', minesController.getUserGameHistory);

// // Get a specific game by ID
// minesRouter.get('/mines/:id', minesController.getGameById);

// // Delete a game record
// minesRouter.delete('/delete/:id', minesController.deleteGameRecord);
// minesRouter.get('/admin/getAllMines', minesController.getAllMines);
// module.exports = minesRouter;

const express = require('express');
// const router = express.Router();
const minesController = require('../controller/minesController');
const minesRouter = express.Router()
// Create a new game record
minesRouter.post('/mines/betPlace', minesController.createGameRecord);
minesRouter.put('/update', minesController.updateGameRecord);
minesRouter.get('/mines/get-all', minesController.getAllGames);
// Get all games for a user
minesRouter.get('/history/:userId', minesController.getUserGameHistory);

// Get a specific game by ID
minesRouter.get('/:id', minesController.getGameById);

// Delete a game record
minesRouter.delete('/delete/:id', minesController.deleteGameRecord);
minesRouter.delete('/mines/resetAll', minesController.resetAll);
minesRouter.get('/admin/getAllMines', minesController.getAllMines);
module.exports = minesRouter;