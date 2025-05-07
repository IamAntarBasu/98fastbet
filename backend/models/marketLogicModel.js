const mongoose = require('mongoose');

const betSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  label: { type: String, required: true },
  odds: { type: Number, required: true },
  stake: { type: Number, required: true },
  teamAProfit: { type: Number, required: true },
  teamBProfit: { type: Number, required: true },
  balance: { type: Number, required: true },
  exposure: { type: Number, required: true },
  time: { type: String, required: true },
  type: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  match: { type: String, required: true },
  status:{type:String, default:"live"},
  current_status:{type:String, default:"Pending"},
  result:{type:String, default:"N/A"},
      teamIndex: { type: Number }
});
const MarketLK = mongoose.model('MarketLK', betSchema);

module.exports = MarketLK;
