

// const express = require("express");
const CardModel = require("../models/cardsModel");
const Card = require("../models/cardsModel");
// const CardModel = require("../models/cricket/cardsModel");
const { default: mongoose } = require("mongoose");
const { findById } = require("../models/UserSignUp");
const WinnerModel = require("../models/winnerModel");
const User = require("../models/UserSignUp");
const User_Wallet = require("../models/Wallet");



const selectCard = async (req, res) => {
    try {
        const { cardId } = req.params;
        const { player1, player2, user, points, profit, totalRuns } = req.body;

        // ✅ Validate input
        if (!player1 || !player2 || !user || !user.email || points == null) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        let findcard = await CardModel.findById(cardId);
        if (!findcard) {
            return res.status(404).json({ message: "Card document not found" });
        }

        // ✅ Fetch user details
        let userData = await User.findOne({ email: user.email });
        if (!userData) {
            return res.status(404).json({ message: "User not found in the database." });
        }

        const Wallet = await User_Wallet.findOne({ user: userData._id });
        if (!Wallet) {
            return res.status(400).json({ message: "User wallet not found." });
        }

        // ✅ Ensure points is a valid number
        if (typeof points !== "number" || isNaN(points) || points <= 0) {
            return res.status(400).json({ message: "Invalid bet amount." });
        }

        // ✅ Check if user already exists in **ANY** card
        let findAllCards = await Card.find();
        const emailExists = findAllCards.some(obj => obj.user.includes(user.email));
        if (emailExists) {
            return res.status(409).json({ message: "User has already selected a card. Cannot select another one." });
        }

        // ✅ Add user email to `findcard.user` only if not already present
        if (!findcard.user.includes(user.email)) {
            findcard.user.push(user.email);
        } else {
            return res.status(409).json({ message: "User already in card, no update needed." });
        }

        // ✅ Ensure the user has enough balance
        if (Wallet.balance < points) {
            return res.status(400).json({ message: "Insufficient wallet balance." });
        }

        // ✅ Deduct bet points from the user's wallet
        await User_Wallet.findOneAndUpdate(
            { user: userData._id },
            { $inc: { balance: -points } }, // Deduct points from wallet balance
            { new: true }
        );

        // ✅ Add user details to `users` array in the card
        findcard.users.push({
            username: user.username,
            email: user.email,
            walletBalance: Wallet.balance - points, // Updated wallet balance
            betpoints: points,
            profit: profit || 0
        });

        // ✅ Find first available card slot
        let selectedCard = findcard.cards.find(card => !card.player1 || !card.player2);
        if (!selectedCard) {
            selectedCard = { player1: "", player2: "", totalRuns: 0, isWinner: false, cardUser: [] };
            findcard.cards.push(selectedCard);
        }

        // ✅ Add user email to `cardUser`
        if (!selectedCard.cardUser.includes(user.email)) {
            selectedCard.cardUser.push(user.email);
        }

        // ✅ Assign players and total runs
        selectedCard.player1 = player1 || selectedCard.player1;
        selectedCard.player2 = player2 || selectedCard.player2;
        selectedCard.totalRuns = totalRuns || selectedCard.totalRuns;

        // ✅ Save updated data
        await findcard.save();

        res.status(200).json({ message: "Card selected and wallet updated.", updatedCard: findcard });

    } catch (error) {
        console.error("❌ Error updating card:", error);
        res.status(500).json({ message: error.message });
    }
};

// Get the current card state
const getCards = async (req, res) => {
    try {
        let cards = await Card.find(); // Fetch all cards

        // Ensure there are at least 3 cards
        if (cards.length < 3) {
            const newCards = [];
            for (let i = cards.length; i < 3; i++) {
                newCards.push(new Card({
                    cards: [{
                        "player1": "",
                        "player2": "",
                        "totalRuns": 0,
                        "isWinner": false,

                        "_id": new mongoose.Types.ObjectId()
                    }]
                }))
            };
            await Card.insertMany(newCards);
            cards = await Card.find();
        }

        res.status(200).json(cards);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Reset the game
const resetCards = async (req, res) => {
    try {
        await Card.deleteMany({});
        res.status(200).json({ message: "Game reset successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const updateWinner = async (req, res) => {
    try {
        const { cardId } = req.params;
        console.log("🎯 Received Card ID:", cardId);

        // ✅ Step 1: Reset `isWinner: false` for all cards and users
        await Card.updateMany({}, {
            $set: {
                "cards.$[].isWinner": false,
                "users.$[].isWinner": false
            }
        });
        const winners = await WinnerModel.find()
            .populate('users')
        console.log(winners)
        // ✅ Step 2: Update the specific winning card
        const updatedCard = await Card.findOneAndUpdate(
            { "cards._id": cardId },
            { $set: { "cards.$.isWinner": true } },
            { new: true, runValidators: true }
        );

        if (!updatedCard) {
            console.log("❌ Winning card not found in database.");
            return res.status(404).json({ message: "Winning card not found" });
        }

        // ✅ Step 3: Get the winning card details
        const winningCard = updatedCard.cards.find(card => card._id.toString() === cardId);
        if (!winningCard) {
            console.log("❌ Winning card not found in the document.");
            return res.status(404).json({ message: "Winning card not found in the document" });
        }

        const winningUsersEmails = winningCard.cardUser; // Get all winning user emails
        console.log("🏆 Winning Users Emails:", winningUsersEmails);

        // ✅ Step 4: Fetch users who played on the winning card
        const winningUsers = await User.find({ email: { $in: winningUsersEmails } });

        if (winningUsers.length === 0) {
            console.log("❌ No winning users found in the database.");
            return res.status(404).json({ message: "No winning users found" });
        }

        console.log("✅ Winning Users:", winningUsers);

        // ✅ Step 5: Fetch wallet details of winning users
        const userWallets = await User_Wallet.find({ user: { $in: winningUsers.map(user => user._id) } });

        console.log("✅ User Wallets Before Update:", userWallets);

        // ✅ Step 6: Update Wallet Balance for Winners
        for (const user of winningUsers) {
            const profitAmount = user.profit || 0;

            if (profitAmount > 0) {
                // ✅ Update User Wallet in `User_Wallet`
                const userWallet = userWallets.find(wallet => wallet.user.toString() === user._id.toString());

                if (userWallet) {
                    await User_Wallet.findOneAndUpdate(
                        { user: user._id },
                        { $inc: { balance: profitAmount } }, // Add profit to wallet balance
                        { new: true }
                    );
                    console.log(`✅ Wallet Updated for ${user.email}: +${profitAmount}`);
                } else {
                    console.log(`⚠️ No Wallet Found for ${user.email}, skipping update.`);
                }

                // ✅ Also update `walletBalance` in `User` model
                await User.findOneAndUpdate(
                    { _id: user._id },
                    { $inc: { walletBalance: profitAmount } }, // Add profit to walletBalance
                    { new: true }
                );

                console.log(`💰 User Wallet Balance Updated: ${user.email} +${profitAmount}`);
            }
        }

        console.log("✅ Wallet balances updated successfully for all winners.");

        // ✅ Step 7: Create a new Winner entry in the database
        // const totalProfit = winningUsers.reduce((sum, user) => sum + user.profit, 0);
        const newWinner = new WinnerModel({
            cardId,
            users: winningUsers.map(user => ({
                UserId: user._id, // Store User ID
                username: user.username,
                email: user.email,
                profit: user.profit,
                walletBalance: user.walletBalance
            })),
            // totalProfit
        });

        await newWinner.save();
        // The save method is being incorrectly used on the model itself instead of an instance
        // Removing the incorrect call to `User_Wallet.save()`

        console.log("✅ Winner entry created successfully:", newWinner);
        res.status(200).json({ updatedCard, winnerEntry: newWinner });

    } catch (error) {
        console.error("❌ Error updating winner:", error);
        res.status(500).json({ message: error.message });
    }
};


const placeBet = async (req, res) => {
    try {
        const { cardId } = req.params;
        const { user, points } = req.body;

        console.log("Placing Bet ->", { cardId, user, points });

        if (!user || !points || !cardId) {
            return res.status(400).json({ message: "User, points, and cardId are required." });
        }

        // ✅ Check if the card exists
        const findCard = await Card.findOne({ "cards._id": cardId });

        if (!findCard) {
            return res.status(404).json({ message: "Card not found." });
        }

        // ✅ Use `$[elem]` to update the specific card inside `cards`
        const updatedCard = await Card.findOneAndUpdate(
            { "cards._id": cardId },
            {
                $push: { "cards.$[elem].bets": { user, points, placedAt: new Date() } }
            },
            {
                new: true,
                arrayFilters: [{ "elem._id": cardId }], // 👈 Ensures only the matched card updates
                runValidators: true
            }
        );

        if (!updatedCard) {
            return res.status(404).json({ message: "Failed to update the card with the bet." });
        }

        console.log("✅ Bet placed successfully:", updatedCard);
        res.status(200).json({ message: "Bet placed successfully!", card: updatedCard });
    } catch (error) {
        console.error("❌ Error placing bet:", error);
        res.status(500).json({ message: "Internal server error.", error: error.message });
    }
};


const getCardMatchName = async (req, res) => {
    try {
        const { matchName } = req.params;

        // Find existing cards for the given match
        let cards = await Card.find({ matchName: matchName });
     

        // If there are fewer than 3 cards, create the missing ones
        if (cards.length < 3) {
            console.log(`Only ${cards.length} cards found for ${matchName}. Creating ${3 - cards.length} new cards...`);

            const newCards = [];
            for (let i = cards.length; i < 3; i++) {
                newCards.push({
                    matchName: matchName,
                    cards: [
                        {
                            player1: "",
                            player2: "",
                            totalRuns: 0,
                            isWinner: false,
                            _id: new mongoose.Types.ObjectId(),
                            cardUser: []
                        }
                    ]
                });
            }

            // Insert all missing cards at once
            await Card.insertMany(newCards);
            console.log("New cards successfully created!");

            // Fetch again after inserting missing cards
            cards = await Card.find({ matchName: matchName });
        }

        res.status(200).json(cards);
    } catch (error) {
        console.error("Error in getCardMatchName:", error);
        res.status(500).json({ message: error.message });
    }
};



module.exports = { selectCard, getCards, resetCards, updateWinner, placeBet ,getCardMatchName};