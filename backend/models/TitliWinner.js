const mongoose = require('mongoose');
const winnerTitliSchema = new mongoose.Schema({
    // gameId: { type: String },
    randomImage: { type: String },
    Images:[],
    // selectedCard: [],
}, { timestamps: true });
const winnerTitliModel = mongoose.model('titli-random-images', winnerTitliSchema);
module.exports = winnerTitliModel;