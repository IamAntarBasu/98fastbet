// const express = require('express');
// const papuController = require('../controller/pappucontroller');
// const papuRouter = express.Router();

// papuRouter.put('/titli/updatebets', papuController.updateBet);
// papuRouter.post('/titli/new/bets', papuController.postBet);
// papuRouter.get('/bets', papuController.getBets);
// papuRouter.get('/bets/:id', papuController.getBetById);
// papuRouter.get('/pappu/bets/:userId', papuController.getBetByUserId);
// papuRouter.put('/bets/:id', papuController.updateWinnings);
// papuRouter.delete('/titli/reset/bets', papuController.resetAll);
// papuRouter.delete('/bets/:id', papuController.deleteBet);
// papuRouter.get("/admin/getPapus", papuController.getBets);
// module.exports = papuRouter;


const express = require('express');
const papuController = require('../controller/pappucontroller');
const papuRouter = express.Router();

papuRouter.put('/titli/updatebets', papuController.updateBet);
papuRouter.post('/titli/new/bets', papuController.postBet);
papuRouter.get('/bets', papuController.getBets);
papuRouter.get('/bets/:id', papuController.getBetById);
papuRouter.get('/pappu/bets/:userId', papuController.getBetByUserId);
papuRouter.get('/titli/bets/:gameId', papuController.getBetsByGameId);
papuRouter.put('/bets/:id', papuController.updateWinnings);
papuRouter.delete('/titli/reset/bets', papuController.resetAll);
papuRouter.delete('/bets/:id', papuController.deleteBet);
papuRouter.get("/admin/getPapus", papuController.getBets);
module.exports = papuRouter;
