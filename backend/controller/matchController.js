// const Match = require('../models/matchModel');

// exports.createMatch = async (req, res) => {
//   try {
//       const { matchName, playerName, score } = req.body;
//       let match = await Match.findOne({ matchName });

//       if (match) {
//           // Check if player already exists in the match
//           if (!match.players.some(player => player.playername === playerName)) {
//               match.players.push({ playername: playerName, score: score || "0" });
//               await match.save();
//           }
//           return res.status(200).json(match);
//       } else {
//           const newMatch = new Match({ matchName, players: [{ playername: playerName, score: score || "0" }] });
//           await newMatch.save();
//           return res.status(201).json(newMatch);
//       }
//   } catch (error) {
//       res.status(500).json({ error: error.message });
//   }
// };

// exports.getAllMatches = async (req, res) => {
//   try {
//     const matches = await Match.find();
//     res.status(200).json(matches);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.getMatchById = async (req, res) => {
//   try {
//     const match = await Match.findById(req.params.id);
//     if (!match) return res.status(404).json({ message: 'Match not found' });
//     res.status(200).json(match);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.getMatchByMatchName = async (req, res) => {
//   try {
//     const { matchName } = req.params;
//     const match = await Match.findOne({ matchName: matchName });
//     if (!match) return res.status(404).json({ message: 'Match not found' });
//     res.status(200).json(match);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.updateMatch = async (req, res) => {
//   try {
//       const { playerIndex, playerName, score, matchName } = req.body;
//       const match = await Match.findById(req.params.id);
//       if (!match) return res.status(404).json({ message: 'Match not found' });
      
//       if (playerIndex < 0 || playerIndex >= match.players.length) {
//           return res.status(400).json({ message: 'Invalid player index' });
//       }
      
//       match.players[playerIndex] = { playername: playerName, score: score || match.players[playerIndex].score };
//       match.matchName = matchName || match.matchName;
//       await match.save();
//       res.status(200).json(match);
//   } catch (error) {
//       res.status(500).json({ error: error.message });
//   }
// };

// exports.deleteMatch = async (req, res) => {
//   try {
//     const deletedMatch = await Match.findByIdAndDelete(req.params.id);
//     if (!deletedMatch) return res.status(404).json({ message: 'Match not found' });
//     res.status(200).json({ message: 'Match deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

const Match = require('../models/matchModel');

// exports.createMatch = async (req, res) => {
//   try {
//     const { matchName, playerName, score, players } = req.body;
//     let match = await Match.findOne({ matchName });
//     console.log(req.body)
//     if (match) {
//       // Check if player already exists in the match
//       if (!match.players.some(player => player.playername === playerName)) {
//         match.players.push({ playername: playerName, score: score || "0" });
//         await match.save();
//       }
//       return res.status(200).json(match);
//     } else {
//       const newMatch = new Match({ matchName, players: [{ playername: playerName, score: score || "0" }] });
//       await newMatch.save();
//       return res.status(201).json(newMatch);
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

exports.createMatch = async (req, res) => {
  try {
    const { matchName, players } = req.body;
    let match = await Match.findOne({ matchName });
console.log(req.body)
    if (match) {
      // Add new players if they don't already exist
      players.forEach((newPlayer) => {
        if (!match.players.some(player => player.playername === newPlayer.playername)) {
          match.players.push({ playername: newPlayer.playername, score: newPlayer.score || "0" });
        }
      });
      await match.save();
      return res.status(200).json(match);
    } else {
      const newMatch = new Match({ matchName, players });
      await newMatch.save();
      return res.status(201).json(newMatch);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.getAllMatches = async (req, res) => {
  try {
    const matches = await Match.find();
    res.status(200).json(matches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMatchById = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) return res.status(404).json({ message: 'Match not found' });
    res.status(200).json(match);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMatchByMatchName = async (req, res) => {
  try {
    const { matchName } = req.params;
    const match = await Match.findOne({ matchName: matchName });
    if (!match) return res.status(404).json({ message: 'Match not found' });
    res.status(200).json(match);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateMatch = async (req, res) => {
  try {
    const { playerIndex, playerName, score, matchName, players } = req.body;
    console.log(req.body)
    const match = await Match.findById(req.params.id);
    if (!match) return res.status(404).json({ message: "Match not found" });
    console.log(match, "match")
    // Ensure players array exists
    // if (!Array.isArray(match.players) || match.players.length === 0) {
    //   return res.status(400).json({ message: "Players array is empty or undefined" });
    // }



    // if (playerIndex < 0 || playerIndex >= match.players.length) {
    //   return res.status(400).json({ message: "Invalid player index" });
    // }

    // // Ensure player object exists before updating
    // if (!match.players[playerIndex]) {
    //   return res.status(400).json({ message: "Player at given index does not exist" });
    // }

    // // Update player details
    // match.players[playerIndex] = {
    //   playername: playerName || match.players[playerIndex].playername,
    //   score: score !== undefined ? score : match.players[playerIndex].score,
    // };

    // // Update match name if provided
    // if (matchName) {
    //   match.matchName = matchName;
    // }

    match.matchName = matchName;
    match.players = players
    await match.save();
    res.status(200).json(match);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.deleteMatch = async (req, res) => {
  try {
    console.log(req.params.id)
    const deletedMatch = await Match.findByIdAndDelete(req.params.id);
    if (!deletedMatch) return res.status(404).json({ message: 'Match not found' });
    res.status(200).json({ message: 'Match deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// exports.resetMatch = async (req, res) => {
//   try {
//     await Match.deleteMany({});
//     res.status(200).json({ message: "Game reset successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
