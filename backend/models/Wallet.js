// const mongoose = require('mongoose');
// const walletSchema = new mongoose.Schema({
//     user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     balance: { type: Number, required: true, default: 15000 },
// }, { timestamps: true });
// const User_Wallet = mongoose.model('Wallet', walletSchema);
// module.exports = User_Wallet;

const mongoose = require('mongoose');
const walletSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    balance: { type: Number, required: true, default: 0 },
    exposureBalance: { type: Number, default: 0 },
    LKexposure: { type: Number, default: 0 },
    YNexposure: { type: Number, default: 0 },
    teamAProfit: { type: Number, default: 0 },
    teamBProfit: { type: Number, default: 0 },

}, { timestamps: true });
const User_Wallet = mongoose.model('Wallet', walletSchema);
module.exports = User_Wallet;