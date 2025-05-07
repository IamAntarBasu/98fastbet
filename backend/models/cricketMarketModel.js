// const mongoose = require('mongoose');

// const BetSchema = new mongoose.Schema({
//     userId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     matbet: {
//         type: String,
//         required: true
//     },
//     mode: {
//         type: String,
//         // enum: ['single', 'multiple', 'system'], // Adjust based on your game modes
//         // required: true
//     },
//     runValue: {
//         type: Number,
//         // required: true
//     },
//     rate: {
//         type: Number,
//         // required: true
//     },
//     stake: {
//         type: Number,
//         required: true
//     },
//     profitA: {
//         type: Number,
//         // required: true
//     },
//     profitB: {
//         type: Number,
//         // required: true
//     },
//     balance: { type: Number},
//     exposure: {type: Number},
//     match: { type: String},
//     status:{type:String, default:"live"},
//     current_status:{type:String, default:"Pending"},
// }, { timestamps: true });

// module.exports = mongoose.model('CricketMarket1', BetSchema);

// const mongoose = require('mongoose');

// const BetSchema = new mongoose.Schema({
//     userId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     matbet: {
//         type: String,
//         required: true
//     },
//     mode: {
//         type: String,
//         // enum: ['single', 'multiple', 'system'], // Adjust based on your game modes
//         // required: true
//     },
//     runValue: {
//         type: Number,
//         // required: true
//     },
//     rate: {
//         type: Number,
//         // required: true
//     },
//     stake: {
//         type: Number,
//         required: true
//     },
//     profitA: {
//         type: Number,
//         // required: true
//     },
//     profitB: {
//         type: Number,
//         // required: true
//     },
//     balance: { type: Number},
//     exposure: {type: Number},
//     match: { type: String},
//     status:{type:String, default:"live"},
//     current_status:{type:String, default:"Pending"},
// }, { timestamps: true });

// module.exports = mongoose.model('CricketMarket1', BetSchema);

const mongoose = require('mongoose');

const BetSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    matbet: {
        type: String,
        required: true
    },
    mode: {
        type: String,
        // enum: ['single', 'multiple', 'system'], // Adjust based on your game modes
        // required: true
    },
    odds: {
        type: Number,
        // required: true
    },
    rate: {
        type: Number,
        // required: true
    },
    stake: {
        type: Number,
        required: true
    },
    profitA: {
        type: Number,
        // required: true
    },
    profitB: {
        type: Number,
        // required: true
    },
    balance: {
        type: Number,
        // required: true
    },
    exposure: {
        type: Number,
        // required: true
    },
    yesRuns: {
        type: Number
    },
    noRuns: {
        type: Number
    },
    winningRuns: { type: Number , default:0},
    matchName: { type: String },
    result: { type: String, default: "Pending" },
}, { timestamps: true });

module.exports = mongoose.model('CricketMarket1', BetSchema);
