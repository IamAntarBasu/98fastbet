const mongoose = require('mongoose');
const SessionResultSchema = new mongoose.Schema({
    runs: { type: Number },
}, { timestamps: true });
const SessionResultModel = mongoose.model('SessionResult', SessionResultSchema);
module.exports = SessionResultModel;