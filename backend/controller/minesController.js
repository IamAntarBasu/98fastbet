const Mines = require('../models/mines'); // Adjust the path based on your project structure
const User_Wallet = require('../models/Wallet');

// Create a new game record
exports.createGameRecord = async (req, res) => {
    try {
        const { user, betAmt, round_id } = req.body;
        console.log(req.body)
        if (!user) {
            return res.status(400).json({ message: 'User ID and balance after game are required.' });
        }
        const wallet = await User_Wallet.findOne({ user });
        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' });
        }
        if (wallet.balance < betAmt) {
            return res.status(400).json({ message: 'Please Add amount in your wallet' });
        }
        // if (isWin === "Won") {
        //     // profit += profit;
        //     wallet.balance = Number((wallet.balance + winningAmt).toFixed(2));  // Add winnings and keep only 1 decimal place
        // } else {
        wallet.balance = Number((wallet.balance - betAmt).toFixed(2));  // Deduct bet amount (loss) and keep only 1 decimal place
        // }

        await wallet.save();

        const newGame = new Mines({
            user,
            round_id,
            betAmt,
            // winningAmt,
            // lossAmt,
            // isWin,
            // balanceAfterGame,
        });


        const savedGame = await newGame.save();
        res.status(201).json(savedGame);
    } catch (error) {
        console.error('Error creating game record:', error);
        res.status(500).json({ message: 'Server error while creating game record.' });
    }
};
exports.updateGameRecord = async (req, res) => {
    try {
        const { user, betAmt, winningAmt, lossAmt, isWin, balanceAfterGame, round_id } = req.body;
        const GameById = await Mines.findOne({ round_id: round_id });
        if (!GameById) {
            return res.status(500).json({ message: 'Invalid Round Id.' });
        }
        if (!user || balanceAfterGame === undefined) {
            return res.status(400).json({ message: 'User ID and balance after game are required.' });
        }
        const wallet = await User_Wallet.findOne({ user });
        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' });
        }
        // if (wallet.balance < betAmt) {
        //     return res.status(400).json({ message: 'Please Add amount in your wallet' });
        // }
        if (isWin === "Won") {
            // profit += profit;
            wallet.balance = Number((wallet.balance + winningAmt).toFixed(2));  // Add winnings and keep only 1 decimal place
        }

        await wallet.save();
        GameById.winningAmt = winningAmt,
            GameById.lossAmt = lossAmt,
            GameById.isWin = isWin,
            GameById.balanceAfterGame = balanceAfterGame

        // const newGame = new Mines({
        //     // user,
        //     // betAmt,
        //     winningAmt,
        //     lossAmt,
        //     isWin,
        //     balanceAfterGame,
        // });

        const savedGame = await GameById.save();
        res.status(201).json(savedGame);
    } catch (error) {
        console.error('Error creating game record:', error);
        res.status(500).json({ message: 'Server error while creating game record.' });
    }
};

// Get all game records for a user
exports.getUserGameHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        // console.log("ok", userId)
        const gameHistory = await Mines.find({ user: userId }).sort({ createdAt: -1 });
        res.status(200).json(gameHistory);
    } catch (error) {
        console.error('Error fetching game history:', error);
        res.status(500).json({ message: 'Server error while fetching game history.' });
    }
};

exports.getAllGames = async (req, res) => {
    try {
        const gameHistory = await Mines.find().sort({ createdAt: -1 });
        res.status(200).json(gameHistory);
    } catch (error) {
        console.error('Error fetching game history:', error);
        res.status(500).json({ message: 'Server error while fetching game history.' });
    }
};

// Get a single game record by ID
exports.getGameById = async (req, res) => {
    try {
        const { id } = req.params;

        const game = await Mines.findOne({round_id: id});
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

        const deletedGame = await Mines.findByIdAndDelete(id);
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
        await Mines.deleteMany({});
        res.status(200).json({ message: "Game reset successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getAllMines = async (req, res) => {
    try {
        const bets = await Mines.find().populate('user', 'username');
        res.status(200).json(bets);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
  };
  