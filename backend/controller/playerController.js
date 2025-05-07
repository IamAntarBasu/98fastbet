const playerModel = require("../models/playerModels");

// Create a new player
const addPlayers = async (req, res) => {
    try {
        if (!Array.isArray(req.body) || req.body.length === 0) {
            return res.status(400).json({ message: "Players data must be a non-empty array." });
        }

        // Validate each player object
        for (const player of req.body) {
            if (!player.playerName || player.score === undefined) {
                return res.status(400).json({ message: "Each player must have a name and score." });
            }
        }

        // Insert players into the database
        const players = await playerModel.insertMany(req.body);
        res.status(201).json({ message: "Players added successfully!", players });

    } catch (error) {
        res.status(500).json({ message: "Error adding players", error: error.message });
    }
};

// Get all players
const getAllPlayers = async (req, res) => {
    try {
        const players = await playerModel.find();
        res.status(200).json(players);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a player by ID
const getPlayerById = async (req, res) => {
    try {
        const player = await playerModel.findById(req.params.id);
        if (!player) {
            return res.status(404).json({ message: "Player not found" });
        }
        res.status(200).json(player);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



const getAdminplyers = async (req, res) => {
    try {
        const players = await playerModel.find();
        res.status(200).json(players);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const updateAdminPlayer = async (req, res) => {
    try {
        const { playerName, score } = req.body;
        const playerId = req.params.id;

        if (!playerId) {
            return res.status(400).json({ message: "Player ID is required" });
        }

        const updatedPlayer = await playerModel.findByIdAndUpdate(
            playerId,
            { playerName, score },
            { new: true } // Return the updated document
        );

        if (!updatedPlayer) {
            return res.status(404).json({ message: "Player not found" });
        }

        res.status(200).json(updatedPlayer);
    } catch (error) {
        res.status(500).json({ message: "Error updating player", error });
    }
};



const deleteAdminPlayer = async (req, res) => {
    try {
        await playerModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Player deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting player", error });
    }
};


const axios = require("axios");
const getAllData = async (req, res) => {
    try {

        const url2 = `https://api.cricapi.com/v1/currentMatches?apikey=1820f0cd-e271-4df5-86bd-ee8b96af4b1b&offset=0`;
        const response = await axios.get(url2);
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching data:", error.message);
        res.status(500).json({ error: "Failed to fetch sports data" });
    }
};

module.exports = { addPlayers, getAllPlayers, getPlayerById, getAdminplyers, updateAdminPlayer, deleteAdminPlayer, getAllData };