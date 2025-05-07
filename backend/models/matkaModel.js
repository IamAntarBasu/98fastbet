const mongoose = require('mongoose');

const matkaSchema = new mongoose.Schema({
    marketName: { type: String },
    openNumber: { type: String },
    jodiDigit: { type: String },
    closeNumber: { type: String },
    openTime: { type: String },
    closeTime: { type: String },
    closeStatus: { type: String, default: "open", enum: ["open", "close"] }
}, { timestamps: true });


const matkaModel = mongoose.model('matka', matkaSchema);
module.exports = matkaModel;