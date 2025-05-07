const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    gameName: { type: String, required: true },
    bidType: { type: String, required: true },  // Add bidType field
    session: { type: String, required: true, default: 'N/A' },
    bids: [
      {
        number: { type: Number, required: true },
        points: { type: Number, required: true, min: 0 },
      },
    ],
    totalBidPoints: { type: Number, required: true, min: 0 },
    estimatedProfit: { type: Number, required: true, min: 0 },  
  },
  { timestamps: true }
);

const Bid = mongoose.model('Bid', bidSchema);
module.exports = Bid;
