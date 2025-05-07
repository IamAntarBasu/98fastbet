// const express = require("express");
// const router = express.Router();
// const titliWinnerController = require("../controller/titliWinnerController");

// // Routes to handle images and their status
// // router.post("/titli/random-image", titliWinnerController.postImage);
// router.post("/titli/update-random-image", titliWinnerController.updateRandomImage);
// router.get("/titli/get-random-image", titliWinnerController.getRandomImage);
// // router.get("/titli/get-all-images", titliWinnerController.getAllImages);
// router.get("/titli/get-all-random-images", titliWinnerController.getAllRandomImages);
// router.get("/titli/get-all-images-from-array", titliWinnerController.getAllImagesFromArray);
// router.get("/titli/get-all-allow-images-from-array", titliWinnerController.getRandomAllowedImageFromArray);
// router.put("/titli/update-is-allowed", titliWinnerController.updateIsAllowed);

// module.exports = router;
// const express = require("express");
// const router = express.Router();
// const titliWinnerController = require("../controller/titliWinnerController");

// // Routes to handle images and their status
// // router.post("/titli/random-image", titliWinnerController.postImage);
// router.post("/titli/update-random-image", titliWinnerController.updateRandomImage);
// router.get("/titli/get-random-image", titliWinnerController.getRandomImage);
// // router.get("/titli/get-all-images", titliWinnerController.getAllImages);
// router.get("/titli/get-all-random-images", titliWinnerController.getAllRandomImages);
// router.get("/titli/get-all-images-from-array", titliWinnerController.getAllImagesFromArray);
// router.get("/titli/get-all-allow-images-from-array", titliWinnerController.getRandomAllowedImageFromArray);
// router.put("/titli/update-is-allowed", titliWinnerController.updateIsAllowed);

// // New routes for bet handling with synchronized timing
// router.post("/titli/new/bets", titliWinnerController.placeNewBet);
// router.put("/titli/updatebets", titliWinnerController.updateBetResult);
// router.get("/titli/game-state", titliWinnerController.getCurrentGameState);

// module.exports = router;
const express = require("express");
const router = express.Router();
const titliWinnerController = require("../controller/titliWinnerController");

// Routes to handle images and their status
// router.post("/titli/random-image", titliWinnerController.postImage);
router.post("/titli/update-random-image", titliWinnerController.updateRandomImage);
router.get("/titli/get-random-image", titliWinnerController.getRandomImage);
// router.get("/titli/get-all-images", titliWinnerController.getAllImages);
router.get("/titli/get-all-random-images", titliWinnerController.getAllRandomImages);
router.get("/titli/get-all-images-from-array", titliWinnerController.getAllImagesFromArray);
router.get("/titli/get-all-allow-images-from-array", titliWinnerController.getRandomAllowedImageFromArray);
router.put("/titli/update-is-allowed", titliWinnerController.updateIsAllowed);
router.post("/titli/reset-all-images", titliWinnerController.resetAllImagesToAllowed);

// New routes for bet handling with synchronized timing
router.post("/titli/new/bets", titliWinnerController.placeNewBet);
router.put("/titli/updatebets", titliWinnerController.updateBetResult);
router.get("/titli/game-state", titliWinnerController.getCurrentGameState);

// Admin control for forcing a specific winner
router.post("/titli/set-winner", titliWinnerController.setWinner);

// Force start a new game round (admin only)
router.post("/titli/force-new-round", titliWinnerController.forceNewRound);

// Game health check endpoint
router.get("/titli/health", titliWinnerController.checkGameHealth);

module.exports = router;
