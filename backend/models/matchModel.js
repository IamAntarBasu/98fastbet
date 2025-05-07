const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema(
  {
    matchName: { type: String },
    players: [{ playername: { type: String }, score: { type: Number } }],
  }
);

const Match = mongoose.model('AllMatch', MatchSchema);
module.exports = Match;