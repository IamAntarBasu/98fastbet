// const mongoose = require('mongoose');
// const CardSchema = new mongoose.Schema({
//     user: [{ type: String }], // List of users associated with the card
//     users: [{
//         // userId : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//         username: { type: String },
//         email: { type: String },
//         walletBalance: { type: Number},
//         betpoints: { type: Number, default: 0 },
//         profit: { type: Number, default: 0 },
//         isWinner: { type: Boolean, default: false }
//     }],
//     cards: [
//         {
//             player1: { type: String, default: "player1" },
//             player2: { type: String, default: "player1" },
//             totalRuns: { type: Number, default: 0 },
//             isWinner: { type: Boolean, default: false },
//             cardUser: [{ type: String }], // Users who played on this card           
//         }
//     ]
// }, { timestamps: true });

// const CardModel = mongoose.model('Card', CardSchema);
// module.exports = CardModel;


const mongoose = require('mongoose');
const CardSchema = new mongoose.Schema({
    user: [{ type: String }], // List of users associated with the card
matchName:{type:String},
    users: [{
        // userId : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        username: { type: String },
        email: { type: String },
        walletBalance: { type: Number},
        betpoints: { type: Number, default: 0 },
        profit: { type: Number, default: 0 },
        isWinner: { type: Boolean, default: false }
    }],
    cards: [
        {
            player1: { type: String, default: "player1" },
            player2: { type: String, default: "player1" },
            totalRuns: { type: Number, default: 0 },
            isWinner: { type: Boolean, default: false },
            cardUser: [{ type: String }], // Users who played on this card           
        }
    ]
}, { timestamps: true });

const CardModel = mongoose.model('Card', CardSchema);
module.exports = CardModel;