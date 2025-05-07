// const Aviator = require('../models/avaitorModel'); // Adjust the path based on your project structure
// const User_Wallet = require('../models/Wallet');


// // Create a new Aviator game record
// exports.createGameRecord = async (req, res) => {
//     try {
//         const { user, multiplier, betAmt, winningAmt, crash, isWin } = req.body;
//         // console.log(isWin, winningAmt, "winningAmt")
//         if (!user) {
//             return res.status(400).json({ message: 'User ID is required.' });
//         }

//         const wallet = await User_Wallet.findOne({ user });
//         if (!wallet) {
//             return res.status(404).json({ message: 'Wallet not found' });
//         }

//         if (wallet.balance < betAmt) {
//             return res.status(400).json({ message: 'Insufficient funds. Please add money to your wallet.' });
//         }


//         const lastGame = await Aviator.findOne().sort({ createdAt: -1 }); // Get the last game entry
//         let round_id = "R0001"; // Default for first entry

//         if (lastGame && lastGame.round_id) {
//             const lastRoundNumber = parseInt(lastGame.round_id.substring(1)); // Extract numeric part
//             const newRoundNumber = lastRoundNumber + 1;
//             round_id = `R${newRoundNumber.toString().padStart(4, '0')}`; // Format it back to RXXXX
//         }

//         if (isWin === "Won") {
//             wallet.balance = Number((wallet.balance + winningAmt).toFixed(2)); // Add winnings
//         } else {
//             wallet.balance = Number((wallet.balance - betAmt).toFixed(2)); // Deduct bet amount
//         }

//         await wallet.save();

//         const newGame = new Aviator({
//             user,
//             round_id,  // Automatically generated round ID
//             multiplier,
//             betAmt,
//             winningAmt,
//             crash,
//             isWin
//         });

//         const savedGame = await newGame.save();
//         res.status(201).json(savedGame);
//     } catch (error) {
//         console.error('Error creating game record:', error);
//         res.status(500).json({ message: 'Server error while creating game record.' });
//     }
// };


// // Get all game records for a specific user
// exports.getUserGameHistory = async (req, res) => {
//     try {
//         const { userId } = req.params;
//         const gameHistory = await Aviator.find({ user: userId }).sort({ createdAt: -1 });
//         if (!gameHistory) {
//             return res.status(200).json([]);
//         } else {
//             res.status(200).json(gameHistory);
//         }
//         // res.status(200).json(gameHistory);
//     } catch (error) {
//         console.error('Error fetching game history:', error);
//         res.status(500).json({ message: 'Server error while fetching game history.' });
//     }
// };

// // Get all Aviator game records
// exports.getAllGames = async (req, res) => {
//     try {
//         const gameHistory = await Aviator.find().sort({ createdAt: -1 });
//         res.status(200).json(gameHistory);
//     } catch (error) {
//         console.error('Error fetching game history:', error);
//         res.status(500).json({ message: 'Server error while fetching game history.' });
//     }
// };

// // Get a single game record by ID
// exports.getGameById = async (req, res) => {
//     try {
//         const { id } = req.params;

//         const game = await Aviator.findById(id);
//         if (!game) {
//             return res.status(404).json({ message: 'Game record not found.' });
//         }

//         res.status(200).json(game);
//     } catch (error) {
//         console.error('Error fetching game record:', error);
//         res.status(500).json({ message: 'Server error while fetching game record.' });
//     }
// };

// // Delete a game record
// exports.deleteGameRecord = async (req, res) => {
//     try {
//         const { id } = req.params;

//         const deletedGame = await Aviator.findByIdAndDelete(id);
//         if (!deletedGame) {
//             return res.status(404).json({ message: 'Game record not found.' });
//         }

//         res.status(200).json({ message: 'Game record deleted successfully.' });
//     } catch (error) {
//         console.error('Error deleting game record:', error);
//         res.status(500).json({ message: 'Server error while deleting game record.' });
//     }
// };

const avaitorModel = require('../models/avaitorModel');
const Aviator = require('../models/avaitorModel'); // Adjust the path based on your project structure
const User_Wallet = require('../models/Wallet');


// Create a new Aviator game record
exports.createGameRecord = async (req, res) => {
    try {
        const { user, betAmt, round_id } = req.body;
        // console.log(req.body)
        // console.log(isWin, winningAmt, "winningAmt")
        if (!user) {
            return res.status(400).json({ message: 'User ID is required.' });
        }

        const wallet = await User_Wallet.findOne({ user: user });
        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' });
        }

        if (wallet.balance < betAmt) {
            return res.status(400).json({ message: 'Insufficient funds. Please add money to your wallet.' });
        }


        // const lastGame = await Aviator.findOne().sort({ createdAt: -1 });
        // let round_id = "AV50001";

        // if (lastGame && lastGame.round_id) {
        //     const lastRoundNumber = parseInt(lastGame.round_id.substring(1)); // Extract numeric part
        //     const newRoundNumber = lastRoundNumber + 1;
        //     round_id = `AV${newRoundNumber.toString().padStart(4, '0')}`;
        // }
        wallet.balance -= betAmt
        await wallet.save();

        const newGame = new Aviator({
            user,
            round_id:round_id,
            betAmt,
        });

        const savedGame = await newGame.save();
        res.status(201).json(savedGame);
    } catch (error) {
        console.error('Error creating game record:', error);
        res.status(500).json({ message: 'Server error while creating game record.' });
    }
};
// Create a new Aviator game record
exports.updateGameRecord = async (req, res) => {
    try {
        const { user, multiplier, betAmt, winningAmt, crash, isWin, round_id } = req.body;
        console.log(req.body)
        const existingGame = await Aviator.findOne({ round_id: round_id })
        if (!existingGame) {
            res.status(500).json({ message: 'Invalid Round Id.' });

        } else {
            const wallet = await User_Wallet.findOne({ user });
            if (!wallet) {
                return res.status(404).json({ message: 'Wallet not found' });
            }
            if (isWin === "Won") {
                wallet.balance = Number((wallet.balance + winningAmt).toFixed(2));
            }

            await wallet.save();

            existingGame.isWin = isWin,
                existingGame.winningAmt = winningAmt
            existingGame.multiplier = multiplier,
                existingGame.crash = crash,

                await existingGame.save();
            res.status(201).json(existingGame);
        }
    } catch (error) {
        console.error('Error creating game record:', error);
        res.status(500).json({ message: 'Server error while creating game record.' });
    }
};


// Get all game records for a specific user
exports.getUserGameHistory = async (req, res) => {
    try {

        const { userId } = req.params;
        console.log(userId, "userIdhistory")
        const gameHistory = await Aviator.find({ user: userId }).sort({ createdAt: -1 });
        if (!gameHistory) {
            return res.status(200).json([]);
        } else {
            res.status(200).json(gameHistory);
        }
        // res.status(200).json(gameHistory);
    } catch (error) {
        console.error('Error fetching game history:', error);
        res.status(500).json(error.message);
    }
};

// Get all Aviator game records
exports.getAllGames = async (req, res) => {
    try {
        const gameHistory = await Aviator.find().sort({ createdAt: -1 });
        res.status(200).json(gameHistory);
    } catch (error) {
        console.error('Error fetching game history:', error);
        res.status(500).json({ message: 'Server error while fetching game history.' });
    }
};

exports.getLastRoundId = async (req, res) => {
    try {
        const LastRoundId = await Aviator.findOne().sort({ createdAt: -1 });
        // console.log(LastRoundId, "lastId")
       
            res.status(200).json(LastRoundId);
        // }
    } catch (error) {
        console.error('Error fetching game history:', error);
        res.status(500).json({ message: 'Server error while fetching game history.' });
    }
};

// Get a single game record by ID
exports.getGameById = async (req, res) => {
    try {
        const { id } = req.params;

        const game = await Aviator.findById(id);
        if (!game) {
            return res.status(404).json({ message: 'Game record not found.' });
        }

        res.status(200).json(game);
    } catch (error) {
        console.error('Error fetching game record:', error);
        res.status(500).json({ message: 'Server error while fetching game record.' });
    }
};

// Delete a game record
exports.deleteGameRecord = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedGame = await Aviator.findByIdAndDelete(id);
        if (!deletedGame) {
            return res.status(404).json({ message: 'Game record not found.' });
        }

        res.status(200).json({ message: 'Game record deleted successfully.' });
    } catch (error) {
        console.error('Error deleting game record:', error);
        res.status(500).json({ message: 'Server error while deleting game record.' });
    }
};

exports.resetAll = async (req, res) => {
    try {
        await Aviator.deleteMany({});
        res.status(200).json({ message: "Game reset successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};