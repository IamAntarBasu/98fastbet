const WinnerModel = require('../models/winnerModel');

// ✅ Get all winners
exports.getAllWinners = async (req, res) => {
    try {
        const winners = await WinnerModel.find();
        if (!winners || winners.length === 0) {
            return res.status(404).json({ message: "No winners found" });
        }
        res.status(200).json(winners);
    } catch (error) {
        console.error("Error fetching winners:", error);
        res.status(500).json({ message: error.message });
    }
};

// ✅ Get winners for a specific cardId
exports.getWinnerByCardId = async (req, res) => {
    try {
        const { cardId } = req.params;
        const winner = await WinnerModel.findOne({ cardId });

        if (!winner) {
            return res.status(404).json({ message: "No winner found for this card ID" });
        }
        res.status(200).json(winner);
    } catch (error) {
        console.error("Error fetching winner by cardId:", error);
        res.status(500).json({ message: error.message });
    }
};