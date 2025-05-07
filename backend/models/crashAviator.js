// const mongoose = require('mongoose');
// const crashavaitorSchema = new mongoose.Schema({
//    round_id: { type: String },
//    crashMultiplier: { type: String },
// }, { timestamps: true });
// const crashavaitorModel = mongoose.model('crashavaitor', crashavaitorSchema);
// module.exports = crashavaitorModel;
const mongoose = require('mongoose');
const crashavaitorSchema = new mongoose.Schema({
   round_id: { type: String },
   crashMultiplier: { type: String },
}, { timestamps: true });
const crashavaitorModel = mongoose.model('crashavaitor', crashavaitorSchema);
module.exports = crashavaitorModel;