// // import React, { useState, useEffect, useCallback } from "react";
// // import axios from "axios";
// // import Card from "./Card";
// // import AllImages from "./AllImages";
// // import Swal from "sweetalert2";
// // import "./Papu.css";
// // import styled from "styled-components";
// // // import { toast } from "react-toastify";
// // import { useProfile, fetchNameWallet } from "../context/ProfileContext";
// // import { toast, ToastContainer } from "react-toastify";
// // // import History from "./History";
// // // import DashboardNavbar from "../Pages/Dashboard/Components/Navbar";
// // import Navbar from '../AllGamesNavbar/AllNavbar'
// // import BettingTable from "./bettingTable";

// // const allWinningImages = [
// //   { image: "butterfly.jpg", winningPoints: 10 },
// //   { image: "cow.jpg", winningPoints: 10 },
// //   { image: "football.jpg", winningPoints: 10 },
// //   { image: "spin.jpg", winningPoints: 10 },
// //   { image: "kite.webp", winningPoints: 10 },
// //   { image: "rat.webp", winningPoints: 10 },
// //   { image: "umberlla.jpg", winningPoints: 10 },
// //   { image: "diya.webp", winningPoints: 10 },
// //   { image: "flower.webp", winningPoints: 10 },
// //   { image: "bucket.jpg", winningPoints: 10 },
// //   { image: "parrot.webp", winningPoints: 10 },
// //   { image: "sun.webp", winningPoints: 10 },
// //   // { image: coin, winningPoints: 10 }
// // ];

// // const Papu = () => {
// //   const { profile, fetchNameWallet } = useProfile();
// //   const [winningPointOfUser, setWinningPointOfUser] = useState([]);
// //   const [highlightedImages, setHighlightedImages] = useState([]);
// //   const [cards, setCards] = useState([]);
// //   const [balance, setBalance] = useState(profile.walletBalance);
// //   const [selectedImages, setSelectedImages] = useState([]);
// //   const [betPlaced, setBetPlaced] = useState(false);
// //   const [isProcessing, setIsProcessing] = useState(true);
// //   const [betCooldown, setBetCooldown] = useState(1);
// //   const [selectedCard, setSelectedCard] = useState([]);
// //   const [totalBetAmt, setTotalBetAmt] = useState(0)
// //   const [gameId, setGameId] = useState("")
// //   const [randomImage, setRandomImage] = useState(null);
// //   const [countDown, setCountDown] = useState(30)
// //   const [result, setResult] = useState(false)
// //   const betPlaceAmt = [
// //     { bet: 10, profit: 100 },
// //     { bet: 20, profit: 200 },
// //     { bet: 50, profit: 500 },
// //     { bet: 100, profit: 1000 },
// //     { bet: 500, profit: 5000 },
// //     { bet: 1000, profit: 10000 },
// //     { bet: 2000, profit: 20000 },
// //     { bet: 5000, profit: 50000 }
// //   ];

// //   useEffect(() => {
// //     fetchNameWallet();
// //   }, [fetchNameWallet]);

// //   const [betAmount, setBetAmount] = useState(10);
// //   const [expectedProfit, setExpectedProfit] = useState(100);
// //   const [titlibets, setTitlibets] = useState([])
// //   const [userData, setUserData] = useState(null);
// //   const [exposure, setExposure] = useState(0);
// //   const [isUpdateResult, setIsUpdateResult] = useState(false);
// //   // const [randomImage, setRandomImage] = useState(null);
// //   useEffect(() => {
// //     const user = localStorage.getItem('user');
// //     if (user) {
// //       setUserData(JSON.parse(user));
// //     } else {
// //       alert("User is not logged in. Please log in to view your bets.");
// //     }
// //   }, []);


// //   useEffect(() => {
// //     if (countDown > 0) return;

// //     const revealNextImage = async (index) => {
// //       setIsProcessing(true)
// //       setIsUpdateResult(true)
// //       setResult(true)
// //       setCards((prevCards) => {
// //         if (prevCards[index]?.revealedImage) return prevCards;

// //         return prevCards.map((card, i) =>
// //           i === index ? { ...card, loading: true } : card
// //         );
// //       });

// //       try {
// //         const response = await axios.get(
// //           `${process.env.REACT_APP_BASE_URL}/api/titli/get-random-image`
// //         );
// //         const newRandomImage = response.data.randomImage;
// //         localStorage.setItem("randomImage", newRandomImage);
// //         setRandomImage(newRandomImage);

// //         setCards((prevCards) =>
// //           prevCards.map((card, i) =>
// //             i === index
// //               ? { ...card, revealedImage: newRandomImage, loading: false }
// //               : card
// //           )
// //         );

// //         // Check result after image is revealed
// //         const isMatch = selectedCard.some((card) => card.image === newRandomImage);
// //         const allBet = selectedCard.reduce((total, card) => total + card.betAmount, 0);

// //         if (isMatch) {
// //           setBalance((prev) => prev + expectedProfit);
// //           setHighlightedImages((prev) => [...new Set([...prev, newRandomImage])]);
// //           setWinningPointOfUser((prev) => [...prev, 10]);
// //           setTotalBetAmt(allBet);

// //           try {
// //             const response = await axios.put(
// //               `${process.env.REACT_APP_BASE_URL}/api/titli/updatebets`,
// //               {
// //                 gameId: localStorage.getItem('titligameId'),
// //                 user: profile.userId,
// //                 betAmount,
// //                 profit: expectedProfit,
// //                 totalBets: allBet,
// //                 isWin: true
// //               }
// //             );
// //             if (response.data.newBalance) {
// //               setBalance(response.data.newBalance);
// //             }
// //             if (response.status === 200) {
// //               fetchNameWallet()
// //             }
// //           } catch (error) {
// //             console.error("Error updating bet (win):", error);
// //           }
// //         } else {
// //           try {
// //             const response = await axios.put(
// //               `${process.env.REACT_APP_BASE_URL}/api/titli/updatebets`,
// //               {
// //                 gameId: localStorage.getItem('titligameId'),
// //                 user: profile.userId,
// //                 profit: 0,
// //                 totalBets: allBet,
// //                 isWin: false
// //               }
// //             );
// //             if (response.data.newBalance) {
// //               setBalance(response.data.newBalance);
// //             }
// //             if (response.status === 200) {
// //               fetchNameWallet()
// //             }
// //           } catch (error) {
// //             console.error("Error updating bet (loss):", error);
// //           }
// //         }

// //         await showPremiumPopup({
// //           html: `
// //             <div style="position: absolute; top: 120px; left: 50%; transform: translate(-50%, 0); background: black; opacity: 0.8; padding: 1rem 1rem; border-radius:0.2rem; text-align: center;">
// //               <div style="font-size: 1.25rem; font-weight: bold;">${isMatch ? "You Won!" : "Try Again!"}</div>
// //               <div style="font-size: 0.875rem;">${isMatch ? `₹${expectedProfit} Added!` : "Better luck next time!"}</div>
// //             </div>
// //           `,
// //           gradient: isMatch
// //             ? "bg-gradient-to-br from-green-600 via-emerald-500 to-cyan-500"
// //             : "bg-gradient-to-br from-red-600 via-rose-500 to-pink-500",
// //           timer: 3000,
// //           position: "top-start",
// //         });

// //         setTimeout(() => {
// //           setCountDown(30);
// //           setIsProcessing(false);
// //           setResult(false);
// //           setBetPlaced(false);
// //           setSelectedImages([]);
// //           setSelectedCard([]);
// //         }, 4000);

// //       } catch (error) {
// //         console.error("Error fetching random image:", error);
// //       }
// //     };

// //     let currentIndex = cards.findIndex((card) => !card.revealedImage);
// //     if (currentIndex !== -1) {
// //       revealNextImage(currentIndex);
// //     }
// //   }, [countDown]);

// //   // useEffect(() => {
// //   //   if (countDown > 0) {
// //   //     const timer = setTimeout(() => setCountDown((prev) => prev - 1), 1000);

// //   //     return () => clearTimeout(timer);

// //   //   }

// //   // }, [countDown]); // Countdown logic


// //   // console.log(cards)

// //   // Fetch user's bets from the backend based on userId
// //   const fetchBets = async () => {
// //     if (userData) {
// //       try {
// //         const userId = userData.id;
// //         const pappuBetsResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/pappu/bets/${userId}`);
// //         if (pappuBetsResponse.data.success) {
// //           // console.log(pappuBetsResponse.data)
// //           setTitlibets(pappuBetsResponse.data.bets);
// //         } else {
// //           alert("Failed to fetch user bets");
// //         }

// //       } catch (err) {
// //         console.error('Error fetching bets:', err);
// //         // alert("There was an error fetching bets.");
// //       }
// //     }
// //   };
// //   useEffect(() => {
// //     if (userData) {
// //       fetchBets();
// //     }
// //   }, [userData]);

// //   const [bettingDisabled, setBettingDisabled] = useState(false);
// // console.log(isUpdateResult, "updateResult")
// //   // Update your countdown useEffect to set bettingDisabled
// //   useEffect(() => {
// //     if (countDown > 0) {
// //       const timer = setTimeout(() => {
// //         setCountDown((prev) => prev - 1);
// //         // Disable betting when 10 seconds or less remain
// //         if (countDown <= 10) {
// //           setBettingDisabled(true);
// //         } else {
// //           setBettingDisabled(false);
// //         }
// //       }, 1000);

// //       return () => clearTimeout(timer);
// //     }
// //   }, [countDown]);

// //   const handleBetChange = (bet, profit) => {
// //     const selectedBet = parseInt(bet);
// //     setBetAmount(selectedBet);
// //     const selectedBetData = betPlaceAmt.find((item) => item.bet === selectedBet);
// //     // console.log(selectedBetData)
// //     if (selectedBetData) {
// //       setExpectedProfit(selectedBetData.profit);
// //       // setTotalProfit(selectedBetData.profit + (userData?.wallet?.balance || 0));
// //     }
// //   };
// //   // console.log(expectedProfit, "expectedProfit")

// //   useEffect(() => {
// //     if (betCooldown > 0) {
// //       const timer = setInterval(() => {
// //         setBetCooldown((prev) => prev - 1);
// //       }, 1000);
// //       return () => clearInterval(timer); // Cleanup timer
// //     }
// //   }, [betCooldown]);


// //   // const [isWin, setIsWin] = useState(false);
// //   useEffect(() => {
// //     if (profile && profile.walletBalance !== undefined) {
// //       setBalance(profile.walletBalance);
// //     }
// //   }, [profile]);
// //   const initializeGame = useCallback(() => {
// //     setCards(
// //       Array.from({ length: 24 }, (_, index) => ({
// //         id: index,
// //         scratched: false,
// //         revealedImage: null
// //       }))
// //     );
// //     setSelectedImages([]);
// //     setBetPlaced(false);
// //     setHighlightedImages([]);
// //     setWinningPointOfUser([]);
// //     setIsProcessing(false);
// //   }, []);

// //   useEffect(() => {
// //     initializeGame();
// //   }, [initializeGame]);

// //   const showPremiumPopup = (config) => {
// //     return Swal.fire({
// //       ...config,
// //       customClass: {
// //         popup: `${config.gradient} p-1 rounded-2xl shadow-2xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`,
// //         container: "backdrop-blur-sm",
// //         title: "text-white",
// //         htmlContainer: "text-white"
// //       },
// //       background: "transparent",
// //       showConfirmButton: false,
// //       timer: config.timer
// //     });
// //   };


// //   const handlePlay = useCallback(async () => {
// //     const date = new Date();
// //     const newgameId = `T${date.getTime().toString().padStart(3, '0')}`;
// //     localStorage.setItem('titligameId', newgameId)
// //     setGameId(newgameId)

// //     if (isProcessing) return;
// //     setIsProcessing(true);

// //     const totalBet = selectedCard.reduce((total, card) => total + card.betAmount, 0);

// //     if (!betAmount) {
// //       toast.error("⚠️ Select Bet Amount!");
// //       setIsProcessing(false);
// //       return;
// //     }
// //     if (totalBet <= 0) {
// //       toast.error("Total bet must be greater than 0.");
// //       setIsProcessing(false);
// //       return;
// //     }

// //     if (!betPlaced) {
// //       if (selectedImages.length > 0 && balance < totalBet) {
// //         await showPremiumPopup({
// //           title: '<div class="text-4xl">⚠️</div>',
// //           html: `<div class="space-y-2 text-center text-white">
// //             <div class="text-xl font-bold">Insufficient Balance!</div>
// //             <div class="text-sm opacity-75">Need ₹${totalBet - balance} more</div>
// //           </div>`,
// //           gradient: "bg-gradient-to-br from-red-600 via-rose-500 to-pink-600",
// //           timer: 3000
// //         });
// //         setIsProcessing(false);
// //         return;
// //       }
// //       await showPremiumPopup({
// //         html: `
// //          <div style="position: absolute; top: 120px; left: 50%; transform: translate(-50%, 0); background: black; opacity: 0.8; padding: 1rem 1rem; border-radius:0.2rem; text-align: center;">
// //             <div style="font-size: 1rem; color:green;">₹${totalBet} Bet Placed!</div>
// //           </div>
// //         `,
// //         background: "black",
// //         opacity: 0.8,
// //         position: "top-start",
// //         timer: 2000
// //       });
// //       if (selectedImages.length > 0) {
// //         setBalance((prev) => prev - totalBet);
// //         const allBet = selectedCard.reduce((total, card) => total + card.betAmount, 0);
// //         try {
// //           const response = await axios.post(
// //             `${process.env.REACT_APP_BASE_URL}/api/titli/new/bets`,
// //             {
// //               user: profile.userId,
// //               betAmount,
// //               selectedCard: selectedCard,
// //               totalBets: allBet,
// //               gameId: localStorage.getItem('titligameId'),
// //             }
// //           );

// //           if (response.data.newBalance) {
// //             setBalance(response.data.newBalance);
// //           }
// //           if (response.status === 200) {
// //             fetchNameWallet()
// //           }
// //         } catch (error) {
// //           console.error("Error creating bet:", error);
// //         }
// //       }
// //       setBetPlaced(true);
// //     }

// //     const nextCard = cards.find((card) => !card.scratched);
// //     if (!nextCard) {
// //       await showPremiumPopup({
// //         html: `
// //             <div style="position: absolute; top: 120px; left: 50%; transform: translate(-50%, 0); background: black; opacity: 0.8; padding: 1rem 1rem; border-radius:0.2rem; text-align: center;">
// //             <div style="font-size: 1.25rem; font-weight: bold;">Game Over!</div>
// //             <div style="font-size: 0.875rem; opacity: 0.75;">Final Balance: ₹${balance}</div>
// //           </div>
// //         `,
// //         gradient: "bg-gradient-to-br from-purple-600 via-indigo-500 to-blue-500",
// //         position: "top-start",
// //       });
// //       initializeGame();
// //       setIsProcessing(false);
// //       return;
// //     }
// // }, [isProcessing, selectedImages, betPlaced, balance, betAmount, cards, initializeGame, profile.id]);

// //   const toggleImageSelection = (image, betAmount, profit) => {
// //     // console.log(image, betAmount, profit)
// //     if (isProcessing) return;
// //     setSelectedImages((prev) => {
// //       if (prev.includes(image)) {
// //         return prev.filter((img) => img !== image);
// //       } else {
// //         return [...prev, image];
// //       }
// //     });

// //     setSelectedCard((prev) => {
// //       const newSelectedCard = [...prev];
// //       const index = newSelectedCard.findIndex((card) => card.image === image);
// //       if (index === -1) {
// //         newSelectedCard.push({ image, betAmount, profit });
// //       } else {
// //         newSelectedCard.splice(index, 1);
// //       }
// //       return newSelectedCard;
// //     });
// //   };
// //   // console.log(cards)

// //   return (
// //     <MainContainer>
// //       <Navbar />

// //       <FlexContainer>
// //         <BettingTable titlibets={titlibets} />
// //         {/* </HistoryContainer> */}
// //         <GameSection>
// //           <Timer>{countDown}:00</Timer>
// //           <Title>Titli Par</Title>
// //           <GameBoardContainer>
// //             <GameBoardWrapper>
// //               <GridContainer>
// //                 {cards.map((card) => (
// //                   <Card
// //                     key={card.id}
// //                     card={card}
// //                     isScratched={card.scratched}
// //                     revealedImage={card.revealedImage}
// //                   />
// //                 ))}
// //               </GridContainer>
// //             </GameBoardWrapper>
// //           </GameBoardContainer>
// //           {/* Images Selection */}
// //           <AllImages
// //             allWinningImages={allWinningImages}
// //             highlightedImages={highlightedImages}
// //             selectedImages={selectedImages}
// //             betAmount={betAmount}
// //             onImageClick={toggleImageSelection}
// //             isTimerActive={!isProcessing && !bettingDisabled} // Add bettingDisabled check
// //             disabled={isProcessing || bettingDisabled}
// //             selectedCard={selectedCard}
// //             profit={expectedProfit}
// //           />
// //           <InnerContainer>
// //             <BalanceSection>
// //               <BetAmountSection>
// //                 {betPlaceAmt.map(({ bet, profit }) => (
// //                   <button
// //                     key={bet}
// //                     onClick={() => handleBetChange(bet, profit)}
// //                     disabled={isProcessing || bettingDisabled || betCooldown > 10}
// //                     style={{
// //                       padding: '0.5rem 1rem',
// //                       borderRadius: '0.5rem',
// //                       margin: '0.1rem',
// //                       background: '#141a24',
// //                       width: "21%",
// //                       color: "white",
// //                       border: 'none',
// //                       cursor: 'pointer',
// //                       fontWeight: 'bold'
// //                     }}
// //                   >
// //                     {bet}
// //                   </button>
// //                 ))}
// //               </BetAmountSection>
// //             </BalanceSection>

// //             {/* Status Indicator */}
// //             <StatusText>{isProcessing ? "Processing..." : "Select Images!"}</StatusText>
// //             <PlaceBetButton onClick={handlePlay} disabled={isProcessing || bettingDisabled}>
// //               {countDown == 0 ? `Wait ${betCooldown}s` : "Place Bet"}
// //               {/* "Place Bet */}
// //             </PlaceBetButton>
// //           </InnerContainer>
// //         </GameSection>
// //       </FlexContainer>
// //       <ToastContainer position="top-right" autoClose={2000} />
// //     </MainContainer>


// //   );
// // };

// // export default Papu;
// // const Timer = styled.div`
// // background: linear-gradient(to right, #68d391, #00bcd4);
// // -webkit-background-clip: text;
// // // color: transparent;
// // color:white;
// // font-weight: bold;
// // font-size: 1.5rem;
// // `
// // // Styled Components
// // const MainContainer = styled.div`
// //   display: flex;
// //   flex-direction: column;
// //   // align-items: center;
// //   min-height: 100vh;
// //   background: linear-gradient(to bottom right, #1a202c, #141a24);
// //   // padding:  0.5rem 1rem;
// //   box-sizing:border-box;

// // `;


// // const Title = styled.h1`
// //   font-size: 2.25rem;
// //   font-weight: bold;
// //   color: transparent;
// //   background-clip: text;
// //   background-image: linear-gradient(to right, #fbbf24, #f59e0b);
// //   margin-bottom: 1rem;
// //   animation: pulse 2s infinite;
// //   @media (max-width: 768px) {
// //     display: none;
// //   }
// // `;

// // const GameBoardContainer = styled.div`
// //   width: 100%;
// //   max-width: 32rem;
// //   // background:red;
// //   background: linear-gradient(to bottom right, #2d3748, #1a202c);
// //   padding: 0.25rem;
// //   box-sizing:border-box;
// //   border-radius: 1rem;
// //   box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
// //   margin-bottom: 0rem;
// //     cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};

// // `;

// // const GameBoardWrapper = styled.div`
// //   background: rgba(26, 32, 44, 0.5);
// //   backdrop-filter: blur(5px);
// //   border-radius: 1rem;
// //   padding: 1rem;
// //     box-sizing:border-box;
// // `;

// // const GridContainer = styled.div`
// //   display: grid;
// //   grid-template-columns: repeat(6, 1fr);
// //   gap: 0.5rem;
// // `;

// // const InnerContainer = styled.div`
// //   background: linear-gradient(to bottom right, #2d3748, #1a202c);
// //   backdrop-filter: blur(8px);
// //   border-radius: 1rem;
// //   padding: 1rem;
// //   display: flex;
// //   flex-direction: column;
// //   gap: 0.5rem;
// //   width: 100%;
// //   margin-bottom: 2rem;
// //   max-width: 32rem;
// //   margin: 0 auto;
// //   box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
// //   justify-content: space-around;
// //   box-sizing:border-box;
// // `;

// // const BalanceSection = styled.div`
// //   display: flex;
// //   justify-content: space-between;
// //   align-items: center;
// //   flex-direction: column;
// //   padding: 0;
// // `;

// // const BalanceText = styled.div`
// //   background: linear-gradient(to right, #68d391, #00bcd4);
// //   -webkit-background-clip: text;
// //   color: transparent;
// //   font-weight: bold;
// //   h4 {
// //     margin: 0;
// //   }
// // `;

// // const BetAmountSection = styled.div`
// //   display: flex;
// //   // flex-direction: column;
// //   align-items: center;
// //   flex-wrap: wrap;
// //   justify-content: center;
// //   gap: 0.5rem;

// //   h5 {
// //     margin: 0;
// //     color: #00bcd4;
// //     font-weight: 600;
// //   }
// // `;

// // const BetAmountSelect = styled.select`
// //   background: linear-gradient(to bottom right, #4a5568, #2d3748);
// //   padding: 0.5rem 1rem;
// //   border-radius: 0.75rem;
// //   color: #00bcd4;
// //   font-weight: 600;
// //   border: 1px solid rgba(255, 255, 255, 0.1);
// //   &:focus {
// //     outline: none;
// //     box-shadow: 0 0 0 2px #00bcd4;
// //   }
// // `;

// // const StatusText = styled.div`
// //   text-align: center;
// //   font-size: 0.875rem;
// //   font-weight: 600;
// //   color: #48bb78;
// //   // animation: pulse 1s infinite;
// // `;

// // const PlaceBetButton = styled.button`
// //   background: #fbbf24;
// //   color: black;
// //   padding: 0.75rem 1.5rem;
// //   border-radius: 1rem;
// //   font-weight: bold;
// //   cursor: pointer;
// //   border: none;
// //   transition: background 0.3s;
// //   &:hover {
// //     background: #f59e0b;
// //   }
// //   &:disabled {
// //     background: gray;
// //     cursor: not-allowed;
// //   }
// // `;

// // const FlexContainer = styled.div`
// //   display: flex;
// //   gap: 2rem;
// //   justify-content: end;
// //   align-items: flex-start;
// //   width: 100%;
// //   // max-width: 1200px;
// //   margin: auto;
// //   flex-wrap:wrap;
// //   // background:red;
// //   box-sizing:border-box;
// //   @media (max-width: 768px) {
// //     flex-direction: column-reverse;
// //     padding:20% 10px 10px 10px;

// //   }
// // `;

// // const GameSection = styled.div`
// //   width: 80%; /* Takes up 2 parts of the space */
// //   display: flex;
// //   flex-direction: column;
// //   align-items: center;
// //   // background:red;
// //    @media (max-width: 768px) {
// //    width:100%;
// //   }

// // `;

// // const HistoryContainer = styled.div`
// //   flex: 1; /* Takes up 1 part of the space */
// // backeground:white;
// //   padding: 1rem;
// //   border-radius: 1rem;
// //   min-height: 300px;
// //   width: 30%;
// //   box-sizing:border-box;
// //   // margin-top:60px;
// //   // position:fixed;
// //   // top:10px;
// //   // right:0;
// //   @media (max-width: 768px) {
// //     position: unset;
// //     width:100%;
// //     margin-top:2px;
// //     width:100%;
// //     padding:0
// //   }
// // `;

// import React, { useState, useEffect, useCallback } from "react";
// import axios from "axios";
// import Card from "./Card";
// import AllImages from "./AllImages";
// import Swal from "sweetalert2";
// import "./Papu.css";
// import styled from "styled-components";
// // import { toast } from "react-toastify";
// import { useProfile, fetchNameWallet } from "../context/ProfileContext";
// import { toast, ToastContainer } from "react-toastify";
// // import History from "./History";
// // import DashboardNavbar from "../Pages/Dashboard/Components/Navbar";
// import Navbar from '../AllGamesNavbar/AllNavbar'
// import BettingTable from "./bettingTable";
// import io from 'socket.io-client';

// // Map of image names to numbers
// const IMAGE_NUMBER_MAPPING = {
//   "butterfly.jpg": 1,
//   "cow.jpg": 2,
//   "football.jpg": 3,
//   "spin.jpg": 4,
//   "flower.webp": 5,
//   "diya.webp": 6,
//   "bucket.jpg": 7,
//   "kite.webp": 8,
//   "rat.webp": 9,
//   "umberlla.jpg": 10,
//   "parrot.webp": 11,
//   "sun.webp": 12
// };

// const allWinningImages = [
//   { image: "butterfly.jpg", winningPoints: 10, imageNumber: 1 },
//   { image: "cow.jpg", winningPoints: 10, imageNumber: 2 },
//   { image: "football.jpg", winningPoints: 10, imageNumber: 3 },
//   { image: "spin.jpg", winningPoints: 10, imageNumber: 4 },
//   { image: "flower.webp", winningPoints: 10, imageNumber: 5 },
//   { image: "diya.webp", winningPoints: 10, imageNumber: 6 },
//   { image: "bucket.jpg", winningPoints: 10, imageNumber: 7 },
//   { image: "kite.webp", winningPoints: 10, imageNumber: 8 },
//   { image: "rat.webp", winningPoints: 10, imageNumber: 9 },
//   { image: "umberlla.jpg", winningPoints: 10, imageNumber: 10 },
//   { image: "parrot.webp", winningPoints: 10, imageNumber: 11 },
//   { image: "sun.webp", winningPoints: 10, imageNumber: 12 }
// ];

// const Papu = () => {
//   const { profile, fetchNameWallet } = useProfile();
//   const [winningPointOfUser, setWinningPointOfUser] = useState([]);
//   const [highlightedImages, setHighlightedImages] = useState([]);
//   const [cards, setCards] = useState([]);
//   const [balance, setBalance] = useState(profile.walletBalance);
//   const [selectedImages, setSelectedImages] = useState([]);
//   const [betPlaced, setBetPlaced] = useState(false);
//   const [isProcessing, setIsProcessing] = useState(true);
//   const [betCooldown, setBetCooldown] = useState(1);
//   const [selectedCard, setSelectedCard] = useState([]);
//   const [totalBetAmt, setTotalBetAmt] = useState(0)
//   const [gameId, setGameId] = useState("")
//   const [randomImage, setRandomImage] = useState(null);
//   const [countDown, setCountDown] = useState(30)
//   const [result, setResult] = useState(false)
//   const [socket, setSocket] = useState(null);
//   const [currentRoundId, setCurrentRoundId] = useState(null);
//   const [bettingDisabled, setBettingDisabled] = useState(false);
//   const [betAmount, setBetAmount] = useState(10);
//   const [expectedProfit, setExpectedProfit] = useState(100);
//   const [titlibets, setTitlibets] = useState([])
//   const [userData, setUserData] = useState(null);
//   const [exposure, setExposure] = useState(0);
//   const [isUpdateResult, setIsUpdateResult] = useState(false);
  
//   const betPlaceAmt = [
//     { bet: 10, profit: 100 },
//     { bet: 20, profit: 200 },
//     { bet: 50, profit: 500 },
//     { bet: 100, profit: 1000 },
//     { bet: 500, profit: 5000 },
//     { bet: 1000, profit: 10000 },
//     { bet: 2000, profit: 20000 },
//     { bet: 5000, profit: 50000 }
//   ];

//   // Define the showPremiumPopup function before any other function uses it
//   const showPremiumPopup = (config) => {
//     return Swal.fire({
//       ...config,
//       customClass: {
//         popup: `${config.gradient} p-1 rounded-2xl shadow-2xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`,
//         container: "backdrop-blur-sm",
//         title: "text-white",
//         htmlContainer: "text-white"
//       },
//       background: "transparent",
//       showConfirmButton: false,
//       timer: config.timer
//     });
//   };

//   // Initialize socket connection
//   useEffect(() => {
//     const newSocket = io(process.env.REACT_APP_BASE_URL);
//     setSocket(newSocket);

//     // Join the Titli game on connection
//     newSocket.on('connect', () => {
//       console.log('Connected to server with socket ID:', newSocket.id);
//       newSocket.emit('titli:join');
//     });

//     // Handle initial game state
//     newSocket.on('titli:gameState', (gameState) => {
//       console.log('Received game state:', gameState);
//       setCountDown(gameState.timeRemaining || 30);
//       setCurrentRoundId(gameState.roundId);
//       console.log(`Set current round ID to: ${gameState.roundId}`);
      
//       // Check if time is 15 seconds or less
//       if (gameState.timeRemaining <= 15) {
//         setBettingDisabled(true);
//         console.log('Betting disabled due to time <= 15 seconds');
//       } else {
//         setBettingDisabled(!gameState.bettingOpen);
//         console.log(`Betting ${gameState.bettingOpen ? 'enabled' : 'disabled'} according to game state`);
//       }
      
//       if (gameState.gamePhase === 'result' && gameState.winningImage) {
//         console.log(`Game in result phase. Winning image: ${gameState.winningImage}, number: ${gameState.winningImageNumber || 'unknown'}`);
//         setRandomImage(gameState.winningImage);
        
//         // Get the winning image number, either from data or determine it
//         let winningImageNumber = gameState.winningImageNumber;
        
//         if (!winningImageNumber && gameState.winningImage) {
//           // If winningImageNumber wasn't sent, find it from our mapping
//           winningImageNumber = IMAGE_NUMBER_MAPPING[gameState.winningImage] || null;
//           console.log('Determined winning image number from game state:', winningImageNumber);
//         }
        
//         revealResult(gameState.winningImage, winningImageNumber);
//       }
//     });

//     // Handle timer updates
//     newSocket.on('titli:timerUpdate', (data) => {
//       console.log('Timer update:', data);
//       setCountDown(data.timeRemaining);
      
//       // Disable betting when countdown reaches 15 seconds or less
//       if (data.timeRemaining <= 15) {
//         setBettingDisabled(true);
//         console.log('Betting disabled due to time <= 15 seconds');
//       } else {
//         setBettingDisabled(!data.bettingOpen);
//         console.log(`Betting ${data.bettingOpen ? 'enabled' : 'disabled'} according to timer update`);
//       }
      
//       setCurrentRoundId(data.roundId);
//       console.log(`Updated current round ID to: ${data.roundId}`);
//     });

//     // Handle new round starts
//     newSocket.on('titli:roundStart', (data) => {
//       console.log('New round started:', data);
      
//       // Update game state for the new round
//       setCurrentRoundId(data.roundId);
//       setGameId(data.roundId);
//       localStorage.setItem('titligameId', data.roundId);
//       setCountDown(data.timeRemaining);
      
//       // Enable betting at the start of a new round if time is > 15 seconds
//       if (data.timeRemaining > 15) {
//         setBettingDisabled(false);
//       } else {
//         setBettingDisabled(true);
//       }
      
//       setBetPlaced(false);
//       setSelectedImages([]);
//       setSelectedCard([]);
//       setIsProcessing(false);
//       setResult(false);
//       setRandomImage(null);
      
//       // Get all stored round results
//       const roundResults = JSON.parse(localStorage.getItem('roundResults') || '{}');
//       const roundIds = Object.keys(roundResults);
      
//       console.log(`Current rounds in storage: ${roundIds.length}`);
      
//       // Count unique images in all rounds (to check if container is full)
//       const uniqueImages = new Set();
//       for (const roundId of roundIds) {
//         uniqueImages.add(roundResults[roundId].image);
//       }
      
//       // If container is FULL (all 24 boxes with unique images), clear ALL previous results
//       if (uniqueImages.size >= 24) {
//         console.log('CONTAINER IS FULL (24 unique images) - CLEARING ALL PREVIOUS RESULTS');
//         localStorage.setItem('roundResults', JSON.stringify({}));
//       } else {
//         console.log(`Container has ${uniqueImages.size} unique images, continuing to store more results`);
//       }
      
//       // Clear current round's revealed images (this doesn't affect stored results)
//       localStorage.removeItem('revealedImages');
      
//       // Force clear and initialize cards
//       setCards([]);
//       setTimeout(() => {
//         initializeGame();
//       }, 100);
//     });

//     // Handle result reveal
//     newSocket.on('titli:revealResult', (data) => {
//       console.log('Result revealed from server:', data);
//       setRandomImage(data.winningImage);
      
//       // Get the winning image number, either from data or determine it based on the image
//       let winningImageNumber = data.winningImageNumber;
      
//       if (!winningImageNumber && data.winningImage) {
//         // If winningImageNumber wasn't sent, find it from our mapping
//         winningImageNumber = IMAGE_NUMBER_MAPPING[data.winningImage] || null;
//         console.log('Determined winning image number:', winningImageNumber);
//       }
      
//       // Make sure we have a currentRoundId
//       if (!currentRoundId) {
//         console.error("No currentRoundId found. Using data.roundId instead.");
//         setCurrentRoundId(data.roundId || `manual-${Date.now()}`);
//       }
      
//       // Log selected cards and check for matches
//       if (selectedCard.length > 0) {
//         console.log("Currently selected cards:", selectedCard);
        
//         // Check for any matches with winning image/number
//         const matchingCards = selectedCard.filter(card => {
//           const cardImageNumber = IMAGE_NUMBER_MAPPING[card.image];
//           const nameMatch = card.image === data.winningImage;
//           const numberMatch = cardImageNumber === winningImageNumber;
          
//           console.log(`Checking card ${card.image} (${cardImageNumber}) against winning ${data.winningImage} (${winningImageNumber}): ${nameMatch || numberMatch ? 'MATCH!' : 'no match'}`);
          
//           return nameMatch || numberMatch;
//         });
        
//         if (matchingCards.length > 0) {
//           console.log(`Found ${matchingCards.length} matching card(s)!`, matchingCards);
//         } else {
//           console.log("No matches found in selected cards.");
//         }
//       } else {
//         console.log("No cards selected for this round.");
//       }
      
//       // DEBUG: Check storage before adding result
//       const beforeResults = JSON.parse(localStorage.getItem('roundResults') || '{}');
//       console.log(`BEFORE: Storage has ${Object.keys(beforeResults).length} results`);
      
//       // Call revealResult with the winning image and number
//       revealResult(data.winningImage, winningImageNumber);
      
//       // DEBUG: Check storage after adding result
//       setTimeout(() => {
//         const afterResults = JSON.parse(localStorage.getItem('roundResults') || '{}');
//         console.log(`AFTER: Storage has ${Object.keys(afterResults).length} results`);
//         console.log('Stored round IDs:', Object.keys(afterResults).join(', '));
//       }, 1000);
//     });

//     // Handle next image in sequence
//     newSocket.on('titli:nextImage', (data) => {
//       console.log('Next image in sequence:', data);
//       if (data.winningImage && data.index !== undefined) {
//         // Get the winning image number, determine it if not provided
//         let winningImageNumber = data.winningImageNumber;
        
//         if (!winningImageNumber && data.winningImage) {
//           // If winningImageNumber wasn't sent, find it from our mapping
//           winningImageNumber = IMAGE_NUMBER_MAPPING[data.winningImage] || null;
//           console.log('Determined next image number:', winningImageNumber);
//         }
        
//         revealNextImage(data.index, data.winningImage, winningImageNumber);
//       }
//     });

//     // Handle win result notifications
//     newSocket.on('titli:winResult', (data) => {
//       console.log('Win result received:', data);
      
//       // Check if this win notification is for the current user
//       const currentUserId = profile?.userId;
//       if (currentUserId && data.userId === currentUserId) {
//         // Update balance with the profit
//         setBalance(prev => prev + data.profit);
        
//         // Show win popup
//         showPremiumPopup({
//           html: `
//             <div style="position: absolute; top: 120px; left: 50%; transform: translate(-50%, 0); background: black; opacity: 0.8; padding: 1rem 1rem; border-radius:0.2rem; text-align: center;">
//               <div style="font-size: 1.25rem; font-weight: bold;">You Won!</div>
//               <div style="font-size: 0.875rem;">₹${data.profit} Added!</div>
//             </div>
//           `,
//           gradient: "bg-gradient-to-br from-green-600 via-emerald-500 to-cyan-500",
//           timer: 3000,
//           position: "top-start",
//         });
        
//         // Highlight the winning image
//         if (data.winningImage) {
//           setHighlightedImages(prev => [...new Set([...prev, data.winningImage])]);
//         }
        
//         // Fetch updated wallet balance to stay in sync with server
//         fetchNameWallet();
//       }
//     });

//     // Cleanup on component unmount
//     return () => {
//       if (newSocket) {
//         newSocket.disconnect();
//       }
//     };
//   }, []);

//   // Function to reveal result
//   const revealResult = useCallback((winImage, winningImageNumber) => {
//     setIsProcessing(true);
//     setResult(true);
    
//     // Find first unrevealed card
//     const index = cards.findIndex(card => !card.revealedImage);
//     if (index === -1 || index >= 24) { // Check that index is within our 24-box grid
//       console.log("No empty cards found or index out of bounds, resetting a box for new result");
      
//       // Instead of returning, we'll find the oldest card to replace
//       setCards(prevCards => {
//         // Deep copy the cards
//         const updatedCards = JSON.parse(JSON.stringify(prevCards));
        
//         // Replace the oldest card (last one) with the new result
//         updatedCards[23] = { 
//           id: 23, 
//           revealedImage: winImage, 
//           loading: false,
//           scratched: true
//         };
        
//         // IMPORTANT: Store the result securely with timestamp
//         storeRoundResult(winImage, 23, winningImageNumber);
        
//         return updatedCards;
//       });
//     } else {
//       // Update cards with winning image
//       setCards(prevCards => {
//         const updatedCards = prevCards.map((card, i) =>
//           i === index ? { 
//             ...card, 
//             revealedImage: winImage, 
//             loading: false,
//             scratched: true
//           } : card
//         );
        
//         // IMPORTANT: Store the result securely with timestamp
//         storeRoundResult(winImage, index, winningImageNumber);
        
//         return updatedCards;
//       });
//     }
    
//     // Helper function to store round result
//     function storeRoundResult(image, boxIndex, winningImageNumber) {
//       try {
//         // Get all stored round results
//         let roundResults = {};
//         try {
//           roundResults = JSON.parse(localStorage.getItem('roundResults') || '{}');
//           // Validate the roundResults object
//           if (typeof roundResults !== 'object' || roundResults === null) {
//             console.error('Invalid roundResults, resetting to empty object');
//             roundResults = {};
//           }
//         } catch (err) {
//           console.error('Error parsing round results:', err);
//           roundResults = {};
//         }
        
//         // Generate a unique round ID if none exists
//         const safeRoundId = currentRoundId || `round-${Date.now()}`;
        
//         // Store this round's result with the current timestamp
//         roundResults[safeRoundId] = {
//           image: image,
//           timestamp: Date.now(),
//           boxIndex: boxIndex,
//           winningImageNumber: winningImageNumber
//         };
        
//         // Check if we have exceeded 50 stored results (for performance)
//         const roundIds = Object.keys(roundResults);
//         if (roundIds.length > 50) {
//           // If more than 50 results, keep only the newest 50
//           const sortedIds = roundIds.sort((a, b) => 
//             roundResults[b].timestamp - roundResults[a].timestamp
//           );
          
//           // Create new object with only the 50 most recent results
//           const trimmedResults = {};
//           sortedIds.slice(0, 50).forEach(id => {
//             trimmedResults[id] = roundResults[id];
//           });
          
//           roundResults = trimmedResults;
//         }
        
//         // Save to localStorage with extra validation
//         const resultString = JSON.stringify(roundResults);
//         localStorage.setItem('roundResults', resultString);
        
//         // Double check it was saved correctly
//         const verification = localStorage.getItem('roundResults');
//         if (!verification || verification !== resultString) {
//           console.error('Storage verification failed, trying backup method');
//           localStorage.removeItem('roundResults');
//           localStorage.setItem('roundResults', resultString);
//         }
        
//         console.log(`Saved result for round ${safeRoundId}: ${image} at box ${boxIndex}`);
//         console.log(`Total rounds in storage: ${Object.keys(roundResults).length}`);
        
//         // Also save to revealedImages for current round
//         const revealedImages = JSON.parse(localStorage.getItem('revealedImages') || '[]');
//         revealedImages.push({
//           index: boxIndex,
//           image: image,
//           roundId: safeRoundId
//         });
//         localStorage.setItem('revealedImages', JSON.stringify(revealedImages));
//       } catch (err) {
//         console.error('Failed to save round result:', err);
//       }
//     }
    
//     // Check if user won and handle rewards
//     const isMatch = selectedCard.some(card => {
//       // Get the imageNumber for this card from allWinningImages
//       const imageDetails = allWinningImages.find(img => img.image === card.image);
//       const cardImageNumber = imageDetails ? imageDetails.imageNumber : null;
      
//       console.log(`Checking bet: ${card.image} (${cardImageNumber}) against winner: ${winImage} (${winningImageNumber})`);
      
//       // Winning condition: either image name matches OR image number matches
//       const nameMatch = card.image === winImage;
//       const numberMatch = cardImageNumber !== null && winningImageNumber !== null && cardImageNumber === winningImageNumber;
      
//       if (nameMatch || numberMatch) {
//         console.log(`WIN! Match type: ${nameMatch ? 'Image Name' : 'Image Number'}`);
//         return true;
//       }
//       return false;
//     });
//     const allBet = selectedCard.reduce((total, card) => total + card.betAmount, 0);

//     if (isMatch) {
//       // Calculate which cards matched for proper profit calculation
//       let totalProfit = 0;
      
//       // Go through each selected card to calculate total profit
//       selectedCard.forEach(card => {
//         const imageDetails = allWinningImages.find(img => img.image === card.image);
//         const cardImageNumber = imageDetails ? imageDetails.imageNumber : null;
        
//         // If this specific card is a match, add its profit
//         if (card.image === winImage || (cardImageNumber !== null && winningImageNumber !== null && cardImageNumber === winningImageNumber)) {
//           // Add the profit for this card (10x the bet amount)
//           totalProfit += card.betAmount * 10;
//           // Highlight this winning image
//           setHighlightedImages(prev => [...new Set([...prev, card.image])]);
//         }
//       });
      
//       // Update balance with total profit
//       setBalance(prev => prev + totalProfit);
//       setWinningPointOfUser(prev => [...prev, 10]);
//       setTotalBetAmt(allBet);

//       // Show win popup
//       showPremiumPopup({
//         html: `
//           <div style="position: absolute; top: 120px; left: 50%; transform: translate(-50%, 0); background: black; opacity: 0.8; padding: 1rem 1rem; border-radius:0.2rem; text-align: center;">
//             <div style="font-size: 1.25rem; font-weight: bold;">You Won!</div>
//             <div style="font-size: 0.875rem;">₹${totalProfit} Added!</div>
//           </div>
//         `,
//         gradient: "bg-gradient-to-br from-green-600 via-emerald-500 to-cyan-500",
//         timer: 3000,
//         position: "top-start",
//       });
//     } else {
//       // Show lose popup
//       showPremiumPopup({
//         html: `
//           <div style="position: absolute; top: 120px; left: 50%; transform: translate(-50%, 0); background: black; opacity: 0.8; padding: 1rem 1rem; border-radius:0.2rem; text-align: center;">
//             <div style="font-size: 1.25rem; font-weight: bold;">Next Round!</div>
//             <div style="font-size: 0.875rem;">~~~~~~</div>
//           </div>
//         `,
//         gradient: "bg-gradient-to-br from-red-600 via-rose-500 to-pink-500",
//         timer: 3000,
//         position: "top-start",
//       });
//     }

//     // Continue to the next image reveal after a short delay
//     setTimeout(() => {
//       // Check if there are more cards to reveal
//       const nextIndex = cards.findIndex((card, i) => i > index && !card.revealedImage);
//       if (nextIndex !== -1 && nextIndex < 24) { // Make sure we don't go beyond 24 boxes
//         // Request next random image from server for continuous flow
//         if (socket) {
//           socket.emit('titli:requestNextImage', {
//             currentIndex: index,
//             gameId: currentRoundId
//           });
//         } else {
//           // Fallback if socket isn't available
//           fetchNextRandomImage(nextIndex);
//         }
//       } else {
//         // All cards revealed, prepare for next round
//         setIsProcessing(false);
//         setBetPlaced(false);
//         setSelectedImages([]);
//         setSelectedCard([]);
//         // New round will be started by server via socket
//       }
//     }, 3000); // Wait 3 seconds before proceeding to next image
//   }, [cards, selectedCard, expectedProfit, socket, currentRoundId, showPremiumPopup]);

//   // Fallback function to fetch next random image if socket is not available
//   const fetchNextRandomImage = async (nextIndex) => {
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_BASE_URL}/api/titli/get-random-image`
//       );
//       if (response.data.randomImage) {
//         setRandomImage(response.data.randomImage);
        
//         // Get the winning image number, determine it if not provided
//         let winningImageNumber = response.data.winningImageNumber;
        
//         if (!winningImageNumber && response.data.randomImage) {
//           // If winningImageNumber wasn't sent, find it from our mapping
//           winningImageNumber = IMAGE_NUMBER_MAPPING[response.data.randomImage] || null;
//           console.log('Determined fetched image number:', winningImageNumber);
//         }
        
//         revealNextImage(nextIndex, response.data.randomImage, winningImageNumber);
//       }
//       } catch (error) {
//       console.error("Error fetching next random image:", error);
//       setIsProcessing(false);
//     }
//   };

//   // Function to reveal the next image in sequence
//   const revealNextImage = useCallback((index, winImage, winningImageNumber) => {
//     if (index === -1 || !winImage) return;
    
//     // First check if this index already has an image
//     if (cards[index]?.revealedImage) {
//       // Find another empty slot
//       const emptyIndex = cards.findIndex(card => !card.revealedImage);
//       if (emptyIndex !== -1) {
//         index = emptyIndex;
//       } else {
//         // No empty slots, use the last slot
//         index = 23;
//       }
//     }
    
//     setCards(prevCards => {
//       // Mark this card as loading
//       const updatedCards = prevCards.map((card, i) =>
//         i === index ? { ...card, loading: true, scratched: true } : card
//       );
//       return updatedCards;
//     });
    
//     // Short delay to show loading state
//     setTimeout(() => {
//       setCards(prevCards => {
//         const updatedCards = prevCards.map((card, i) =>
//           i === index ? { 
//             ...card, 
//             revealedImage: winImage, 
//             loading: false,
//             scratched: true
//           } : card
//         );
        
//         // IMPORTANT: Store the result securely
//         try {
//           // Get all stored round results
//           let roundResults = {};
//           try {
//             roundResults = JSON.parse(localStorage.getItem('roundResults') || '{}');
//             if (typeof roundResults !== 'object' || roundResults === null) {
//               roundResults = {};
//             }
//           } catch (err) {
//             console.error('Error parsing round results:', err);
//             roundResults = {};
//           }
          
//           // Generate a safe round ID
//           const safeRoundId = currentRoundId || `round-${Date.now()}`;
          
//           // Store this round's result
//           roundResults[safeRoundId] = {
//             image: winImage,
//             timestamp: Date.now(),
//             boxIndex: index,
//             winningImageNumber: winningImageNumber
//           };
          
//           // Save to localStorage
//           localStorage.setItem('roundResults', JSON.stringify(roundResults));
          
//           // Verify the save worked
//           const verification = localStorage.getItem('roundResults');
//           const parsedVerification = JSON.parse(verification || '{}');
//           console.log(`VERIFICATION: Storage now has ${Object.keys(parsedVerification).length} results`);
          
//           // Save in revealed images for current round
//           const revealedImages = JSON.parse(localStorage.getItem('revealedImages') || '[]');
//           revealedImages.push({
//             index,
//             image: winImage,
//             roundId: safeRoundId,
//             winningImageNumber: winningImageNumber
//           });
//           localStorage.setItem('revealedImages', JSON.stringify(revealedImages));
//         } catch (err) {
//           console.error('Failed to save next round result:', err);
//         }
        
//         return updatedCards;
//       });
      
//       // Check if user won with this next image
//       const isMatch = selectedCard.some(card => {
//         // Get the imageNumber for this card from allWinningImages
//         const imageDetails = allWinningImages.find(img => img.image === card.image);
//         const cardImageNumber = imageDetails ? imageDetails.imageNumber : null;
        
//         console.log(`Checking next bet: ${card.image} (${cardImageNumber}) against winner: ${winImage} (${winningImageNumber})`);
        
//         // Winning condition: either image name matches OR image number matches
//         const nameMatch = card.image === winImage;
//         const numberMatch = cardImageNumber !== null && winningImageNumber !== null && cardImageNumber === winningImageNumber;
        
//         if (nameMatch || numberMatch) {
//           console.log(`NEXT WIN! Match type: ${nameMatch ? 'Image Name' : 'Image Number'}`);
//           return true;
//         }
//         return false;
//       });
      
//       if (isMatch) {
//         // Calculate which cards matched for proper profit calculation
//         let totalProfit = 0;
        
//         // Go through each selected card to calculate total profit
//         selectedCard.forEach(card => {
//           const imageDetails = allWinningImages.find(img => img.image === card.image);
//           const cardImageNumber = imageDetails ? imageDetails.imageNumber : null;
          
//           // If this specific card is a match, add its profit
//           if (card.image === winImage || (cardImageNumber !== null && winningImageNumber !== null && cardImageNumber === winningImageNumber)) {
//             // Add the profit for this card (10x the bet amount)
//             totalProfit += card.betAmount * 10;
//             // Highlight this winning image
//             setHighlightedImages(prev => [...new Set([...prev, card.image])]);
//           }
//         });
        
//         // Update balance with total profit
//         setBalance(prev => prev + totalProfit);
//         setWinningPointOfUser(prev => [...prev, 10]);
        
//         // Show win popup for this next reveal
//         showPremiumPopup({
//           html: `
//             <div style="position: absolute; top: 120px; left: 50%; transform: translate(-50%, 0); background: black; opacity: 0.8; padding: 1rem 1rem; border-radius:0.2rem; text-align: center;">
//               <div style="font-size: 1.25rem; font-weight: bold;">You Won Again!</div>
//               <div style="font-size: 0.875rem;">₹${totalProfit} Added!</div>
//             </div>
//           `,
//           gradient: "bg-gradient-to-br from-green-600 via-emerald-500 to-cyan-500",
//           timer: 3000,
//           position: "top-start",
//         });
//       }

//       // Continue to next image after a delay
//       setTimeout(() => {
//         const nextIndex = cards.findIndex((card, i) => i > index && !card.revealedImage);
//         if (nextIndex !== -1 && nextIndex < 24) { // Make sure we don't go beyond 24 boxes
//           if (socket) {
//             socket.emit('titli:requestNextImage', {
//               currentIndex: index,
//               gameId: currentRoundId
//             });
//           } else {
//             fetchNextRandomImage(nextIndex);
//           }
//         } else {
//           // All cards revealed, prepare for next round
//           setIsProcessing(false);
//           setBetPlaced(false);
//           setSelectedImages([]);
//           setSelectedCard([]);
//         }
//       }, 3000);
//     }, 1000);
//   }, [cards, selectedCard, expectedProfit, socket, currentRoundId, showPremiumPopup]);

//   useEffect(() => {
//     fetchNameWallet();
//   }, [fetchNameWallet]);

//   useEffect(() => {
//     const user = localStorage.getItem('user');
//     if (user) {
//       setUserData(JSON.parse(user));
//     } else {
//       alert("User is not logged in. Please log in to view your bets.");
//     }
//   }, []);

//   // Fetch user's bets
//   const fetchBets = async () => {
//     if (userData) {
//       try {
//         const userId = userData.id;
//         const pappuBetsResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/pappu/bets/${userId}`);
//         if (pappuBetsResponse.data.success) {
//           setTitlibets(pappuBetsResponse.data.bets);
//         } else {
//           alert("Failed to fetch user bets");
//         }
//       } catch (err) {
//         console.error('Error fetching bets:', err);
//         // alert("There was an error fetching bets.");
//       }
//     }
//   };
  
//   useEffect(() => {
//     if (userData) {
//       fetchBets();
//     }
//   }, [userData]);

//   const handleBetChange = (bet, profit) => {
//     const selectedBet = parseInt(bet);
//     setBetAmount(selectedBet);
//     const selectedBetData = betPlaceAmt.find((item) => item.bet === selectedBet);
//     // console.log(selectedBetData)
//     if (selectedBetData) {
//       setExpectedProfit(selectedBetData.profit);
//       // setTotalProfit(selectedBetData.profit + (userData?.wallet?.balance || 0));
//     }
//   };
//   // console.log(expectedProfit, "expectedProfit")

//   useEffect(() => {
//     if (betCooldown > 0) {
//       const timer = setInterval(() => {
//         setBetCooldown((prev) => prev - 1);
//       }, 1000);
//       return () => clearInterval(timer); // Cleanup timer
//     }
//   }, [betCooldown]);

//   // const [isWin, setIsWin] = useState(false);
//   useEffect(() => {
//     if (profile && profile.walletBalance !== undefined) {
//       setBalance(profile.walletBalance);
//     }
//   }, [profile]);
//   const initializeGame = useCallback(() => {
//     console.log('Initializing game with result history');
    
//     // Create a fresh set of cards - 24 BOXES
//     const newCards = Array.from({ length: 24 }, (_, index) => ({
//       id: index,
//       scratched: false,
//       revealedImage: null,
//       loading: false
//     }));
    
//     try {
//       // Get all stored round results with improved error handling
//       let roundResults = {};
//       try {
//         const storedResults = localStorage.getItem('roundResults');
//         if (storedResults) {
//           roundResults = JSON.parse(storedResults);
//           // Ensure we have an object
//           if (!roundResults || typeof roundResults !== 'object') {
//             console.warn('Invalid roundResults format, resetting');
//             roundResults = {};
//           }
//         }
//       } catch (err) {
//         console.error('Error parsing roundResults:', err);
//         roundResults = {};
//       }
      
//       const roundIds = Object.keys(roundResults);
//       console.log(`Found ${roundIds.length} stored results`);
      
//       // Filter out duplicate images to ensure we only display one of each
//       const seenImages = new Set();
//       const uniqueImageEntries = [];
      
//       // Sort by timestamp (newest first)
//       const sortedRoundIds = roundIds.sort((a, b) => 
//         roundResults[b].timestamp - roundResults[a].timestamp
//       );
      
//       // Keep one of each unique image
//       for (const roundId of sortedRoundIds) {
//         const result = roundResults[roundId];
//         if (result && result.image && !seenImages.has(result.image)) {
//           uniqueImageEntries.push({
//             roundId,
//             image: result.image,
//             timestamp: result.timestamp,
//             boxIndex: result.boxIndex || 0
//           });
//           seenImages.add(result.image);
//         }
//       }
      
//       console.log(`After filtering, showing ${uniqueImageEntries.length} unique images`);
      
//       // Check if all 24 boxes would be filled - if so, we'll only display the newest results
//       if (uniqueImageEntries.length >= 24) {
//         console.log('Container has 24+ unique images, showing only the most recent 24');
//         uniqueImageEntries.splice(24); // Keep only the first 24 entries
//       }
      
//       // Fill cards with unique images (each image gets one box)
//       uniqueImageEntries.forEach((entry, idx) => {
//         if (idx < newCards.length) {
//           newCards[idx].revealedImage = entry.image;
//           newCards[idx].scratched = true;
//           console.log(`Added ${entry.image} from round ${entry.roundId} at position ${idx}`);
//         }
//       });
      
//       // Also add current round's revealed images if they're not already in the grid
//       if (currentRoundId) {
//         const currentRevealedImages = JSON.parse(localStorage.getItem('revealedImages') || '[]');
        
//         // Process each revealed image for current round
//         for (const revealedImage of currentRevealedImages) {
//           // Only add if this image is not already in our grid
//           if (!seenImages.has(revealedImage.image)) {
//             // Find the next available slot
//             const nextAvailableSlot = newCards.findIndex(card => !card.revealedImage);
//             if (nextAvailableSlot !== -1) {
//               newCards[nextAvailableSlot].revealedImage = revealedImage.image;
//               newCards[nextAvailableSlot].scratched = true;
//               seenImages.add(revealedImage.image);
//               console.log(`Added current round image ${revealedImage.image} to position ${nextAvailableSlot}`);
//             }
//           }
//         }
//       }
//     } catch (error) {
//       console.error('Error loading results:', error);
//     }
    
//     setCards(newCards);
//     setSelectedImages([]);
//     setBetPlaced(false);
//     setHighlightedImages([]);
//     setWinningPointOfUser([]);
//     setIsProcessing(false);
//   }, [currentRoundId]);

//   useEffect(() => {
//     initializeGame();
//   }, [initializeGame]);

//   // Handle play/bet button click
//   const handlePlay = useCallback(async () => {
//     if (isProcessing || betPlaced || bettingDisabled) return;
//     setIsProcessing(true);

//     // Check if any images are selected
//     if (selectedImages.length === 0) {
//       showPremiumPopup({
//         html: `
//           <div style="position: absolute; top: 120px; left: 50%; transform: translate(-50%, 0); background: black; opacity: 0.8; padding: 1rem 1rem; border-radius:0.2rem; text-align: center;">
//             <div style="font-size: 1.25rem; font-weight: bold;">Select Images!</div>
//             <div style="font-size: 0.875rem;">Please select at least one image.</div>
//           </div>
//         `,
//         gradient: "bg-gradient-to-br from-yellow-600 via-amber-500 to-orange-500",
//         timer: 3000
//       });
//       setIsProcessing(false);
//       return;
//     }

//     // Calculate total bet amount
//     const totalBet = selectedCard.reduce((total, card) => total + card.betAmount, 0);
    
//     console.log("Selected cards for bet:", selectedCard);
//     console.log("Total bet amount:", totalBet);
//     console.log("Current round ID:", currentRoundId);
//     console.log("Using gameId:", currentRoundId || localStorage.getItem('titligameId'));

//     // Check if user has enough balance
//     if (balance < totalBet) {
//       showPremiumPopup({
//         html: `
//           <div style="position: absolute; top: 120px; left: 50%; transform: translate(-50%, 0); background: black; opacity: 0.8; padding: 1rem 1rem; border-radius:0.2rem; text-align: center;">
//             <div class="text-xl font-bold">Insufficient Balance!</div>
//             <div class="text-sm opacity-75">Need ₹${totalBet - balance} more</div>
//           </div>`,
//         gradient: "bg-gradient-to-br from-red-600 via-rose-500 to-pink-600",
//         timer: 3000
//       });
//       setIsProcessing(false);
//       return;
//     }
    
//     await showPremiumPopup({
//       html: `
//        <div style="position: absolute; top: 120px; left: 50%; transform: translate(-50%, 0); background: black; opacity: 0.8; padding: 1rem 1rem; border-radius:0.2rem; text-align: center;">
//           <div style="font-size: 1rem; color:green;">₹${totalBet} Bet Placed!</div>
//         </div>
//       `,
//       background: "black",
//       opacity: 0.8,
//       position: "top-start",
//       timer: 2000
//     });
    
//     if (selectedImages.length > 0) {
//       // Temporarily deduct from local balance for UI feedback
//       setBalance((prev) => prev - totalBet);
//       const allBet = selectedCard.reduce((total, card) => total + card.betAmount, 0);
      
//       // Use gameId from current round or from localStorage
//       const gameIdToUse = currentRoundId || localStorage.getItem('titligameId');
      
//       try {
//         console.log(`Placing bet for game ${gameIdToUse} with ${selectedCard.length} images`);
        
//         const response = await axios.post(
//           `${process.env.REACT_APP_BASE_URL}/api/titli/new/bets`,
//           {
//             user: profile.userId,
//             betAmount,
//             selectedCard: selectedCard,
//             totalBets: allBet,
//             gameId: gameIdToUse,
//           }
//         );

//         console.log("Bet response:", response.data);

//         if (response.data.newBalance !== undefined) {
//           setBalance(response.data.newBalance);
//         }
//         if (response.status === 200 || response.status === 201) {
//           fetchNameWallet();
          
//           // Notify socket about bet placement
//           if (socket) {
//             socket.emit('titli:placeBet', {
//               user: profile.userId,
//               selectedCard: selectedCard,
//               totalBets: allBet,
//               gameId: gameIdToUse
//             });
//           }
//         }
//       } catch (error) {
//         console.error("Error creating bet:", error);
//         // Restore balance if bet failed
//         setBalance((prev) => prev + totalBet);
        
//         showPremiumPopup({
//           html: `
//             <div style="position: absolute; top: 120px; left: 50%; transform: translate(-50%, 0); background: black; opacity: 0.8; padding: 1rem 1rem; border-radius:0.2rem; text-align: center;">
//               <div style="font-size: 1.25rem; font-weight: bold;">Bet Failed!</div>
//               <div style="font-size: 0.875rem;">Please try again.</div>
//             </div>
//           `,
//           gradient: "bg-gradient-to-br from-red-600 via-rose-500 to-pink-600",
//           timer: 3000
//         });
//       }
//     }
//     setBetPlaced(true);
//     setIsProcessing(false);
//   }, [isProcessing, selectedImages, betPlaced, balance, betAmount, profile.userId, selectedCard, socket, currentRoundId, showPremiumPopup, bettingDisabled, fetchNameWallet]);

//   const toggleImageSelection = (image, betAmount, profit) => {
//     if (isProcessing || bettingDisabled) return;
    
//     setSelectedImages((prev) => {
//       if (prev.includes(image)) {
//         return prev.filter((img) => img !== image);
//       } else {
//         return [...prev, image];
//       }
//     });

//     setSelectedCard((prev) => {
//       const newSelectedCard = [...prev];
//       const index = newSelectedCard.findIndex((card) => card.image === image);
//       if (index === -1) {
//         newSelectedCard.push({ image, betAmount, profit });
//       } else {
//         newSelectedCard.splice(index, 1);
//       }
//       return newSelectedCard;
//     });
//   };
//   // console.log(cards)

//   return (
//     <MainContainer>
//       <Navbar />

//       <FlexContainer>
//         <BettingTable titlibets={titlibets} />
//         {/* </HistoryContainer> */}
//         <GameSection>
//           <Timer>{countDown}:00</Timer>
//           <Title>Titli Par</Title>
//           <GameBoardContainer>
//             <GameBoardWrapper>
//               <GridContainer>
//                 {cards.map((card) => (
//                   <Card
//                     key={card.id}
//                     card={card}
//                     isScratched={card.scratched}
//                     revealedImage={card.revealedImage}
//                   />
//                 ))}
//               </GridContainer>
//             </GameBoardWrapper>
//           </GameBoardContainer>
//           {/* Images Selection */}
//           <AllImages
//             allWinningImages={allWinningImages}
//             highlightedImages={highlightedImages}
//             selectedImages={selectedImages}
//             betAmount={betAmount}
//             onImageClick={toggleImageSelection}
//             isTimerActive={!isProcessing && !bettingDisabled}
//             disabled={isProcessing || bettingDisabled}
//             selectedCard={selectedCard}
//             profit={expectedProfit}
//           />
//           <InnerContainer>
//             <BalanceSection>
//               <BetAmountSection>
//                 {betPlaceAmt.map(({ bet, profit }) => (
//                   <button
//                     key={bet}
//                     onClick={() => handleBetChange(bet, profit)}
//                     disabled={isProcessing || bettingDisabled || betCooldown > 10}
//                     style={{
//                       padding: '0.5rem 1rem',
//                       borderRadius: '0.5rem',
//                       margin: '0.1rem',
//                       background: '#141a24',
//                       width: "21%",
//                       color: "white",
//                       border: 'none',
//                       cursor: 'pointer',
//                       fontWeight: 'bold'
//                     }}
//                   >
//                     {bet}
//                   </button>
//                 ))}
//               </BetAmountSection>
//             </BalanceSection>

//             {/* Status Indicator with countdown notice */}
//             <StatusText>
//               {isProcessing 
//                 ? "Processing..." 
//                 : bettingDisabled 
//                   ? countDown <= 15 
//                     ? `Betting Closed! Waiting for result in ${countDown}s` 
//                     : "Betting Closed!" 
//                   : "Select Images!"}
//             </StatusText>
            
//             <PlaceBetButton 
//               onClick={handlePlay} 
//               disabled={isProcessing || bettingDisabled || betPlaced}
//             >
//               {betPlaced ? "Bet Placed" : "Place Bet"}
//             </PlaceBetButton>
//           </InnerContainer>
//         </GameSection>
//       </FlexContainer>
//       <ToastContainer position="top-right" autoClose={2000} />
//     </MainContainer>
//   );
// };

// export default Papu;

// const Timer = styled.div`
// background: linear-gradient(to right, #68d391, #00bcd4);
// -webkit-background-clip: text;
// // color: transparent;
// color:white;
// font-weight: bold;
// font-size: 1.5rem;
// `
// // Styled Components
// const MainContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   // align-items: center;
//   min-height: 100vh;
//   background: linear-gradient(to bottom right, #1a202c, #141a24);
//   // padding:  0.5rem 1rem;
//   box-sizing:border-box;

// `;


// const Title = styled.h1`
//   font-size: 2.25rem;
//   font-weight: bold;
//   color: transparent;
//   background-clip: text;
//   background-image: linear-gradient(to right, #fbbf24, #f59e0b);
//   margin-bottom: 1rem;
//   animation: pulse 2s infinite;
//   @media (max-width: 768px) {
//     display: none;
//   }
// `;

// const GameBoardContainer = styled.div`
//   width: 100%;
//   max-width: 32rem;
//   // background:red;
//   background: linear-gradient(to bottom right, #2d3748, #1a202c);
//   padding: 0.25rem;
//   box-sizing:border-box;
//   border-radius: 1rem;
//   box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
//   margin-bottom: 0rem;
//     cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};

// `;

// const GameBoardWrapper = styled.div`
//   background: rgba(26, 32, 44, 0.5);
//   backdrop-filter: blur(5px);
//   border-radius: 1rem;
//   padding: 1rem;
//     box-sizing:border-box;
// `;

// const GridContainer = styled.div`
//   display: grid;
//   grid-template-columns: repeat(6, 1fr);
//   gap: 0.5rem;
  
//   /* Make all boxes square */
//   & > div {
//     aspect-ratio: 1 / 1;
//   }
// `;

// const InnerContainer = styled.div`
//   background: linear-gradient(to bottom right, #2d3748, #1a202c);
//   backdrop-filter: blur(8px);
//   border-radius: 1rem;
//   padding: 1rem;
//   display: flex;
//   flex-direction: column;
//   gap: 0.5rem;
//   width: 100%;
//   margin-bottom: 2rem;
//   max-width: 32rem;
//   margin: 0 auto;
//   box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
//   justify-content: space-around;
//   box-sizing:border-box;
// `;

// const BalanceSection = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   flex-direction: column;
//   padding: 0;
// `;

// const BalanceText = styled.div`
//   background: linear-gradient(to right, #68d391, #00bcd4);
//   -webkit-background-clip: text;
//   color: transparent;
//   font-weight: bold;
//   h4 {
//     margin: 0;
//   }
// `;

// const BetAmountSection = styled.div`
//   display: flex;
//   // flex-direction: column;
//   align-items: center;
//   flex-wrap: wrap;
//   justify-content: center;
//   gap: 0.5rem;

//   h5 {
//     margin: 0;
//     color: #00bcd4;
//     font-weight: 600;
//   }
// `;

// const BetAmountSelect = styled.select`
//   background: linear-gradient(to bottom right, #4a5568, #2d3748);
//   padding: 0.5rem 1rem;
//   border-radius: 0.75rem;
//   color: #00bcd4;
//   font-weight: 600;
//   border: 1px solid rgba(255, 255, 255, 0.1);
//   &:focus {
//     outline: none;
//     box-shadow: 0 0 0 2px #00bcd4;
//   }
// `;

// const StatusText = styled.div`
//   text-align: center;
//   font-size: 0.875rem;
//   font-weight: 600;
//   color: #48bb78;
//   // animation: pulse 1s infinite;
// `;

// const PlaceBetButton = styled.button`
//   background: #fbbf24;
//   color: black;
//   padding: 0.75rem 1.5rem;
//   border-radius: 1rem;
//   font-weight: bold;
//   cursor: pointer;
//   border: none;
//   transition: background 0.3s;
//   &:hover {
//     background: #f59e0b;
//   }
//   &:disabled {
//     background: gray;
//     cursor: not-allowed;
//   }
// `;

// const FlexContainer = styled.div`
//   display: flex;
//   gap: 2rem;
//   justify-content: end;
//   align-items: flex-start;
//   width: 100%;
//   // max-width: 1200px;
//   margin: auto;
//   flex-wrap:wrap;
//   // background:red;
//   box-sizing:border-box;
//   @media (max-width: 768px) {
//     flex-direction: column-reverse;
//     padding:20% 10px 10px 10px;

//   }
// `;

// const GameSection = styled.div`
//   width: 80%; /* Takes up 2 parts of the space */
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   // background:red;
//    @media (max-width: 768px) {
//    width:100%;
//   }

// `;

// const HistoryContainer = styled.div`
//   flex: 1; /* Takes up 1 part of the space */
//   background: white;
//   padding: 1rem;
//   border-radius: 1rem;
//   min-height: 300px;
//   width: 30%;
//   box-sizing:border-box;
//   // margin-top:60px;
//   // position:fixed;
//   // top:10px;
//   // right:0;
//   @media (max-width: 768px) {
//     position: unset;
//     width:100%;
//     margin-top:2px;
//     width:100%;
//     padding:0
//   }
// `;


import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Card from "./Card";
import AllImages from "./AllImages";
import Swal from "sweetalert2";
import "./Papu.css";
import styled from "styled-components";
// import { toast } from "react-toastify";
import { useProfile, fetchNameWallet } from "../context/ProfileContext";
import { toast, ToastContainer } from "react-toastify";
// import History from "./History";
// import DashboardNavbar from "../Pages/Dashboard/Components/Navbar";
import Navbar from '../AllGamesNavbar/AllNavbar'
import BettingTable from "./bettingTable";
import io from 'socket.io-client';

// Map of image names to numbers
const IMAGE_NUMBER_MAPPING = {
  "butterfly.jpg": 1,
  "cow.jpg": 2,
  "football.jpg": 3,
  "spin.jpg": 4,
  "flower.webp": 5,
  "diya.webp": 6,
  "bucket.jpg": 7,
  "kite.webp": 8,
  "rat.webp": 9,
  "umberlla.jpg": 10,
  "parrot.webp": 11,
  "sun.webp": 12
};

const allWinningImages = [
  { image: "butterfly.jpg", winningPoints: 10, imageNumber: 1 },
  { image: "cow.jpg", winningPoints: 10, imageNumber: 2 },
  { image: "football.jpg", winningPoints: 10, imageNumber: 3 },
  { image: "spin.jpg", winningPoints: 10, imageNumber: 4 },
  { image: "flower.webp", winningPoints: 10, imageNumber: 5 },
  { image: "diya.webp", winningPoints: 10, imageNumber: 6 },
  { image: "bucket.jpg", winningPoints: 10, imageNumber: 7 },
  { image: "kite.webp", winningPoints: 10, imageNumber: 8 },
  { image: "rat.webp", winningPoints: 10, imageNumber: 9 },
  { image: "umberlla.jpg", winningPoints: 10, imageNumber: 10 },
  { image: "parrot.webp", winningPoints: 10, imageNumber: 11 },
  { image: "sun.webp", winningPoints: 10, imageNumber: 12 }
];

const Papu = () => {
  const { profile, fetchNameWallet } = useProfile();
  const [winningPointOfUser, setWinningPointOfUser] = useState([]);
  const [highlightedImages, setHighlightedImages] = useState([]);
  const [cards, setCards] = useState([]);
  const [balance, setBalance] = useState(profile.walletBalance);
  const [selectedImages, setSelectedImages] = useState([]);
  const [betPlaced, setBetPlaced] = useState(false);
  const [isProcessing, setIsProcessing] = useState(true);
  const [betCooldown, setBetCooldown] = useState(1);
  const [selectedCard, setSelectedCard] = useState([]);
  const [totalBetAmt, setTotalBetAmt] = useState(0)
  const [gameId, setGameId] = useState("")
  const [randomImage, setRandomImage] = useState(null);
  const [countDown, setCountDown] = useState(30)
  const [result, setResult] = useState(false)
  const [socket, setSocket] = useState(null);
  const [currentRoundId, setCurrentRoundId] = useState(null);
  const [bettingDisabled, setBettingDisabled] = useState(false);
  const [betAmount, setBetAmount] = useState(10);
  const [expectedProfit, setExpectedProfit] = useState(100);
  const [titlibets, setTitlibets] = useState([])
  const [userData, setUserData] = useState(null);
  const [exposure, setExposure] = useState(0);
  const [isUpdateResult, setIsUpdateResult] = useState(false);
  
  const betPlaceAmt = [
    { bet: 10, profit: 100 },
    { bet: 20, profit: 200 },
    { bet: 50, profit: 500 },
    { bet: 100, profit: 1000 },
    { bet: 500, profit: 5000 },
    { bet: 1000, profit: 10000 },
    { bet: 2000, profit: 20000 },
    { bet: 5000, profit: 50000 }
  ];

  // Define the showPremiumPopup function before any other function uses it
  const showPremiumPopup = (config) => {
    return Swal.fire({
      ...config,
      customClass: {
        popup: `${config.gradient} p-1 rounded-2xl shadow-2xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`,
        container: "backdrop-blur-sm",
        title: "text-white",
        htmlContainer: "text-white"
      },
      background: "transparent",
      showConfirmButton: false,
      timer: config.timer
    });
  };

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_BASE_URL);
    setSocket(newSocket);

    // Join the Titli game on connection
    newSocket.on('connect', () => {
      console.log('Connected to server with socket ID:', newSocket.id);
      newSocket.emit('titli:join');
    });

    // Handle initial game state
    newSocket.on('titli:gameState', (gameState) => {
      console.log('Received game state:', gameState);
      setCountDown(gameState.timeRemaining || 30);
      setCurrentRoundId(gameState.roundId);
      console.log(`Set current round ID to: ${gameState.roundId}`);
      
      // Check if time is 15 seconds or less
      if (gameState.timeRemaining <= 15) {
        setBettingDisabled(true);
        console.log('Betting disabled due to time <= 15 seconds');
      } else {
        setBettingDisabled(!gameState.bettingOpen);
        console.log(`Betting ${gameState.bettingOpen ? 'enabled' : 'disabled'} according to game state`);
      }
      
      if (gameState.gamePhase === 'result' && gameState.winningImage) {
        console.log(`Game in result phase. Winning image: ${gameState.winningImage}, number: ${gameState.winningImageNumber || 'unknown'}`);
        setRandomImage(gameState.winningImage);
        
        // Get the winning image number, either from data or determine it
        let winningImageNumber = gameState.winningImageNumber;
        
        if (!winningImageNumber && gameState.winningImage) {
          // If winningImageNumber wasn't sent, find it from our mapping
          winningImageNumber = IMAGE_NUMBER_MAPPING[gameState.winningImage] || null;
          console.log('Determined winning image number from game state:', winningImageNumber);
        }
        
        revealResult(gameState.winningImage, winningImageNumber);
      }
    });

    // Handle timer updates
    newSocket.on('titli:timerUpdate', (data) => {
      console.log('Timer update:', data);
      setCountDown(data.timeRemaining);
      
      // Disable betting when countdown reaches 15 seconds or less
      if (data.timeRemaining <= 15) {
        setBettingDisabled(true);
        console.log('Betting disabled due to time <= 15 seconds');
      } else {
        setBettingDisabled(!data.bettingOpen);
        console.log(`Betting ${data.bettingOpen ? 'enabled' : 'disabled'} according to timer update`);
      }
      
      setCurrentRoundId(data.roundId);
      console.log(`Updated current round ID to: ${data.roundId}`);
    });

    // Handle new round starts
    newSocket.on('titli:roundStart', (data) => {
      console.log('New round started:', data);
      
      // Update game state for the new round
      setCurrentRoundId(data.roundId);
      setGameId(data.roundId);
      localStorage.setItem('titligameId', data.roundId);
      setCountDown(data.timeRemaining);
      
      // Enable betting at the start of a new round if time is > 15 seconds
      if (data.timeRemaining > 15) {
        setBettingDisabled(false);
      } else {
        setBettingDisabled(true);
      }
      
      setBetPlaced(false);
      setSelectedImages([]);
      setSelectedCard([]);
      setIsProcessing(false);
      setResult(false);
      setRandomImage(null);
      
      // Get all stored round results
      const roundResults = JSON.parse(localStorage.getItem('roundResults') || '{}');
      const roundIds = Object.keys(roundResults);
      
      console.log(`Current rounds in storage: ${roundIds.length}`);
      
      // Count unique images in all rounds (to check if container is full)
      const uniqueImages = new Set();
      for (const roundId of roundIds) {
        uniqueImages.add(roundResults[roundId].image);
      }
      
      // If container is FULL (all 24 boxes with unique images), clear ALL previous results
      if (uniqueImages.size >= 12) {
        console.log('CONTAINER IS FULL (24 unique images) - CLEARING ALL PREVIOUS RESULTS');
        localStorage.setItem('roundResults', JSON.stringify({}));
      } else {
        console.log(`Container has ${uniqueImages.size} unique images, continuing to store more results`);
      }
      
      // Clear current round's revealed images (this doesn't affect stored results)
      localStorage.removeItem('revealedImages');
      
      // Force clear and initialize cards
      setCards([]);
      setTimeout(() => {
        initializeGame();
      }, 100);
    });

    // Handle result reveal
    newSocket.on('titli:revealResult', (data) => {
      console.log('Result revealed from server:', data);
      setRandomImage(data.winningImage);
      
      // Get the winning image number, either from data or determine it based on the image
      let winningImageNumber = data.winningImageNumber;
      
      if (!winningImageNumber && data.winningImage) {
        // If winningImageNumber wasn't sent, find it from our mapping
        winningImageNumber = IMAGE_NUMBER_MAPPING[data.winningImage] || null;
        console.log('Determined winning image number:', winningImageNumber);
      }
      
      // Make sure we have a currentRoundId
      if (!currentRoundId) {
        console.error("No currentRoundId found. Using data.roundId instead.");
        setCurrentRoundId(data.roundId || `manual-${Date.now()}`);
      }
      
      // Log selected cards and check for matches
      if (selectedCard.length > 0) {
        console.log("Currently selected cards:", selectedCard);
        
        // Check for any matches with winning image/number
        const matchingCards = selectedCard.filter(card => {
          const cardImageNumber = IMAGE_NUMBER_MAPPING[card.image];
          const nameMatch = card.image === data.winningImage;
          const numberMatch = cardImageNumber === winningImageNumber;
          
          console.log(`Checking card ${card.image} (${cardImageNumber}) against winning ${data.winningImage} (${winningImageNumber}): ${nameMatch || numberMatch ? 'MATCH!' : 'no match'}`);
          
          return nameMatch || numberMatch;
        });
        
        if (matchingCards.length > 0) {
          console.log(`Found ${matchingCards.length} matching card(s)!`, matchingCards);
        } else {
          console.log("No matches found in selected cards.");
        }
      } else {
        console.log("No cards selected for this round.");
      }
      
      // DEBUG: Check storage before adding result
      const beforeResults = JSON.parse(localStorage.getItem('roundResults') || '{}');
      console.log(`BEFORE: Storage has ${Object.keys(beforeResults).length} results`);
      
      // Call revealResult with the winning image and number
      revealResult(data.winningImage, winningImageNumber);
      
      // DEBUG: Check storage after adding result
      setTimeout(() => {
        const afterResults = JSON.parse(localStorage.getItem('roundResults') || '{}');
        console.log(`AFTER: Storage has ${Object.keys(afterResults).length} results`);
        console.log('Stored round IDs:', Object.keys(afterResults).join(', '));
      }, 1000);
    });

    // Handle next image in sequence
    newSocket.on('titli:nextImage', (data) => {
      console.log('Next image in sequence:', data);
      if (data.winningImage && data.index !== undefined) {
        // Get the winning image number, determine it if not provided
        let winningImageNumber = data.winningImageNumber;
        
        if (!winningImageNumber && data.winningImage) {
          // If winningImageNumber wasn't sent, find it from our mapping
          winningImageNumber = IMAGE_NUMBER_MAPPING[data.winningImage] || null;
          console.log('Determined next image number:', winningImageNumber);
        }
        
        revealNextImage(data.index, data.winningImage, winningImageNumber);
      }
    });

    // Handle win result notifications
    newSocket.on('titli:winResult', (data) => {
      console.log('Win result received:', data);
      
      // Check if this win notification is for the current user
      const currentUserId = profile?.userId;
      if (currentUserId && data.userId === currentUserId) {
        // Update balance with the profit
        setBalance(prev => prev + data.profit);
        
        // Show win popup
        showPremiumPopup({
          html: `
            <div style="position: absolute; top: 120px; left: 50%; transform: translate(-50%, 0); background: black; opacity: 0.8; padding: 1rem 1rem; border-radius:0.2rem; text-align: center;">
              <div style="font-size: 1.25rem; font-weight: bold;">You Won!</div>
              <div style="font-size: 0.875rem;">₹${data.profit} Added!</div>
            </div>
          `,
          gradient: "bg-gradient-to-br from-green-600 via-emerald-500 to-cyan-500",
          timer: 3000,
          position: "top-start",
        });
        
        // Highlight the winning image
        if (data.winningImage) {
          setHighlightedImages(prev => [...new Set([...prev, data.winningImage])]);
        }
        
        // Fetch updated wallet balance to stay in sync with server
        fetchNameWallet();
      }
    });

    // Cleanup on component unmount
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  // Function to reveal result
  const revealResult = useCallback((winImage, winningImageNumber) => {
    setIsProcessing(true);
    setResult(true);
    
    // Find first unrevealed card
    const index = cards.findIndex(card => !card.revealedImage);
    if (index === -1 || index >= 12) { // Check that index is within our 24-box grid
      console.log("No empty cards found or index out of bounds, resetting a box for new result");
      
      // Instead of returning, we'll find the oldest card to replace
      setCards(prevCards => {
        // Deep copy the cards
        const updatedCards = JSON.parse(JSON.stringify(prevCards));
        
        // Replace the oldest card (last one) with the new result
        updatedCards[23] = { 
          id: 23, 
          revealedImage: winImage, 
          loading: false,
          scratched: true
        };
        
        // IMPORTANT: Store the result securely with timestamp
        storeRoundResult(winImage, 23, winningImageNumber);
        
        return updatedCards;
      });
    } else {
      // Update cards with winning image
      setCards(prevCards => {
        const updatedCards = prevCards.map((card, i) =>
          i === index ? { 
            ...card, 
            revealedImage: winImage, 
            loading: false,
            scratched: true
          } : card
        );
        
        // IMPORTANT: Store the result securely with timestamp
        storeRoundResult(winImage, index, winningImageNumber);
        
        return updatedCards;
      });
    }
    
    // Helper function to store round result
    function storeRoundResult(image, boxIndex, winningImageNumber) {
      try {
        // Get all stored round results
        let roundResults = {};
        try {
          roundResults = JSON.parse(localStorage.getItem('roundResults') || '{}');
          // Validate the roundResults object
          if (typeof roundResults !== 'object' || roundResults === null) {
            console.error('Invalid roundResults, resetting to empty object');
            roundResults = {};
          }
        } catch (err) {
          console.error('Error parsing round results:', err);
          roundResults = {};
        }
        
        // Generate a unique round ID if none exists
        const safeRoundId = currentRoundId || `round-${Date.now()}`;
        
        // Store this round's result with the current timestamp
        roundResults[safeRoundId] = {
          image: image,
          timestamp: Date.now(),
          boxIndex: boxIndex,
          winningImageNumber: winningImageNumber
        };
        
        // Check if we have exceeded 50 stored results (for performance)
        const roundIds = Object.keys(roundResults);
        if (roundIds.length > 50) {
          // If more than 50 results, keep only the newest 50
          const sortedIds = roundIds.sort((a, b) => 
            roundResults[b].timestamp - roundResults[a].timestamp
          );
          
          // Create new object with only the 50 most recent results
          const trimmedResults = {};
          sortedIds.slice(0, 50).forEach(id => {
            trimmedResults[id] = roundResults[id];
          });
          
          roundResults = trimmedResults;
        }
        
        // Save to localStorage with extra validation
        const resultString = JSON.stringify(roundResults);
        localStorage.setItem('roundResults', resultString);
        
        // Double check it was saved correctly
        const verification = localStorage.getItem('roundResults');
        if (!verification || verification !== resultString) {
          console.error('Storage verification failed, trying backup method');
          localStorage.removeItem('roundResults');
          localStorage.setItem('roundResults', resultString);
        }
        
        console.log(`Saved result for round ${safeRoundId}: ${image} at box ${boxIndex}`);
        console.log(`Total rounds in storage: ${Object.keys(roundResults).length}`);
        
        // Also save to revealedImages for current round
        const revealedImages = JSON.parse(localStorage.getItem('revealedImages') || '[]');
        revealedImages.push({
          index: boxIndex,
          image: image,
          roundId: safeRoundId
        });
        localStorage.setItem('revealedImages', JSON.stringify(revealedImages));
      } catch (err) {
        console.error('Failed to save round result:', err);
      }
    }
    
    // Check if user won and handle rewards
    const isMatch = selectedCard.some(card => {
      // Get the imageNumber for this card from allWinningImages
      const imageDetails = allWinningImages.find(img => img.image === card.image);
      const cardImageNumber = imageDetails ? imageDetails.imageNumber : null;
      
      console.log(`Checking bet: ${card.image} (${cardImageNumber}) against winner: ${winImage} (${winningImageNumber})`);
      
      // Winning condition: either image name matches OR image number matches
      const nameMatch = card.image === winImage;
      const numberMatch = cardImageNumber !== null && winningImageNumber !== null && cardImageNumber === winningImageNumber;
      
      if (nameMatch || numberMatch) {
        console.log(`WIN! Match type: ${nameMatch ? 'Image Name' : 'Image Number'}`);
        return true;
      }
      return false;
    });
    const allBet = selectedCard.reduce((total, card) => total + card.betAmount, 0);

    if (isMatch) {
      // Calculate which cards matched for proper profit calculation
      let totalProfit = 0;
      
      // Go through each selected card to calculate total profit
      selectedCard.forEach(card => {
        const imageDetails = allWinningImages.find(img => img.image === card.image);
        const cardImageNumber = imageDetails ? imageDetails.imageNumber : null;
        
        // If this specific card is a match, add its profit
        if (card.image === winImage || (cardImageNumber !== null && winningImageNumber !== null && cardImageNumber === winningImageNumber)) {
          // Add the profit for this card (10x the bet amount)
          totalProfit += card.betAmount * 10;
          // Highlight this winning image
          setHighlightedImages(prev => [...new Set([...prev, card.image])]);
        }
      });
      
      // Update balance with total profit
      setBalance(prev => prev + totalProfit);
      setWinningPointOfUser(prev => [...prev, 10]);
      setTotalBetAmt(allBet);

      // Show win popup
      showPremiumPopup({
        html: `
          <div style="position: absolute; top: 120px; left: 50%; transform: translate(-50%, 0); background: black; opacity: 0.8; padding: 1rem 1rem; border-radius:0.2rem; text-align: center;">
            <div style="font-size: 1.25rem; font-weight: bold;">You Won!</div>
            <div style="font-size: 0.875rem;">₹${totalProfit} Added!</div>
          </div>
        `,
        gradient: "bg-gradient-to-br from-green-600 via-emerald-500 to-cyan-500",
        timer: 3000,
        position: "top-start",
      });
    } else {
      // Show lose popup
      showPremiumPopup({
        html: `
          <div style="position: absolute; top: 120px; left: 50%; transform: translate(-50%, 0); background: black; opacity: 0.8; padding: 1rem 1rem; border-radius:0.2rem; text-align: center;">
            <div style="font-size: 1.25rem; font-weight: bold;">Next Round!</div>
            <div style="font-size: 0.875rem;">~~~~~~</div>
          </div>
        `,
        gradient: "bg-gradient-to-br from-red-600 via-rose-500 to-pink-500",
        timer: 3000,
        position: "top-start",
      });
    }

    // Continue to the next image reveal after a short delay
    setTimeout(() => {
      // Check if there are more cards to reveal
      const nextIndex = cards.findIndex((card, i) => i > index && !card.revealedImage);
      if (nextIndex !== -1 && nextIndex < 12) { // Make sure we don't go beyond 24 boxes
        // Request next random image from server for continuous flow
        if (socket) {
          socket.emit('titli:requestNextImage', {
            currentIndex: index,
            gameId: currentRoundId
          });
        } else {
          // Fallback if socket isn't available
          fetchNextRandomImage(nextIndex);
        }
      } else {
        // All cards revealed, prepare for next round
        setIsProcessing(false);
        setBetPlaced(false);
        setSelectedImages([]);
        setSelectedCard([]);
        // New round will be started by server via socket
      }
    }, 3000); // Wait 3 seconds before proceeding to next image
  }, [cards, selectedCard, expectedProfit, socket, currentRoundId, showPremiumPopup]);

  // Fallback function to fetch next random image if socket is not available
  const fetchNextRandomImage = async (nextIndex) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/titli/get-random-image`
      );
      if (response.data.randomImage) {
        setRandomImage(response.data.randomImage);
        
        // Get the winning image number, determine it if not provided
        let winningImageNumber = response.data.winningImageNumber;
        
        if (!winningImageNumber && response.data.randomImage) {
          // If winningImageNumber wasn't sent, find it from our mapping
          winningImageNumber = IMAGE_NUMBER_MAPPING[response.data.randomImage] || null;
          console.log('Determined fetched image number:', winningImageNumber);
        }
        
        revealNextImage(nextIndex, response.data.randomImage, winningImageNumber);
      }
      } catch (error) {
      console.error("Error fetching next random image:", error);
      setIsProcessing(false);
    }
  };

  // Function to reveal the next image in sequence
  const revealNextImage = useCallback((index, winImage, winningImageNumber) => {
    if (index === -1 || !winImage) return;
    
    // First check if this index already has an image
    if (cards[index]?.revealedImage) {
      // Find another empty slot
      const emptyIndex = cards.findIndex(card => !card.revealedImage);
      if (emptyIndex !== -1) {
        index = emptyIndex;
      } else {
        // No empty slots, use the last slot
        index = 23;
      }
    }
    
    setCards(prevCards => {
      // Mark this card as loading
      const updatedCards = prevCards.map((card, i) =>
        i === index ? { ...card, loading: true, scratched: true } : card
      );
      return updatedCards;
    });
    
    // Short delay to show loading state
    setTimeout(() => {
      setCards(prevCards => {
        const updatedCards = prevCards.map((card, i) =>
          i === index ? { 
            ...card, 
            revealedImage: winImage, 
            loading: false,
            scratched: true
          } : card
        );
        
        // IMPORTANT: Store the result securely
        try {
          // Get all stored round results
          let roundResults = {};
          try {
            roundResults = JSON.parse(localStorage.getItem('roundResults') || '{}');
            if (typeof roundResults !== 'object' || roundResults === null) {
              roundResults = {};
            }
          } catch (err) {
            console.error('Error parsing round results:', err);
            roundResults = {};
          }
          
          // Generate a safe round ID
          const safeRoundId = currentRoundId || `round-${Date.now()}`;
          
          // Store this round's result
          roundResults[safeRoundId] = {
            image: winImage,
            timestamp: Date.now(),
            boxIndex: index,
            winningImageNumber: winningImageNumber
          };
          
          // Save to localStorage
          localStorage.setItem('roundResults', JSON.stringify(roundResults));
          
          // Verify the save worked
          const verification = localStorage.getItem('roundResults');
          const parsedVerification = JSON.parse(verification || '{}');
          console.log(`VERIFICATION: Storage now has ${Object.keys(parsedVerification).length} results`);
          
          // Save in revealed images for current round
          const revealedImages = JSON.parse(localStorage.getItem('revealedImages') || '[]');
          revealedImages.push({
            index,
            image: winImage,
            roundId: safeRoundId,
            winningImageNumber: winningImageNumber
          });
          localStorage.setItem('revealedImages', JSON.stringify(revealedImages));
        } catch (err) {
          console.error('Failed to save next round result:', err);
        }
        
        return updatedCards;
      });
      
      // Check if user won with this next image
      const isMatch = selectedCard.some(card => {
        // Get the imageNumber for this card from allWinningImages
        const imageDetails = allWinningImages.find(img => img.image === card.image);
        const cardImageNumber = imageDetails ? imageDetails.imageNumber : null;
        
        console.log(`Checking next bet: ${card.image} (${cardImageNumber}) against winner: ${winImage} (${winningImageNumber})`);
        
        // Winning condition: either image name matches OR image number matches
        const nameMatch = card.image === winImage;
        const numberMatch = cardImageNumber !== null && winningImageNumber !== null && cardImageNumber === winningImageNumber;
        
        if (nameMatch || numberMatch) {
          console.log(`NEXT WIN! Match type: ${nameMatch ? 'Image Name' : 'Image Number'}`);
          return true;
        }
        return false;
      });
      
      if (isMatch) {
        // Calculate which cards matched for proper profit calculation
        let totalProfit = 0;
        
        // Go through each selected card to calculate total profit
        selectedCard.forEach(card => {
          const imageDetails = allWinningImages.find(img => img.image === card.image);
          const cardImageNumber = imageDetails ? imageDetails.imageNumber : null;
          
          // If this specific card is a match, add its profit
          if (card.image === winImage || (cardImageNumber !== null && winningImageNumber !== null && cardImageNumber === winningImageNumber)) {
            // Add the profit for this card (10x the bet amount)
            totalProfit += card.betAmount * 10;
            // Highlight this winning image
            setHighlightedImages(prev => [...new Set([...prev, card.image])]);
          }
        });
        
        // Update balance with total profit
        setBalance(prev => prev + totalProfit);
        setWinningPointOfUser(prev => [...prev, 10]);
        
        // Show win popup for this next reveal
        showPremiumPopup({
          html: `
            <div style="position: absolute; top: 120px; left: 50%; transform: translate(-50%, 0); background: black; opacity: 0.8; padding: 1rem 1rem; border-radius:0.2rem; text-align: center;">
              <div style="font-size: 1.25rem; font-weight: bold;">You Won Again!</div>
              <div style="font-size: 0.875rem;">₹${totalProfit} Added!</div>
            </div>
          `,
          gradient: "bg-gradient-to-br from-green-600 via-emerald-500 to-cyan-500",
          timer: 3000,
          position: "top-start",
        });
      }

      // Continue to next image after a delay
      setTimeout(() => {
        const nextIndex = cards.findIndex((card, i) => i > index && !card.revealedImage);
        if (nextIndex !== -1 && nextIndex < 12) { // Make sure we don't go beyond 24 boxes
          if (socket) {
            socket.emit('titli:requestNextImage', {
              currentIndex: index,
              gameId: currentRoundId
            });
          } else {
            fetchNextRandomImage(nextIndex);
          }
        } else {
          // All cards revealed, prepare for next round
          setIsProcessing(false);
          setBetPlaced(false);
          setSelectedImages([]);
          setSelectedCard([]);
        }
      }, 3000);
    }, 1000);
  }, [cards, selectedCard, expectedProfit, socket, currentRoundId, showPremiumPopup]);

  useEffect(() => {
    fetchNameWallet();
  }, [fetchNameWallet]);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setUserData(JSON.parse(user));
    } else {
      alert("User is not logged in. Please log in to view your bets.");
    }
  }, []);

  // Fetch user's bets
  const fetchBets = async () => {
    if (userData) {
      try {
        const userId = userData.id;
        const pappuBetsResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/pappu/bets/${userId}`);
        if (pappuBetsResponse.data.success) {
          setTitlibets(pappuBetsResponse.data.bets);
        } else {
          alert("Failed to fetch user bets");
        }
      } catch (err) {
        console.error('Error fetching bets:', err);
        // alert("There was an error fetching bets.");
      }
    }
  };
  
  useEffect(() => {
    if (userData) {
      fetchBets();
    }
  }, [userData]);

  const handleBetChange = (bet, profit) => {
    const selectedBet = parseInt(bet);
    setBetAmount(selectedBet);
    const selectedBetData = betPlaceAmt.find((item) => item.bet === selectedBet);
    // console.log(selectedBetData)
    if (selectedBetData) {
      setExpectedProfit(selectedBetData.profit);
      // setTotalProfit(selectedBetData.profit + (userData?.wallet?.balance || 0));
    }
  };
  // console.log(expectedProfit, "expectedProfit")

  useEffect(() => {
    if (betCooldown > 0) {
      const timer = setInterval(() => {
        setBetCooldown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer); // Cleanup timer
    }
  }, [betCooldown]);

  // const [isWin, setIsWin] = useState(false);
  useEffect(() => {
    if (profile && profile.walletBalance !== undefined) {
      setBalance(profile.walletBalance);
    }
  }, [profile]);
  const initializeGame = useCallback(() => {
    console.log('Initializing game with result history');
    
    // Create a fresh set of cards - 24 BOXES
    const newCards = Array.from({ length: 12 }, (_, index) => ({
      id: index,
      scratched: false,
      revealedImage: null,
      loading: false
    }));
    
    try {
      // Get all stored round results with improved error handling
      let roundResults = {};
      try {
        const storedResults = localStorage.getItem('roundResults');
        if (storedResults) {
          roundResults = JSON.parse(storedResults);
          // Ensure we have an object
          if (!roundResults || typeof roundResults !== 'object') {
            console.warn('Invalid roundResults format, resetting');
            roundResults = {};
          }
        }
      } catch (err) {
        console.error('Error parsing roundResults:', err);
        roundResults = {};
      }
      
      const roundIds = Object.keys(roundResults);
      console.log(`Found ${roundIds.length} stored results`);
      
      // Filter out duplicate images to ensure we only display one of each
      const seenImages = new Set();
      const uniqueImageEntries = [];
      
      // Sort by timestamp (newest first)
      const sortedRoundIds = roundIds.sort((a, b) => 
        roundResults[b].timestamp - roundResults[a].timestamp
      );
      
      // Keep one of each unique image
      for (const roundId of sortedRoundIds) {
        const result = roundResults[roundId];
        if (result && result.image && !seenImages.has(result.image)) {
          uniqueImageEntries.push({
            roundId,
            image: result.image,
            timestamp: result.timestamp,
            boxIndex: result.boxIndex || 0
          });
          seenImages.add(result.image);
        }
      }
      
      console.log(`After filtering, showing ${uniqueImageEntries.length} unique images`);
      
      // Check if all 24 boxes would be filled - if so, we'll only display the newest results
      if (uniqueImageEntries.length >= 12) {
        console.log('Container has 24+ unique images, showing only the most recent 24');
        uniqueImageEntries.splice(12); // Keep only the first 24 entries
      }
      
      // Fill cards with unique images (each image gets one box)
      uniqueImageEntries.forEach((entry, idx) => {
        if (idx < newCards.length) {
          newCards[idx].revealedImage = entry.image;
          newCards[idx].scratched = true;
          console.log(`Added ${entry.image} from round ${entry.roundId} at position ${idx}`);
        }
      });
      
      // Also add current round's revealed images if they're not already in the grid
      if (currentRoundId) {
        const currentRevealedImages = JSON.parse(localStorage.getItem('revealedImages') || '[]');
        
        // Process each revealed image for current round
        for (const revealedImage of currentRevealedImages) {
          // Only add if this image is not already in our grid
          if (!seenImages.has(revealedImage.image)) {
            // Find the next available slot
            const nextAvailableSlot = newCards.findIndex(card => !card.revealedImage);
            if (nextAvailableSlot !== -1) {
              newCards[nextAvailableSlot].revealedImage = revealedImage.image;
              newCards[nextAvailableSlot].scratched = true;
              seenImages.add(revealedImage.image);
              console.log(`Added current round image ${revealedImage.image} to position ${nextAvailableSlot}`);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error loading results:', error);
    }
    
    setCards(newCards);
    setSelectedImages([]);
    setBetPlaced(false);
    setHighlightedImages([]);
    setWinningPointOfUser([]);
    setIsProcessing(false);
  }, [currentRoundId]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Handle play/bet button click
  const handlePlay = useCallback(async () => {
    if (isProcessing || betPlaced || bettingDisabled) return;
    setIsProcessing(true);

    // Check if any images are selected
    if (selectedImages.length === 0) {
      showPremiumPopup({
        html: `
          <div style="position: absolute; top: 120px; left: 50%; transform: translate(-50%, 0); background: black; opacity: 0.8; padding: 1rem 1rem; border-radius:0.2rem; text-align: center;">
            <div style="font-size: 1.25rem; font-weight: bold;">Select Images!</div>
            <div style="font-size: 0.875rem;">Please select at least one image.</div>
          </div>
        `,
        gradient: "bg-gradient-to-br from-yellow-600 via-amber-500 to-orange-500",
        timer: 3000
      });
      setIsProcessing(false);
      return;
    }

    // Calculate total bet amount
    const totalBet = selectedCard.reduce((total, card) => total + card.betAmount, 0);
    
    console.log("Selected cards for bet:", selectedCard);
    console.log("Total bet amount:", totalBet);
    console.log("Current round ID:", currentRoundId);
    console.log("Using gameId:", currentRoundId || localStorage.getItem('titligameId'));

    // Check if user has enough balance
    if (balance < totalBet) {
      showPremiumPopup({
        html: `
          <div style="position: absolute; top: 120px; left: 50%; transform: translate(-50%, 0); background: black; opacity: 0.8; padding: 1rem 1rem; border-radius:0.2rem; text-align: center;">
            <div class="text-xl font-bold">Insufficient Balance!</div>
            <div class="text-sm opacity-75">Need ₹${totalBet - balance} more</div>
          </div>`,
        gradient: "bg-gradient-to-br from-red-600 via-rose-500 to-pink-600",
        timer: 3000
      });
      setIsProcessing(false);
      return;
    }
    
    await showPremiumPopup({
      html: `
       <div style="position: absolute; top: 120px; left: 50%; transform: translate(-50%, 0); background: black; opacity: 0.8; padding: 1rem 1rem; border-radius:0.2rem; text-align: center;">
          <div style="font-size: 1rem; color:green;">₹${totalBet} Bet Placed!</div>
        </div>
      `,
      background: "black",
      opacity: 0.8,
      position: "top-start",
      timer: 2000
    });
    
    if (selectedImages.length > 0) {
      // Temporarily deduct from local balance for UI feedback
      setBalance((prev) => prev - totalBet);
      const allBet = selectedCard.reduce((total, card) => total + card.betAmount, 0);
      
      // Use gameId from current round or from localStorage
      const gameIdToUse = currentRoundId || localStorage.getItem('titligameId');
      
      try {
        console.log(`Placing bet for game ${gameIdToUse} with ${selectedCard.length} images`);
        
        const response = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/api/titli/new/bets`,
          {
            user: profile.userId,
            betAmount,
            selectedCard: selectedCard,
            totalBets: allBet,
            gameId: gameIdToUse,
          }
        );

        console.log("Bet response:", response.data);

        if (response.data.newBalance !== undefined) {
          setBalance(response.data.newBalance);
        }
        if (response.status === 200 || response.status === 201) {
          fetchNameWallet();
          
          // Notify socket about bet placement
          if (socket) {
            socket.emit('titli:placeBet', {
              user: profile.userId,
              selectedCard: selectedCard,
              totalBets: allBet,
              gameId: gameIdToUse
            });
          }
        }
      } catch (error) {
        console.error("Error creating bet:", error);
        // Restore balance if bet failed
        setBalance((prev) => prev + totalBet);
        
        showPremiumPopup({
          html: `
            <div style="position: absolute; top: 120px; left: 50%; transform: translate(-50%, 0); background: black; opacity: 0.8; padding: 1rem 1rem; border-radius:0.2rem; text-align: center;">
              <div style="font-size: 1.25rem; font-weight: bold;">Bet Failed!</div>
              <div style="font-size: 0.875rem;">Please try again.</div>
            </div>
          `,
          gradient: "bg-gradient-to-br from-red-600 via-rose-500 to-pink-600",
          timer: 3000
        });
      }
    }
    setBetPlaced(true);
    setIsProcessing(false);
  }, [isProcessing, selectedImages, betPlaced, balance, betAmount, profile.userId, selectedCard, socket, currentRoundId, showPremiumPopup, bettingDisabled, fetchNameWallet]);

  const toggleImageSelection = (image, betAmount, profit) => {
    if (isProcessing || bettingDisabled) return;
    
    setSelectedImages((prev) => {
      if (prev.includes(image)) {
        return prev.filter((img) => img !== image);
      } else {
        return [...prev, image];
      }
    });

    setSelectedCard((prev) => {
      const newSelectedCard = [...prev];
      const index = newSelectedCard.findIndex((card) => card.image === image);
      if (index === -1) {
        newSelectedCard.push({ image, betAmount, profit });
      } else {
        newSelectedCard.splice(index, 1);
      }
      return newSelectedCard;
    });
  };
  // console.log(cards)

  return (
    <MainContainer>
      <Navbar />

      <FlexContainer>
        <BettingTable titlibets={titlibets} />
        {/* </HistoryContainer> */}
        <GameSection>
          <Timer>{countDown}:00</Timer>
          <Title>Titli Par</Title>
          <GameBoardContainer>
            <GameBoardWrapper>
              <GridContainer>
                {cards.map((card) => (
                  <Card
                    key={card.id}
                    card={card}
                    isScratched={card.scratched}
                    revealedImage={card.revealedImage}
                  />
                ))}
              </GridContainer>
            </GameBoardWrapper>
          </GameBoardContainer>
          {/* Images Selection */}
          <AllImages
            allWinningImages={allWinningImages}
            highlightedImages={highlightedImages}
            selectedImages={selectedImages}
            betAmount={betAmount}
            onImageClick={toggleImageSelection}
            isTimerActive={!isProcessing && !bettingDisabled}
            disabled={isProcessing || bettingDisabled}
            selectedCard={selectedCard}
            profit={expectedProfit}
          />
          <InnerContainer>
            <BalanceSection>
              <BetAmountSection>
                {betPlaceAmt.map(({ bet, profit }) => (
                  <button
                    key={bet}
                    onClick={() => handleBetChange(bet, profit)}
                    disabled={isProcessing || bettingDisabled || betCooldown > 10}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '0.5rem',
                      margin: '0.1rem',
                      background: '#141a24',
                      width: "21%",
                      color: "white",
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    {bet}
                  </button>
                ))}
              </BetAmountSection>
            </BalanceSection>

            {/* Status Indicator with countdown notice */}
            <StatusText>
              {isProcessing 
                ? "Processing..." 
                : bettingDisabled 
                  ? countDown <= 15 
                    ? `Betting Closed! Waiting for result in ${countDown}s` 
                    : "Betting Closed!" 
                  : "Select Images!"}
            </StatusText>
            
            <PlaceBetButton 
              onClick={handlePlay} 
              disabled={isProcessing || bettingDisabled || betPlaced}
            >
              {betPlaced ? "Bet Placed" : "Place Bet"}
            </PlaceBetButton>
          </InnerContainer>
        </GameSection>
      </FlexContainer>
      <ToastContainer position="top-right" autoClose={2000} />
    </MainContainer>
  );
};

export default Papu;

const Timer = styled.div`
background: linear-gradient(to right, #68d391, #00bcd4);
-webkit-background-clip: text;
// color: transparent;
color:white;
font-weight: bold;
font-size: 1.5rem;
`
// Styled Components
const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  // align-items: center;
  min-height: 100vh;
  background: linear-gradient(to bottom right, #1a202c, #141a24);
  // padding:  0.5rem 1rem;
  box-sizing:border-box;

`;


const Title = styled.h1`
  font-size: 2.25rem;
  font-weight: bold;
  color: transparent;
  background-clip: text;
  background-image: linear-gradient(to right, #fbbf24, #f59e0b);
  margin-bottom: 1rem;
  animation: pulse 2s infinite;
  @media (max-width: 768px) {
    display: none;
  }
`;

const GameBoardContainer = styled.div`
  width: 100%;
  max-width: 32rem;
  // background:red;
  background: linear-gradient(to bottom right, #2d3748, #1a202c);
  padding: 0.25rem;
  box-sizing:border-box;
  border-radius: 1rem;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
  margin-bottom: 0rem;
    cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};

`;

const GameBoardWrapper = styled.div`
  background: rgba(26, 32, 44, 0.5);
  backdrop-filter: blur(5px);
  border-radius: 1rem;
  padding: 1rem;
    box-sizing:border-box;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.5rem;
  
  /* Make all boxes square */
  & > div {
    aspect-ratio: 1 / 1;
  }
`;

const InnerContainer = styled.div`
  background: linear-gradient(to bottom right, #2d3748, #1a202c);
  backdrop-filter: blur(8px);
  border-radius: 1rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  margin-bottom: 2rem;
  max-width: 32rem;
  margin: 0 auto;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
  justify-content: space-around;
  box-sizing:border-box;
`;

const BalanceSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  padding: 0;
`;

const BalanceText = styled.div`
  background: linear-gradient(to right, #68d391, #00bcd4);
  -webkit-background-clip: text;
  color: transparent;
  font-weight: bold;
  h4 {
    margin: 0;
  }
`;

const BetAmountSection = styled.div`
  display: flex;
  // flex-direction: column;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;

  h5 {
    margin: 0;
    color: #00bcd4;
    font-weight: 600;
  }
`;

const BetAmountSelect = styled.select`
  background: linear-gradient(to bottom right, #4a5568, #2d3748);
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  color: #00bcd4;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.1);
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #00bcd4;
  }
`;

const StatusText = styled.div`
  text-align: center;
  font-size: 0.875rem;
  font-weight: 600;
  color: #48bb78;
  // animation: pulse 1s infinite;
`;

const PlaceBetButton = styled.button`
  background: #fbbf24;
  color: black;
  padding: 0.75rem 1.5rem;
  border-radius: 1rem;
  font-weight: bold;
  cursor: pointer;
  border: none;
  transition: background 0.3s;
  &:hover {
    background: #f59e0b;
  }
  &:disabled {
    background: gray;
    cursor: not-allowed;
  }
`;

const FlexContainer = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: end;
  align-items: flex-start;
  width: 100%;
  // max-width: 1200px;
  margin: auto;
  flex-wrap:wrap;
  // background:red;
  box-sizing:border-box;
  @media (max-width: 768px) {
    flex-direction: column-reverse;
    padding:20% 10px 10px 10px;

  }
`;

const GameSection = styled.div`
  width: 80%; /* Takes up 2 parts of the space */
  display: flex;
  flex-direction: column;
  align-items: center;
  // background:red;
   @media (max-width: 768px) {
   width:100%;
  }

`;

const HistoryContainer = styled.div`
  flex: 1; /* Takes up 1 part of the space */
  background: white;
  padding: 1rem;
  border-radius: 1rem;
  min-height: 300px;
  width: 30%;
  box-sizing:border-box;
  // margin-top:60px;
  // position:fixed;
  // top:10px;
  // right:0;
  @media (max-width: 768px) {
    position: unset;
    width:100%;
    margin-top:2px;
    width:100%;
    padding:0
  }
`;

