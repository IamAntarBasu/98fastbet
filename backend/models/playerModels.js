const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    playerName: { type: String, required: true },
    score: { type: Number, required: true },
}, { timestamps: true });


const playerModel = mongoose.model('player', playerSchema);
module.exports = playerModel;