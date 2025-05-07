const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    wallet: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' },
    history: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bet' }],
    userNo:{ type: String, required: true },
}, { timestamps: true });
const User = mongoose.model('User', userSchema);
module.exports = User;
