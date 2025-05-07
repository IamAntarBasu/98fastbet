const mongoose = require('mongoose');
const User = require('./UserSignUp');

const winnerSchema = new mongoose.Schema(
    {
        cardId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Card',
            required: true
        },
        users: [
            {
                userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // ✅ Fixed: Use lowercase "u"
                username: { type: String, required: true },
                email: { type: String, required: true },
                profit: { type: Number, default: 0 }
            }
        ],
        totalProfit: { type: Number, default: 0 } // Total profit of all winning users
    },
    { timestamps: true }
);

const WinnerModel = mongoose.model('Winner', winnerSchema);
module.exports = WinnerModel;