const MatchModel = require('../models/aarParparchiModel'); // Adjust the path if needed
const CardModel = require('../models/cardsModel');
const User_Wallet = require('../models/Wallet');

// Create a new match
// exports.createMatch = async (req, res) => {
//     try {
//         const { matchName, user, betpoints, profit, isWinner, cards, result, player1, player2, totalRuns, cardIndex } = req.body;

//         const existingMatch = await MatchModel.findOne({ matchName, user: user.userId });
//         if (existingMatch) {
//             res.status(409).json({ message: 'You Already Played this match' });

//         }

//         const newMatch = new MatchModel({
//             matchName,
//             user,
//             betpoints,
//             profit,
//             isWinner,
//             cards,
//             result
//         });
//         const wallet = await User_Wallet.find({ user: user })
//         if (isWinner === true) {
//             wallet.balance += profit
//         } else {
//             wallet.balance -= betpoints
//         }

//         await wallet.save()

//         const savedMatch = await newMatch.save();
//         res.status(201).json({ message: 'Match created successfully', match: savedMatch });
//     } catch (error) {
//         res.status(500).json({ message: 'Error creating match', error: error.message });
//     }
// };


exports.createMatch = async (req, res) => {
  try {
    console.log("ok")
    const { matchName } = req.params
    const { user, betpoints, profit, isWinner, result, player1, player2, totalRuns, cardId } = req.body;
    // const findAllMatch = await MatchModel.find({})
    // ✅ Check if user already played this match
    let sameMatch = await MatchModel.findOne({ matchName, user: user.userId });
    if (sameMatch) {
      return res.status(409).json({ message: "User has already played this match." });
    }
    let noOfPeople = 0;
    // ✅ Check if the match already exists
    let existingMatch = await MatchModel.findOne({ matchName });
   
    if (existingMatch) {
      // ✅ Find the corresponding card
      if ( existingMatch.userArray.includes(user.email)) {
        return res.status(409).json({ message: "User has already played this match." });
      }
      const findCard = await CardModel.findOne({ _id: cardId });
      if (!findCard) {
        return res.status(404).json({ message: "Card not found." });
      }

      // ✅ Add user to the card if not already present
      // if (!findCard.user.includes(user.email)) {
      //   findCard.user.push(user.email);
      // } else {
      //   return res.status(409).json({ message: "User already exists on this card." });
      // }

      findCard.user = Array.from(new Set([...findCard.user, user.email]));
      // ✅ Find or create a card slot for the user
      let selectedCard = findCard.cards.find(card => !card.player1 || !card.player2);
      if (!selectedCard) {
        selectedCard = { player1: "", player2: "", totalRuns: 0, isWinner: false, cardUser: [], noOfPeople: 0 };
        // findCard.cards.push(selectedCard);
      }

      // ✅ Update card data
      // if (!selectedCard.cardUser.includes(user.email)) {
      //   selectedCard.cardUser.push(user.email);
      // }
      selectedCard.player1 = player1 || selectedCard.player1;
      selectedCard.player2 = player2 || selectedCard.player2;
      selectedCard.totalRuns = totalRuns || selectedCard.totalRuns;
      selectedCard.noOfPeople = selectedCard.noOfPeople + 1
      selectedCard.cardUser.push(user.email);

      await findCard.save();

      // ✅ Update existing match details
      existingMatch.betpoints += betpoints;
      existingMatch.profit += profit;
      existingMatch.result = result || existingMatch.result;
      existingMatch.userArray.push(user.email)

      // ✅ Update wallet balance
      const wallet = await User_Wallet.findOne({ user: user.userId });
      if (!wallet) {
        return res.status(404).json({ message: "User wallet not found." });
      }

      if (isWinner) {
        wallet.balance += profit;
      } else {
        wallet.balance -= betpoints;
      }

      await wallet.save();
      await existingMatch.save();

      return res.status(200).json({ message: "Existing match and card updated successfully.", match: existingMatch });
    } else {
      // ✅ Create a new match if it doesn't exist
      const findCard = await CardModel.findOne({ _id: cardId });

      if (!findCard) {
        return res.status(404).json({ message: "Card not found." });
      }

      // findCard.user = Array.from(new Set([...findCard.user, user.email]));
      // ✅ Add user to the card if not already present
      if (!findCard.user.includes(user.email)) {
        findCard.user.push(user.email);
      } else {
        return res.status(409).json({ message: "User already exists on this card." });
      }

      // ✅ Add user details to `users` array in the card
      // findCard.users.push({
      //   username: user.username,
      //   email: user.email,
      //   walletBalance: wallet.balance - points, // Updated wallet balance
      //   betpoints: points,
      //   profit: profit || 0
      // });

      // ✅ Find or create a card slot for the user
      let selectedCard = findCard.cards.find(card => !card.player1 || !card.player2);
      if (!selectedCard) {
        selectedCard = { player1: "", player2: "", totalRuns: 0, isWinner: false, cardUser: [], matchName: "" };
        findCard.cards.push(selectedCard);
      }

      // ✅ Update card data
      if (!selectedCard.cardUser.includes(user.email)) {
        selectedCard.cardUser.push(user.email);
      }
      selectedCard.player1 = player1 || selectedCard.player1;
      selectedCard.player2 = player2 || selectedCard.player2;
      selectedCard.totalRuns = totalRuns || selectedCard.totalRuns;
      selectedCard.matchName = matchName || selectedCard.matchName;
      selectedCard.noOfPeople = 1;

      await findCard.save();


      const newMatch = new MatchModel({
        matchName,
        user: user.userId,
        betpoints,
        profit,
        isWinner,
        userArray: [user.email],
        card: cardId,
        CardData: selectedCard,
        result,
        playedAt: new Date(),
      });

      // ✅ Update wallet balance
      const wallet = await User_Wallet.findOne({ user: user.userId });
      if (!wallet) {
        return res.status(404).json({ message: "User wallet not found." });
      }

      if (isWinner) {
        wallet.balance += profit;
      } else {
        wallet.balance -= betpoints;
      }

      await wallet.save();
      const savedMatch = await newMatch.save();

      // ✅ Also update CardModel for the new match
      // const newCard = await CardModel.findOne({ _id: cardId });
      // if (newCard) {
      //   newCard.user.push(user.email);
      //   newCard.cards.push({
      //     player1,
      //     player2,
      //     totalRuns,
      //     isWinner,
      //     noOfPeople,
      //     cardUser: [user.email],
      //   });
      //   await newCard.save();
      // }

      return res.status(201).json({ message: "New match and card created successfully.", match: savedMatch });
    }
  } catch (error) {
    console.error("❌ Error creating/updating match:", error);
    res.status(500).json({ message: "Error processing match", error: error.message });
  }
};




// exports.createMatch = async (req, res) => {
//   try {
//     console.log("ok")
//     const { matchName } = req.params
//     const { user, betpoints, profit, isWinner, result, player1, player2, totalRuns, cardId } = req.body;

//     // ✅ Check if user already played this match
//     let sameMatch = await MatchModel.findOne({ matchName, user: user.userId });
//     if (sameMatch) {
//       return res.status(409).json({ message: "User has already played this match." });
//     }

//     // ✅ Check if the match already exists
//     let existingMatch = await MatchModel.findOne({ matchName });

//     if (existingMatch) {

//       if (cardId === 1){
//         existingMatch.card1.player1 =  player1, 
//         existingMatch.card1.player2 =  player2, 
//         existingMatch.card1.totalRuns =  totalRuns, 
//       }

//         // ✅ Find or create a card slot for the user
//         let selectedCard = findCard.cards.find(card => !card.player1 || !card.player2);
//       if (!selectedCard) {
//         selectedCard = { player1: "", player2: "", totalRuns: 0, isWinner: false, cardUser: [] };
//         findCard.cards.
//           push(selectedCard);
//       }

//       // ✅ Update card data
//       if (!selectedCard.cardUser.includes(user.email)) {
//         selectedCard.cardUser.push(user.email);
//       }
//       selectedCard.player1 = player1 || selectedCard.player1;
//       selectedCard.player2 = player2 || selectedCard.player2;
//       selectedCard.totalRuns = totalRuns || selectedCard.totalRuns;

//       await findCard.save();

//       // ✅ Update existing match details
//       existingMatch.betpoints += betpoints;
//       existingMatch.profit += profit;
//       existingMatch.result = result || existingMatch.result;

//       // ✅ Update wallet balance
//       const wallet = await User_Wallet.findOne({ user: user.userId });
//       if (!wallet) {
//         return res.status(404).json({ message: "User wallet not found." });
//       }

//       if (isWinner) {
//         wallet.balance += profit;
//       } else {
//         wallet.balance -= betpoints;
//       }

//       await wallet.save();
//       await existingMatch.save();

//       return res.status(200).json({ message: "Existing match and card updated successfully.", match: existingMatch });
//     } else {
//       // ✅ Create a new match if it doesn't exist
//       const findCard = await CardModel.findOne({ _id: cardId });

//       if (!findCard) {
//         return res.status(404).json({ message: "Card not found." });
//       }

//       // // ✅ Add user to the card if not already present
//       // if (!findCard.user.includes(user.email)) {
//       //   findCard.user.push(user.email);
//       // } else {
//       //   return res.status(409).json({ message: "User already exists on this card." });
//       // }

//       // ✅ Find or create a card slot for the user
//       let selectedCard = findCard.cards.find(card => !card.player1 || !card.player2);
//       if (!selectedCard) {
//         selectedCard = { player1: "", player2: "", totalRuns: 0, isWinner: false, cardUser: [], matchName: "" };
//         findCard.cards.push(selectedCard);
//       }

//       // ✅ Update card data
//       if (!selectedCard.cardUser.includes(user.email)) {
//         selectedCard.cardUser.push(user.email);
//       }
//       selectedCard.player1 = player1 || selectedCard.player1;
//       selectedCard.player2 = player2 || selectedCard.player2;
//       selectedCard.totalRuns = totalRuns || selectedCard.totalRuns;
//       selectedCard.matchName = matchName || selectedCard.matchName;

//       await findCard.save();


//       const newMatch = new MatchModel({
//         matchName,
//         user: user.userId,
//         betpoints,
//         profit,
//         isWinner,
//         card: selectedCard,
//         CardData: selectedCard,
//         result,
//         playedAt: new Date(),
//       });

//       // ✅ Update wallet balance
//       const wallet = await User_Wallet.findOne({ user: user.userId });
//       if (!wallet) {
//         return res.status(404).json({ message: "User wallet not found." });
//       }

//       if (isWinner) {
//         wallet.balance += profit;
//       } else {
//         wallet.balance -= betpoints;
//       }

//       await wallet.save();
//       const savedMatch = await newMatch.save();

//       // ✅ Also update CardModel for the new match
//       const newCard = await CardModel.findOne({ _id: cardId });
//       if (newCard) {
//         newCard.user.push(user.email);
//         newCard.cards.push({
//           player1,
//           player2,
//           totalRuns,
//           isWinner,
//           cardUser: [user.email],
//         });
//         await newCard.save();
//       }

//       return res.status(201).json({ message: "New match and card created successfully.", match: savedMatch });
//     }
//   } catch (error) {
//     console.error("❌ Error creating/updating match:", error);
//     res.status(500).json({ message: "Error processing match", error: error.message });
//   }
// };





// Get all matches
exports.getAllMatches = async (req, res) => {
  try {
    const matches = await MatchModel.find().populate('user');
    res.status(200).json(matches);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching matches', error: error.message });
  }
};

// Get a match by ID
exports.getMatchById = async (req, res) => {
  try {
    const { id } = req.params;
    const match = await MatchModel.findById(id).populate('user');

    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    res.status(200).json(match);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching match', error: error.message });
  }
};
exports.getMatchByMatchName = async (req, res) => {
  try {
    const { matchName } = req.params;
    const match = await MatchModel.find({ matchName: matchName });

    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    res.status(200).json(match);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching match', error: error.message });
  }
};

// Update match result
exports.updateMatchResult = async (req, res) => {
  try {
    const { id } = req.params;
    const { winner, totalProfit, isWinner, profit } = req.body;

    const updatedMatch = await MatchModel.findByIdAndUpdate(
      id,
      {
        result: { winner, totalProfit },
        isWinner,
        profit
      },
      { new: true }
    );

    if (!updatedMatch) {
      return res.status(404).json({ message: 'Match not found' });
    }

    res.status(200).json({ message: 'Match result updated', match: updatedMatch });
  } catch (error) {
    res.status(500).json({ message: 'Error updating match', error: error.message });
  }
};

// Delete a match
exports.deleteMatch = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMatch = await MatchModel.findByIdAndDelete(id);

    if (!deletedMatch) {
      return res.status(404).json({ message: 'Match not found' });
    }

    res.status(200).json({ message: 'Match deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting match', error: error.message });
  }
};

exports.resetMatch = async (req, res) => {
  try {
    await MatchModel.deleteMany({});
    res.status(200).json({ message: "Game reset successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};