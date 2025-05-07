const mongoose = require('mongoose');
const avaitorSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    round_id: { type: String },
    multiplier: { type: String },
    betAmt: { type: Number },
    winningAmt: { type: Number },
    crash: { type: String },
    isWin: { type: String, default: "" },
    // balanceAfterGame: { type: Number, required: true },

}, { timestamps: true });
const avaitorModel = mongoose.model('avaitor', avaitorSchema);
module.exports = avaitorModel;