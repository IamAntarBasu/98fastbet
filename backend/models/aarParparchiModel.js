const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
    matchName: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userArray: [],
    betpoints: { type: Number, default: 0 },
    profit: { type: Number, default: 0 },
    card: { type: mongoose.Schema.Types.ObjectId, ref: 'Card' },
    CardData: {},
    result: { type: String, },
    playedAt: { type: Date, default: Date.now } // Timestamp for the match
    //     }
    // ]
}, { timestamps: true });

const MatchModel = mongoose.model('Match', MatchSchema);
module.exports = MatchModel;
// const mongoose = require('mongoose');

// const MatchSchema = new mongoose.Schema({
//     matchName: { type: String },
//     user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//     betpoints: { type: Number, default: 0 },
//     profit: { type: Number, default: 0 },
//     card1: {
//         cardIndex:{type:Number, default:1},
//         player1: { type: String, default: "player1" },
//         player2: { type: String, default: "player1" },
//         totalRuns: { type: Number, default: 0 },
//         isWinner: { type: Boolean, default: false },
//         cardUser: [{ type: String }], // Users who played on this card
//     },
//     card1: {
//         cardIndex:{type:Number, default:2},
//         player1: { type: String, default: "player1" },
//         player2: { type: String, default: "player1" },
//         totalRuns: { type: Number, default: 0 },
//         isWinner: { type: Boolean, default: false },
//         cardUser: [{ type: String }], // Users who played on this card
//     },
//     card1: {
//         // cardIndex:{type:Number, default:3},
//         player1: { type: String, default: "" },
//         player2: { type: String, default: "player1" },
//         totalRuns: { type: Number, default: 0 },
//         isWinner: { type: Boolean, default: false },
//         cardUser: [{ type: String }], // Users who played on this card
//     },
//     // CardData: {},
//     result: { type: String, },
//     playedAt: { type: Date, default: Date.now } // Timestamp for the match
//     //     }
//     // ]
// }, { timestamps: true });

// const MatchModel = mongoose.model('Match', MatchSchema);
// module.exports = MatchModel;