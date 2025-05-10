const Bet = require('../models/cricketMarketModel');
const User_Wallet = require('../models/Wallet');
const MatchK = require("../models/marketLogicModel");
exports.createBet = async (req, res) => {
    try {
        const { myBets } = req.body;
        console.log("myBetsmyBets", myBets);

        if (!myBets || !Array.isArray(myBets)) {
            return res.status(400).json({ error: "Invalid bet data" });
        }

        const betsToSave = [];

        for (const betData of myBets) {
            const {
                userId,
                label: matbet,
                type: mode,
                odds,
                rate,
                stake,
                teamAProfit: profitA,
                teamBProfit: profitB,
                balance,
                exposure,
                currentExposure,
                runs,
                matchName
            } = betData;
//             const result = [
//         {
//             label: "MAX O'DOWD RUN(NED VS SCO)ADV",
//             odds: 120,
//             type: 'no',
//             rate: 120,
//             isOverMarket: true,
//             stake: 100,
//             runs: 25,
//             matchName: 'Netherlands v Scotland',
//             timestamp: '2025-05-10T06:21:41.137Z',
//             userId: '681eedf4d71658883bc14e78',
//             maxProfit: '100.00',
//             maxLoss: '-180.00',
//             netExposure: '180.00',
//             cancelableAmount: '200.00',
//             totalExposure: '180.00',
//             balance: '9820.00',
//             marketType: 'overMarket',
//             teamAProfit: -100,
//             exposure: -120,
//             currentExposure: '180.00',
//             runValue: 25
//         }
// ]
            const parsedExposure = Math.abs(Number(exposure) || 0);

            // Check if user wallet exists
            let userWallet = await User_Wallet.findOne({ user: userId });

            if (!userWallet) {
                console.log(`User wallet not found for userId: ${userId}`);
                return res.status(400).json({ error: "User wallet not found" });
            }

            // Ensure exposureBalance is a number
            userWallet.exposureBalance = Number(userWallet.exposureBalance) || 0;

            // Check for opposite mode bets with same match and label
            const oppositeMode = mode === "yes" ? "no" : "yes";

            const previousOppositeBet = await Bet.findOne({
                userId,
                matbet,
                mode: oppositeMode,
                matchName,
                result: "Pending"
            });
            console.log("bets hai",previousOppositeBet)
            // previousOppositeBet = {
            //                         _id: new ObjectId('681eef8cfb3cb9ca608418c2'),
            //                         userId: new ObjectId('681eedf4d71658883bc14e78'),
            //                         matbet: "MAX O'DOWD RUN(NED VS SCO)ADV",
            //                         mode: 'no',
            //                         odds: 120,
            //                         rate: 120,
            //                         stake: 100,
            //                         profitA: -100,
            //                         balance: 9760,
            //                         exposure: -120,
            //                         noRuns: 25,
            //                         winningRuns: 0,
            //                         matchName: 'Netherlands v Scotland',
            //                         result: 'Pending',
            //                         __v: 0,
            //                         createdAt: "2025-05-10T06:17:49.050Z",
            //                         updatedAt: "2025-05-10T06:17:49.050Z"
            //                         }
            if (previousOppositeBet) {
                const prevRuns = oppositeMode === "yes" ? previousOppositeBet.yesRuns : previousOppositeBet.noRuns;
                console.log("previose bet",prevRuns)
                if (prevRuns === runs) {
                    // If runs match, update wallet and save bet
                 

                    const prevExposure = Math.abs(Number(previousOppositeBet.exposure) || 0);
                    const prevProfitA = Math.abs(Number(previousOppositeBet.profitA) || 0);
                    const newProfitA = Math.abs(Number(profitA) || 0);
                    console.log("prevExposure", prevExposure);
                    // const exposureUpdate = Math.abs(prevProfitA - newProfitA) + Math.abs(prevExposure-parsedExposure)-prevExposure;
                    const exposureUpdate = Math.abs(prevExposure - newProfitA)-prevExposure;
                    // const exposureUpdate = Math.abs(Number(currentExposure)) - Math.abs(Number(previousOppositeBet.rate));
                    userWallet.exposureBalance = currentExposure;
                    userWallet.balance =balance;
                    await userWallet.save();
                    previousOppositeBet.result="cancel";
                    previousOppositeBet.exposure=Math.abs(prevExposure - newProfitA);
                    await previousOppositeBet.save();
                    return res.status(201).json("Bet cancel each other");
                    console.log(`Wallet updated for same runs and opposite bet: ${userId}, Balance = ${userWallet.balance}, Exposure = ${userWallet.exposureBalance}`);
                }else if(prevRuns > runs){
                    console.log("HERE1")
                    const prevExposure = Math.abs(Number(previousOppositeBet.exposure) || 0);
                    const prevProfitA = Math.abs(Number(previousOppositeBet.profitA) || 0);
                    const newProfitA = Math.abs(Number(profitA) || 0);
                    const exposureDiff=Math.abs(prevExposure - parsedExposure);
                    if(exposureDiff>0){
                 
                        const YesRuns = mode === "yes" ? runs : undefined;
                        const NoRuns = mode === "no" ? runs : undefined;
            
                        // Create Bet Entry
                        const bet = new Bet({
                            userId,
                            matbet,
                            mode,
                            odds,
                            rate,
                            stake,
                            profitA,
                            profitB,
                            balance,
                            exposure:exposureDiff,
                            yesRuns: YesRuns,
                            noRuns: NoRuns,
                            matchName
                        });

                        userWallet.exposureBalance = userWallet.exposureBalance+exposureDiff-prevExposure;
                        userWallet.balance =userWallet.balance-exposureDiff+prevExposure;
                        previousOppositeBet.exposure=0;
                        betsToSave.push(bet);
                        await userWallet.save();
                        await previousOppositeBet.save();
                    
                       
                    }else if(exposureDiff===0){

                        const YesRuns = mode === "yes" ? runs : undefined;
                        const NoRuns = mode === "no" ? runs : undefined;
            
                        // Create Bet Entry
                        const bet = new Bet({
                            userId,
                            matbet,
                            mode,
                            odds,
                            rate,
                            stake,
                            profitA,
                            profitB,
                            balance,
                            exposure:0,
                            yesRuns: YesRuns,
                            noRuns: NoRuns,
                            matchName
                        });

                        userWallet.exposureBalance -= prevExposure;
                        userWallet.balance =userWallet.balance-exposureDiff+prevExposure;
                        previousOppositeBet.exposure=0;
                        betsToSave.push(bet);
                        await userWallet.save();
                        await previousOppositeBet.save();
                        
                       
                    }
                } else {
                   console.log("HERE@@2");
                const YesRuns = mode === "yes" ? runs : undefined;
                const NoRuns = mode === "no" ? runs : undefined;
    
                // Create Bet Entry
                const bet = new Bet({
                    userId,
                    matbet,
                    mode,
                    odds,
                    rate,
                    stake,
                    profitA,
                    profitB,
                    balance,
                    exposure,
                    yesRuns: YesRuns,
                    noRuns: NoRuns,
                    matchName
                });
    
                betsToSave.push(bet);
                userWallet.balance = balance;
                userWallet.exposureBalance += parsedExposure;
                await userWallet.save();

                }
            } else {
                console.log("HERE@@3");
                // No opposite bet found, update wallet and save normally


                const YesRuns = mode === "yes" ? runs : undefined;
                const NoRuns = mode === "no" ? runs : undefined;
    
                // Create Bet Entry
                const bet = new Bet({
                    userId,
                    matbet,
                    mode,
                    odds,
                    rate,
                    stake,
                    profitA,
                    profitB,
                    balance,
                    exposure,
                    yesRuns: YesRuns,
                    noRuns: NoRuns,
                    matchName
                });
    
                betsToSave.push(bet);
                userWallet.balance = balance;
                userWallet.exposureBalance += parsedExposure;
                await userWallet.save();

                console.log(`Wallet updated normally for ${userId}: Balance = ${userWallet.balance}, Exposure = ${userWallet.exposureBalance}`);
            }

            // Set YesRuns or NoRuns based on mode
            // const YesRuns = mode === "yes" ? runs : undefined;
            // const NoRuns = mode === "no" ? runs : undefined;

            // // Create Bet Entry
            // const bet = new Bet({
            //     userId,
            //     matbet,
            //     mode,
            //     odds,
            //     rate,
            //     stake,
            //     profitA,
            //     profitB,
            //     balance,
            //     exposure,
            //     yesRuns: YesRuns,
            //     noRuns: NoRuns,
            //     matchName
            // });

            // betsToSave.push(bet);
        }

        // Save all bets in one go
        if (betsToSave.length > 0) {
            const savedBets = await Bet.insertMany(betsToSave);
            console.log("Saved Bets:", savedBets);
            return res.status(201).json(savedBets);
        } else {
            return res.status(400).json({ error: "No valid bets to save" });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: error.message });
    }
};




// exports.createBet = async (req, res) => {
//     try {
//         const { myBets } = req.body;

//         if (!myBets || !Array.isArray(myBets)) {
//             return res.status(400).json({ error: "Invalid bet data" });
//         }

//         const betsToSave = [];

//         for (const betData of myBets) {
//             const {
//                 userId,
//                 label: matbet,
//                 type: mode,
//                 odds,
//                 rate,
//                 stake,
//                 teamAProfit: profitA,
//                 teamBProfit: profitB,
//                 balance,
//                 exposure,
//                 currentExposure,
//                 runs,
//                 matchName
//             } = betData;

//             const parsedExposure = Math.abs(Number(exposure) || 0);

//             // Check if user wallet exists
//             let userWallet = await User_Wallet.findOne({ user: userId });

//             if (!userWallet) {
//                 console.log(`User wallet not found for userId: ${userId}`);
//                 return res.status(400).json({ error: "User wallet not found" });
//             }

//             // Ensure exposureBalance is a number
//             userWallet.exposureBalance = Number(userWallet.exposureBalance) || 0;

//             // Check for opposite mode bets with same match and label
//             const oppositeMode = mode === "yes" ? "no" : "yes";

//             const previousOppositeBet = await Bet.findOne({
//                 userId,
//                 matbet,
//                 mode: oppositeMode,
//                 matchName,
//                 result: "Pending"
//             });
//             console.log("bets hai",previousOppositeBet)
//             if (previousOppositeBet) {
//                 const prevRuns = oppositeMode === "yes" ? previousOppositeBet.yesRuns : previousOppositeBet.noRuns;
//                 console.log("previose bet",prevRuns)
//                 if (prevRuns === runs) {
//                     // If runs match, update wallet and save bet
                 

//                     const prevExposure = Math.abs(Number(previousOppositeBet.exposure) || 0);
//                     const prevProfitA = Math.abs(Number(previousOppositeBet.profitA) || 0);
//                     const newProfitA = Math.abs(Number(profitA) || 0);

//                     const exposureUpdate = Math.abs(prevProfitA - newProfitA) + Math.abs(prevExposure-parsedExposure)-prevExposure;
//                     userWallet.exposureBalance += exposureUpdate;
//                     userWallet.balance =balance;
//                     await userWallet.save();
//                     previousOppositeBet.result="cancel";
//                     await previousOppositeBet.save();
//                     return res.status(201).json("Bet cancel each other");
//                     console.log(`Wallet updated for same runs and opposite bet: ${userId}, Balance = ${userWallet.balance}, Exposure = ${userWallet.exposureBalance}`);
//                 } else {
                   
//                 const YesRuns = mode === "yes" ? runs : undefined;
//                 const NoRuns = mode === "no" ? runs : undefined;
    
//                 // Create Bet Entry
//                 const bet = new Bet({
//                     userId,
//                     matbet,
//                     mode,
//                     odds,
//                     rate,
//                     stake,
//                     profitA,
//                     profitB,
//                     balance,
//                     exposure,
//                     yesRuns: YesRuns,
//                     noRuns: NoRuns,
//                     matchName
//                 });
    
//                 betsToSave.push(bet);
//                 userWallet.balance = balance;
//                 userWallet.exposureBalance += parsedExposure;
//                 await userWallet.save();
           
//                 }
//             } else {
//                 // No opposite bet found, update wallet and save normally


//                 const YesRuns = mode === "yes" ? runs : undefined;
//                 const NoRuns = mode === "no" ? runs : undefined;
    
//                 // Create Bet Entry
//                 const bet = new Bet({
//                     userId,
//                     matbet,
//                     mode,
//                     odds,
//                     rate,
//                     stake,
//                     profitA,
//                     profitB,
//                     balance,
//                     exposure,
//                     yesRuns: YesRuns,
//                     noRuns: NoRuns,
//                     matchName
//                 });
    
//                 betsToSave.push(bet);
//                 userWallet.balance = balance;
//                 userWallet.exposureBalance += parsedExposure;
//                 await userWallet.save();

//                 console.log(`Wallet updated normally for ${userId}: Balance = ${userWallet.balance}, Exposure = ${userWallet.exposureBalance}`);
//             }

//             // Set YesRuns or NoRuns based on mode
//             // const YesRuns = mode === "yes" ? runs : undefined;
//             // const NoRuns = mode === "no" ? runs : undefined;

//             // // Create Bet Entry
//             // const bet = new Bet({
//             //     userId,
//             //     matbet,
//             //     mode,
//             //     odds,
//             //     rate,
//             //     stake,
//             //     profitA,
//             //     profitB,
//             //     balance,
//             //     exposure,
//             //     yesRuns: YesRuns,
//             //     noRuns: NoRuns,
//             //     matchName
//             // });

//             // betsToSave.push(bet);
//         }

//         // Save all bets in one go
//         if (betsToSave.length > 0) {
//             const savedBets = await Bet.insertMany(betsToSave);
//             console.log("Saved Bets:", savedBets);
//             return res.status(201).json(savedBets);
//         } else {
//             return res.status(400).json({ error: "No valid bets to save" });
//         }
//     } catch (error) {
//         console.error("Error:", error);
//         res.status(500).json({ error: error.message });
//     }
// };


// Get all bets
exports.getAllBets = async (req, res) => {
    try {
        const bets = await Bet.find();
        // console.log(bets, "bets");
        res.json(bets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get bets by userId
exports.getBetsByUser = async (req, res) => {
    try {
        console.log(req.params.userId);
        // const matchOddsData = await MatchK.find({ userId: req.params.userId }).sort({ createdAt: -1 });

        const bets = await Bet.find({ userId: req.params.userId, matchName:req.params.match }).sort({ createdAt: -1 });



        res.json(bets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getBetsByMatch = async (req, res) => {
    try {
        // console.log(req.params.userId);
        const bets = await Bet.find({ matbet: req.params.matbet }).sort({ createdAt: -1 });
        res.json(bets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getBetsByMatchNameAndSession = async (req, res) => {
    try {
        // console.log(req.params.userId);
        const {matchName} = req.params
        const bets = await Bet.find({ matchName: matchName }).sort({ createdAt: 1 });
        console.log(bets)

        res.json(bets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete bet by ID
exports.deleteBet = async (req, res) => {
    try {
        await Bet.findByIdAndDelete(req.params.id);
        res.json({ message: 'Bet deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.resetAllBet = async (req, res) => {
    try {
        await Bet.deleteMany({});
        res.json({ message: 'All bets deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get bets by userId using query parameter
exports.getBetsByUserId = async (req, res) => {
    try {
        const { userId } = req.query;
        
        if (!userId) {
            return res.status(400).json({ error: "UserId is required" });
        }

        const bets = await Bet.find({ userId: userId })
            .sort({ createdAt: -1 });

        res.json(bets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};