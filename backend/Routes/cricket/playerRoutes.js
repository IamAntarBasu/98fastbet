// const express = require('express');
// const { addPlayers, getAllPlayers, getPlayerById, getAdminplyers, updateAdminPlayer, deleteAdminPlayer, getAllData } = require('../../controller/playerController');
// const { selectCard, getCards, resetCards } = require('../../controller/cardsController');
// const playerRouter = express.Router();
// // Define routes
// playerRouter.post("/api/admin/players", addPlayers);
// playerRouter.get("/api/admin/getplayers", getAdminplyers);
// playerRouter.put("/api/admin/getplayers/:id", updateAdminPlayer);
// playerRouter.delete("/api/admin/deleteplayers/:id", deleteAdminPlayer);
// playerRouter.get('/api/players/:playerId', getPlayerById);
// playerRouter.get('/api/players', getAllPlayers);

// playerRouter.get("/api/cards", getCards);
// playerRouter.put("/api/cards/select/:cardId", selectCard);
// playerRouter.delete("/api/cards/reset", resetCards);
// playerRouter.get('/api/sports-data-2', getAllData);

// module.exports = playerRouter;



const express = require('express');
const { addPlayers, getAllPlayers, getPlayerById ,getAllData,getAdminplyers,updateAdminPlayer,deleteAdminPlayer} = require('../../controller/playerController');
// const { selectCard, getCards, resetCards, updateWinner, placeBet } = require('../../controller/cardsController');
const { selectCard, getCards, resetCards, updateWinner, placeBet, getCardMatchName } = require('../../controller/cardsController');
const playerRouter = express.Router();
// const winnerController = require('../../controller/winnerController');

// Define routes
// playerRouter.post('/api/players', createPlayer);
playerRouter.get('/api/players/:playerId', getPlayerById);
playerRouter.get('/api/players', getAllPlayers);

playerRouter.get("/api/cards", getCards);
playerRouter.put("/api/cards/select/:cardId", selectCard);
playerRouter.delete("/api/cards/reset", resetCards);
playerRouter.put("/api/cards/winner/:cardId", updateWinner);
playerRouter.put("/api/cards/bet/:cardId", placeBet);

// router.get('/winners', getAllWinners);

// playerRouter.get('/winners', winnerController.getAllWinners);  // Create a winner
// playerRouter.get('/allwinner', winnerController.getAllWinners);       // Get all winners
// playerRouter.get('/:id', winnerController.getWinnerById);    // Get single winner
// playerRouter.delete('/:id', winnerController.deleteWinner);  // Delete a winner
playerRouter.get('/api/sports-data-2', getAllData);
playerRouter.post("/api/admin/players", addPlayers);
playerRouter.get("/api/admin/getplayers", getAdminplyers);
playerRouter.put("/api/admin/getplayers/:id", updateAdminPlayer);
playerRouter.delete("/api/admin/deleteplayers/:id", deleteAdminPlayer);
playerRouter.get("/api/cards/:matchName", getCardMatchName);
module.exports = playerRouter;