// // const mongoose = require('mongoose');
// // const papuSchema = new mongoose.Schema({
// //   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
// //   titliGameId:{type:String},
// //   betAmount: { type: Number },
// //   totalBets: { type: Number, default: 0 },
// //   profit: { type: Number, default: 0 },
// //   isWin: { type: Boolean, default: false },
// //   winningImage: { type: String },
// //   selectedCard: []
// // }, { timestamps: true });


// // const papuModel = mongoose.model('papu', papuSchema);
// // module.exports = papuModel;
// const mongoose = require('mongoose');
// const papuSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   titliGameId: { type: String, required: true },
//   betAmount: { type: Number },
//   totalBets: { type: Number, default: 0 },
//   profit: { type: Number, default: 0 },
//   isWin: { type: Boolean, default: false },
//   isCompleted: { type: Boolean, default: false },
//   winningImage: { type: String },
//   selectedCard: []
// }, { timestamps: true });


// const papuModel = mongoose.model('papu', papuSchema);
// module.exports = papuModel;


const mongoose = require('mongoose');
const papuSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  titliGameId: { type: String, required: true },
  betAmount: { type: Number },
  totalBets: { type: Number, default: 0 },
  profit: { type: Number, default: 0 },
  isWin: { type: Boolean, default: false },
  isCompleted: { type: Boolean, default: false },
  winningImage: { type: String },
  selectedCard: []
}, { timestamps: true });


const papuModel = mongoose.model('papu', papuSchema);
module.exports = papuModel;
