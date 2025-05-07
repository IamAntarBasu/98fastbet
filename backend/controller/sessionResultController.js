// // const SessionResult = require('../models/sessionResultModel');
// // const Bet = require('../models/cricketMarketModel');
// // const User_wallet = require('../models/Wallet');


// // const createSessionResult = async (req, res) => {
// //     try {
// //         const { result, runs, matchName, noRuns, yesRuns, match } = req.body;
// //         console.log(req.body);

// //         // Fetch bet data for the match
// //         const betData = await Bet.find({ matchName: match, matbet: matchName });

// //         let userWalletUpdates = {}; // To track each user's wallet updates

// //         for (let bet of betData) {
// //             let updatedStatus = "loss"; // Default to loss
// //             // Determine win/loss based on runs
// //             if (bet.mode === "no" && parseInt(runs) < parseInt(bet.noRuns)) {
// //                 updatedStatus = "win";
// //             } else if (bet.mode === "yes" && parseInt(runs) > parseInt(bet.yesRuns)) {
// //                 updatedStatus = "win";
// //             }
// //             // Update the bet result
// //             bet.result = updatedStatus;
// //             bet.winningRuns = runs;
// //             await bet.save();

// //             // Ensure exposure and profit values are numbers
// //             const betExposure = Math.abs(bet.exposure) || 0;
// //             const betProfit = Math.abs(bet.profitA) || 0;
// //             // console.log(betExposure, betProfit, "betProft")
// //             // Accumulate wallet updates
// //             if (!userWalletUpdates[bet.userId]) {
// //                 userWalletUpdates[bet.userId] = { balanceChange: 0, exposureChange: 0 };
// //             }
// //             if (updatedStatus === "win") {
// //                 console.log(updatedStatus, "yes");
// //                 userWalletUpdates[bet.userId].balanceChange += (betProfit + betExposure);
// //                 userWalletUpdates[bet.userId].exposureChange -= betExposure; // Only subtract the specific bet's exposure
// //             } else {
// //                 console.log(updatedStatus, "no");
// //                 userWalletUpdates[bet.userId].exposureChange -= betExposure; // Still reset only this bet's exposure
// //             }
// //         }
// //         // Apply accumulated wallet updates
// //         for (let userId in userWalletUpdates) {
// //             const userWallet = await User_wallet.findOne({ user: userId });
// //             if (userWallet) {
// //                 userWallet.balance += userWalletUpdates[userId].balanceChange;
// //                 userWallet.exposureBalance += userWalletUpdates[userId].exposureChange; // Only adjust exposure for this bet
// //                 await userWallet.save();
// //             }
// //         }
// //         // Save session result
// //         const sessionResult = new SessionResult({ runs });
// //         await sessionResult.save();
// //         res.status(201).json({ success: true, data: sessionResult });
// //     } catch (error) {
// //         console.error(error);
// //         res.status(500).json({ success: false, message: "Server Error", error: error.message });
// //     }
// // };

// // // Get all session results
// // const getAllSessionResults = async (req, res) => {
// //     try {
// //         const sessionResults = await SessionResult.find();
// //         res.status(200).json({ success: true, data: sessionResults });
// //     } catch (error) {
// //         res.status(500).json({ success: false, message: 'Server Error', error: error.message });
// //     }
// // };

// // // Get a single session result by ID
// // const getSessionResultById = async (req, res) => {
// //     try {
// //         const sessionResult = await SessionResult.findById(req.params.id);
// //         if (!sessionResult) {
// //             return res.status(404).json({ success: false, message: 'Session Result not found' });
// //         }
// //         res.status(200).json({ success: true, data: sessionResult });
// //     } catch (error) {
// //         res.status(500).json({ success: false, message: 'Server Error', error: error.message });
// //     }
// // };

// // // Update a session result by ID
// // const updateSessionResult = async (req, res) => {
// //     try {
// //         const sessionResult = await SessionResult.findByIdAndUpdate(
// //             req.params.id,
// //             req.body,
// //             { new: true, runValidators: true }
// //         );
// //         if (!sessionResult) {
// //             return res.status(404).json({ success: false, message: 'Session Result not found' });
// //         }
// //         res.status(200).json({ success: true, data: sessionResult });
// //     } catch (error) {
// //         res.status(500).json({ success: false, message: 'Server Error', error: error.message });
// //     }
// // };

// // // Delete a session result by ID
// // const deleteSessionResult = async (req, res) => {
// //     try {
// //         const sessionResult = await SessionResult.findByIdAndDelete(req.params.id);
// //         if (!sessionResult) {
// //             return res.status(404).json({ success: false, message: 'Session Result not found' });
// //         }
// //         res.status(200).json({ success: true, message: 'Session Result deleted successfully' });
// //     } catch (error) {
// //         res.status(500).json({ success: false, message: 'Server Error', error: error.message });
// //     }
// // };

// // const resetSession = async (req, res) => {
// //     console.log("🔹 Received request at /session-results/reset");
// //     try {
// //         const allBets = await Bet.find();
// //         console.log("🔹 Found bets:", allBets.length);

// //         // Process user wallets
// //         const userWalletUpdates = {};
// //         for (let bet of allBets) {
// //             const userId = bet.userId.toString();

// //             if (!userWalletUpdates[userId]) {
// //                 userWalletUpdates[userId] = await User_wallet.findOne({ user: userId });
// //             }

// //             const userWallet = userWalletUpdates[userId];
// //             if (!userWallet) {
// //                 console.warn(`⚠️ No wallet found for user: ${userId}`);
// //                 continue;
// //             }

// //             userWallet.balance += Math.abs(bet.exposure);
// //             userWallet.exposureBalance -= Math.abs(bet.exposure)
// //             bet.exposure = 0;
// //             await bet.save();
// //         }

// //         // Save all wallets
// //         for (const userId in userWalletUpdates) {
// //             await userWalletUpdates[userId].save();
// //         }

// //         console.log("✅ Reset session completed.");
// //         return res.status(200).json({ success: true, message: "All data has been reset." });

// //     } catch (error) {
// //         console.error("❌ Error in resetSession:", error);
// //         return res.status(500).json({ success: false, message: "Server Error", error: error.message });
// //     }
// // };


// // module.exports = {
// //     createSessionResult,
// //     getAllSessionResults,
// //     getSessionResultById,
// //     updateSessionResult,
// //     deleteSessionResult,
// //     resetSession
// // };

// const SessionResult = require('../models/sessionResultModel');
// const Bet = require('../models/cricketMarketModel');
// const User_wallet = require('../models/Wallet');


// const createSessionResult = async (req, res) => {
//     try {
//         const { result, runs, matchName, noRuns, yesRuns, match } = req.body;
//         console.log(req.body);

//         // Fetch bet data for the match
//         const betData = await Bet.find({ matchName: match, matbet: matchName });

//         let userWalletUpdates = {}; // To track each user's wallet updates

//         for (let bet of betData) {
//             let updatedStatus = "loss"; // Default to loss
//             // Determine win/loss based on runs
//             if (bet.mode === "no" && parseInt(runs) < parseInt(bet.noRuns)) {
//                 updatedStatus = "win";
//             } else if (bet.mode === "yes" && parseInt(runs) > parseInt(bet.yesRuns)) {
//                 updatedStatus = "win";
//             }
//             // Update the bet result
//             bet.result = updatedStatus;
//             bet.winningRuns = runs;
//             await bet.save();

//             // Ensure exposure and profit values are numbers
//             const betExposure = Math.abs(bet.exposure) || 0;
//             const betProfit = Math.abs(bet.profitA) || 0;
//             // console.log(betExposure, betProfit, "betProft")
//             // Accumulate wallet updates
//             if (!userWalletUpdates[bet.userId]) {
//                 userWalletUpdates[bet.userId] = { balanceChange: 0, exposureChange: 0 };
//             }
//             if (updatedStatus === "win") {
//                 console.log(updatedStatus, "yes");
//                 userWalletUpdates[bet.userId].balanceChange += (betProfit + betExposure);
//                 userWalletUpdates[bet.userId].exposureChange -= betExposure; // Only subtract the specific bet's exposure
//             } else {
//                 console.log(updatedStatus, "no");
//                 userWalletUpdates[bet.userId].exposureChange -= betExposure; // Still reset only this bet's exposure
//             }
//         }
//         // Apply accumulated wallet updates
//         for (let userId in userWalletUpdates) {
//             const userWallet = await User_wallet.findOne({ user: userId });
//             if (userWallet) {
//                 userWallet.balance += userWalletUpdates[userId].balanceChange;
//                 userWallet.exposureBalance += userWalletUpdates[userId].exposureChange; // Only adjust exposure for this bet
//                 await userWallet.save();
//             }
//         }
//         // Save session result
//         const sessionResult = new SessionResult({ runs });
//         await sessionResult.save();
//         res.status(201).json({ success: true, data: sessionResult });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: "Server Error", error: error.message });
//     }
// };

// // Get all session results
// const getAllSessionResults = async (req, res) => {
//     try {
//         const sessionResults = await SessionResult.find();
//         res.status(200).json({ success: true, data: sessionResults });
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Server Error', error: error.message });
//     }
// };

// // Get a single session result by ID
// const getSessionResultById = async (req, res) => {
//     try {
//         const sessionResult = await SessionResult.findById(req.params.id);
//         if (!sessionResult) {
//             return res.status(404).json({ success: false, message: 'Session Result not found' });
//         }
//         res.status(200).json({ success: true, data: sessionResult });
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Server Error', error: error.message });
//     }
// };

// // Update a session result by ID
// const updateSessionResult = async (req, res) => {
//     try {
//         const sessionResult = await SessionResult.findByIdAndUpdate(
//             req.params.id,
//             req.body,
//             { new: true, runValidators: true }
//         );
//         if (!sessionResult) {
//             return res.status(404).json({ success: false, message: 'Session Result not found' });
//         }
//         res.status(200).json({ success: true, data: sessionResult });
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Server Error', error: error.message });
//     }
// };

// // Delete a session result by ID
// const deleteSessionResult = async (req, res) => {
//     try {
//         const sessionResult = await SessionResult.findByIdAndDelete(req.params.id);
//         if (!sessionResult) {
//             return res.status(404).json({ success: false, message: 'Session Result not found' });
//         }
//         res.status(200).json({ success: true, message: 'Session Result deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Server Error', error: error.message });
//     }
// };

// const resetSession = async (req, res) => {
//     console.log("🔹 Received request at /session-results/reset");
//     try {
//         const allBets = await Bet.find();
//         console.log("🔹 Found bets:", allBets.length);

//         // Process user wallets
//         const userWalletUpdates = {};
//         for (let bet of allBets) {
//             const userId = bet.userId.toString();

//             if (!userWalletUpdates[userId]) {
//                 userWalletUpdates[userId] = await User_wallet.findOne({ user: userId });
//             }

//             const userWallet = userWalletUpdates[userId];
//             if (!userWallet) {
//                 console.warn(`⚠️ No wallet found for user: ${userId}`);
//                 continue;
//             }

//             userWallet.balance += Math.abs(bet.exposure);
//             userWallet.exposureBalance -= Math.abs(bet.exposure)
//             bet.exposure = 0;
//             await bet.save();
//         }

//         // Save all wallets
//         for (const userId in userWalletUpdates) {
//             await userWalletUpdates[userId].save();
//         }

//         console.log("✅ Reset session completed.");
//         return res.status(200).json({ success: true, message: "All data has been reset." });

//     } catch (error) {
//         console.error("❌ Error in resetSession:", error);
//         return res.status(500).json({ success: false, message: "Server Error", error: error.message });
//     }
// };


// module.exports = {
//     createSessionResult,
//     getAllSessionResults,
//     getSessionResultById,
//     updateSessionResult,
//     deleteSessionResult,
//     resetSession
// };









// const SessionResult = require('../models/sessionResultModel');
// const Bet = require('../models/cricketMarketModel');
// const User_wallet = require('../models/Wallet');


// const createSessionResult = async (req, res) => {
//     try {
//         const { result, runs, matchName, noRuns, yesRuns, match } = req.body;
//         console.log(req.body);

//         // Fetch bet data for the match
//         const betData = await Bet.find({ matchName: match, matbet: matchName });

//         let userWalletUpdates = {}; // To track each user's wallet updates

//         for (let bet of betData) {
//             let updatedStatus = "loss"; // Default to loss
//             // Determine win/loss based on runs
//             if (bet.mode === "no" && parseInt(runs) < parseInt(bet.noRuns)) {
//                 updatedStatus = "win";
//             } else if (bet.mode === "yes" && parseInt(runs) > parseInt(bet.yesRuns)) {
//                 updatedStatus = "win";
//             }
//             // Update the bet result
//             bet.result = updatedStatus;
//             bet.winningRuns = runs;
//             await bet.save();

//             // Ensure exposure and profit values are numbers
//             const betExposure = Math.abs(bet.exposure) || 0;
//             const betProfit = Math.abs(bet.profitA) || 0;
//             // console.log(betExposure, betProfit, "betProft")
//             // Accumulate wallet updates
//             if (!userWalletUpdates[bet.userId]) {
//                 userWalletUpdates[bet.userId] = { balanceChange: 0, exposureChange: 0 };
//             }
//             if (updatedStatus === "win") {
//                 console.log(updatedStatus, "yes");
//                 userWalletUpdates[bet.userId].balanceChange += (betProfit + betExposure);
//                 userWalletUpdates[bet.userId].exposureChange -= betExposure; // Only subtract the specific bet's exposure
//             } else {
//                 console.log(updatedStatus, "no");
//                 userWalletUpdates[bet.userId].exposureChange -= betExposure; // Still reset only this bet's exposure
//             }
//         }
//         // Apply accumulated wallet updates
//         for (let userId in userWalletUpdates) {
//             const userWallet = await User_wallet.findOne({ user: userId });
//             if (userWallet) {
//                 userWallet.balance += userWalletUpdates[userId].balanceChange;
//                 userWallet.exposureBalance += userWalletUpdates[userId].exposureChange; // Only adjust exposure for this bet
//                 await userWallet.save();
//             }
//         }
//         // Save session result
//         const sessionResult = new SessionResult({ runs });
//         await sessionResult.save();
//         res.status(201).json({ success: true, data: sessionResult });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: "Server Error", error: error.message });
//     }
// };

// // Get all session results
// const getAllSessionResults = async (req, res) => {
//     try {
//         const sessionResults = await SessionResult.find();
//         res.status(200).json({ success: true, data: sessionResults });
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Server Error', error: error.message });
//     }
// };

// // Get a single session result by ID
// const getSessionResultById = async (req, res) => {
//     try {
//         const sessionResult = await SessionResult.findById(req.params.id);
//         if (!sessionResult) {
//             return res.status(404).json({ success: false, message: 'Session Result not found' });
//         }
//         res.status(200).json({ success: true, data: sessionResult });
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Server Error', error: error.message });
//     }
// };

// // Update a session result by ID
// const updateSessionResult = async (req, res) => {
//     try {
//         const sessionResult = await SessionResult.findByIdAndUpdate(
//             req.params.id,
//             req.body,
//             { new: true, runValidators: true }
//         );
//         if (!sessionResult) {
//             return res.status(404).json({ success: false, message: 'Session Result not found' });
//         }
//         res.status(200).json({ success: true, data: sessionResult });
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Server Error', error: error.message });
//     }
// };

// // Delete a session result by ID
// const deleteSessionResult = async (req, res) => {
//     try {
//         const sessionResult = await SessionResult.findByIdAndDelete(req.params.id);
//         if (!sessionResult) {
//             return res.status(404).json({ success: false, message: 'Session Result not found' });
//         }
//         res.status(200).json({ success: true, message: 'Session Result deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Server Error', error: error.message });
//     }
// };

// const resetSession = async (req, res) => {
//     console.log("🔹 Received request at /session-results/reset");
//     try {
//         const allBets = await Bet.find();
//         console.log("🔹 Found bets:", allBets.length);

//         // Process user wallets
//         const userWalletUpdates = {};
//         for (let bet of allBets) {
//             const userId = bet.userId.toString();

//             if (!userWalletUpdates[userId]) {
//                 userWalletUpdates[userId] = await User_wallet.findOne({ user: userId });
//             }

//             const userWallet = userWalletUpdates[userId];
//             if (!userWallet) {
//                 console.warn(`⚠️ No wallet found for user: ${userId}`);
//                 continue;
//             }

//             userWallet.balance += Math.abs(bet.exposure);
//             userWallet.exposureBalance -= Math.abs(bet.exposure)
//             bet.exposure = 0;
//             await bet.save();
//         }

//         // Save all wallets
//         for (const userId in userWalletUpdates) {
//             await userWalletUpdates[userId].save();
//         }

//         console.log("✅ Reset session completed.");
//         return res.status(200).json({ success: true, message: "All data has been reset." });

//     } catch (error) {
//         console.error("❌ Error in resetSession:", error);
//         return res.status(500).json({ success: false, message: "Server Error", error: error.message });
//     }
// };


// module.exports = {
//     createSessionResult,
//     getAllSessionResults,
//     getSessionResultById,
//     updateSessionResult,
//     deleteSessionResult,
//     resetSession
// };

const SessionResult = require('../models/sessionResultModel');
const Bet = require('../models/cricketMarketModel');
const User_wallet = require('../models/Wallet');


const createSessionResult = async (req, res) => {
    try {
        const { result, runs, matchName, noRuns, yesRuns, match } = req.body;
      

        // Fetch bet data for the match
        const betData = await Bet.find({ matchName: match, matbet: matchName ,result:"Pending"});
        const betDataCancel = await Bet.find({ matchName: match, matbet: matchName ,result:"cancel"});
      
        for(let bet2 of betDataCancel){
            const userWallet = await User_wallet.findOne({ user: bet2.userId });
         
            if (!userWallet) {
                console.error(`Wallet not found for user: ${bet2.user}`);
                continue;
              }
              userWallet.exposureBalance-= Math.abs(Number(bet2.exposure));
              bet2.result = "Complete";
              await userWallet.save();
              await bet2.save();
        }

        let userWalletUpdates = {}; // To track each user's wallet updates

        for (let bet of betData) {
            let updatedStatus = "loss"; // Default to loss
            // Determine win/loss based on runs
            if (bet.mode === "no" && parseInt(runs) < parseInt(bet.noRuns)) {
                updatedStatus = "win";
            } else if (bet.mode === "yes" && parseInt(runs) > parseInt(bet.yesRuns)) {
                updatedStatus = "win";
            }
            // Update the bet result
            bet.result = updatedStatus;
            bet.winningRuns = runs;
            await bet.save();

            // Ensure exposure and profit values are numbers
            const betExposure = Math.abs(bet.exposure) || 0;
            const betProfit = Math.abs(bet.profitA) || 0;
            // console.log(betExposure, betProfit, "betProft")
            // Accumulate wallet updates
            if (!userWalletUpdates[bet.userId]) {
                userWalletUpdates[bet.userId] = { balanceChange: 0, exposureChange: 0 };
            }
            if (updatedStatus === "win") {
                console.log(updatedStatus, "yes");
                userWalletUpdates[bet.userId].balanceChange += (betProfit + betExposure);
                userWalletUpdates[bet.userId].exposureChange -= betExposure; // Only subtract the specific bet's exposure
            } else {
                console.log(updatedStatus, "no");
                userWalletUpdates[bet.userId].exposureChange -= betExposure; // Still reset only this bet's exposure
            }
             bet.result = "Complete";
        }
        // Apply accumulated wallet updates
        for (let userId in userWalletUpdates) {
            const userWallet = await User_wallet.findOne({ user: userId });
            if (userWallet) {
                userWallet.balance += userWalletUpdates[userId].balanceChange;
                userWallet.exposureBalance += userWalletUpdates[userId].exposureChange; // Only adjust exposure for this bet
                await userWallet.save();
            }
        }
        // Save session result
        const sessionResult = new SessionResult({ runs });
        await sessionResult.save();
        res.status(201).json({ success: true, data: sessionResult });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};
// Get all session results
const getAllSessionResults = async (req, res) => {
    try {
        const sessionResults = await SessionResult.find();
        res.status(200).json({ success: true, data: sessionResults });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// Get a single session result by ID
const getSessionResultById = async (req, res) => {
    try {
        const sessionResult = await SessionResult.findById(req.params.id);
        if (!sessionResult) {
            return res.status(404).json({ success: false, message: 'Session Result not found' });
        }
        res.status(200).json({ success: true, data: sessionResult });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// Update a session result by ID
const updateSessionResult = async (req, res) => {
    try {
        const sessionResult = await SessionResult.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!sessionResult) {
            return res.status(404).json({ success: false, message: 'Session Result not found' });
        }
        res.status(200).json({ success: true, data: sessionResult });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// Delete a session result by ID
const deleteSessionResult = async (req, res) => {
    try {
        const sessionResult = await SessionResult.findByIdAndDelete(req.params.id);
        if (!sessionResult) {
            return res.status(404).json({ success: false, message: 'Session Result not found' });
        }
        res.status(200).json({ success: true, message: 'Session Result deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

const resetSession = async (req, res) => {
    console.log("🔹 Received request at /session-results/reset");
    try {
        const allBets = await Bet.find();
        console.log("🔹 Found bets:", allBets.length);

        // Process user wallets
        const userWalletUpdates = {};
        for (let bet of allBets) {
            const userId = bet.userId.toString();

            if (!userWalletUpdates[userId]) {
                userWalletUpdates[userId] = await User_wallet.findOne({ user: userId });
            }

            const userWallet = userWalletUpdates[userId];
            if (!userWallet) {
                console.warn(`⚠️ No wallet found for user: ${userId}`);
                continue;
            }

            userWallet.balance += Math.abs(bet.exposure);
            userWallet.exposureBalance -= Math.abs(bet.exposure)
            bet.exposure = 0;
            await bet.save();
        }

        // Save all wallets
        for (const userId in userWalletUpdates) {
            await userWalletUpdates[userId].save();
        }

        console.log("✅ Reset session completed.");
        return res.status(200).json({ success: true, message: "All data has been reset." });

    } catch (error) {
        console.error("❌ Error in resetSession:", error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};


module.exports = {
    createSessionResult,
    getAllSessionResults,
    getSessionResultById,
    updateSessionResult,
    deleteSessionResult,
    resetSession
};


