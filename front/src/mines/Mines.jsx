import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import BettingTable from './bettingTable';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useProfile } from '../context/ProfileContext';
import DashboardNavbar from '../AllGamesNavbar/AllNavbar';
import win from '../assets/win.png'
import bombBlastimg from '../assets/bombblast.png'
import lostImg from '../assets/lost.png'
import { toast, ToastContainer } from 'react-toastify';
// Main Component
const BettingGame = () => {
  const [bet, setBet] = useState(0);
  const [multiplier, setMultiplier] = useState(0);
  const [tileMultipliers, setTileMultipliers] = useState(Array(24).fill(null));
  const [activeTiles, setActiveTiles] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [bombBlast, setBombBlast] = useState(false);
  const increaseBet = () => setBet((prev) => String(Number(prev) + 1));
  const decreaseBet = () => setBet((prev) => String(Math.max(Number(prev) - 1, 0)));

  let multipliers = [1.14, 1.31, 1.52, 1.77, 2.08, 2.48, 2.97, 3.61, 4.44, 5.56, 7.07, 9.20, 12.26, 16.86, 24.09, 36.14, 57.82, 101.20, 202.40, 506.00, 2024.00, 2056.00, 3040.00, 3095.00];
  const [tileBombs, setTileBombs] = useState(Array(25).fill(false));
  const [showBetPopup, setShowBetPopup] = useState(false);
  const [gameResult, setGameResult] = useState(null);
  const [currentMultiplier, setCurrentMultiplier] = useState(0);
  const [bombBlastIndex, setBombBlastIndex] = useState(null);
  const [bettingPopup, setBetingPopup] = useState(false);
  const [updatedBets, setUpdatedBets] = useState([]);
  const [balance, setBalance] = useState(0);
  const [betPlaced, setBetPlaced] = useState(false)
  const [result, setResult] = useState("Lost")
  const [betHistory, setBetHistory] = useState(() => {
    const storedHistory = localStorage.getItem('betHistory');
    return storedHistory ? JSON.parse(storedHistory) : [];
  });
  const [loadInterval, setLoadInterval] = useState(0);
  const [cashout, setCashout] = useState(false)
  const [winning, setWinning] = useState(0)
  const [reloadTime, setReloadTime] = useState(0)
  const { profile, fetchNameWallet } = useProfile()
  const [gameId, setgameId] = useState("")
  const assignBombs = () => {
    let bombPositions = Array(20).fill(false);
    let bombCount = 5;
    while (bombCount > 0) {
      const randomIndex = Math.floor(Math.random() * (24));
      if (!bombPositions[randomIndex]) {
        bombPositions[randomIndex] = true;
        bombCount--;
      }
    }
    setTileBombs(bombPositions);
  };
  useEffect(() => {
    fetchNameWallet()
  }, [cashout, bet])
  const [gameOver, setGameOver] = useState(false)
  useEffect(() => {
    if (gameOver && !cashout) {
      if (bet > 0) {
        console.log("ok")
        setGameResult(
          <span style={{ color: 'red' }}>
            <img src={lostImg} alt="lost gane" style={{ height: "150px", width: "150px" }} />
            <p>You Lost</p>
          </span>
        );
        recordGameResult(false, 0, bet, balance);
      }
    }
  }, [gameOver, cashout, bet]);

  const betPlaceApi = async () => {
    try {
      const uniquePart = Date.now().toString().slice(-4); // Get last 4 digits of timestamp
      const newRoundId = `RD${uniquePart}`; // Create a new Round ID
      setgameId(newRoundId)
      localStorage.setItem("mineroundId", newRoundId)
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/mines/betPlace`, {
        user: profile.userId, // Replace with the actual user ID
        round_id: newRoundId, // Include the new Round ID
        betAmt: bet,
      });
      console.log('Game record saved:', response.data);
    } catch (error) {
      console.error('Error recording game result:', error);
    }
  };

  const recordGameResult = async (isWin, winningAmt, lossAmt, balanceAfterGame) => {
    try {

      const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/api/update`, {
        user: profile.userId, // Replace with the actual user ID
        // betAmt: bet,
        round_id: localStorage.getItem("mineroundId"),
        winningAmt: isWin ? winningAmt : 0,
        lossAmt: isWin ? 0 : bet,
        isWin: isWin ? "Won" : "Lost",
        balanceAfterGame: balanceAfterGame,
      });
      console.log('Game record saved:', response.data);

    } catch (error) {
      toast.error(error.response.data.message);
      console.error('Error recording game result:', error);
    }
  };

  const [betData, setBetData] = useState(
    [
      { user: "c***5", bet: 8000.00, cashOut: 0 },
      { user: "w***2", bet: 2000.00, cashOut: 0 },
      { user: "w***u", bet: 1000.00, cashOut: 0 },
      { user: "p***8", bet: 1200.00, cashOut: 0 },
      { user: "s***4", bet: 5000.00, cashOut: 0 },
      { user: "y***8", bet: 8000.00, cashOut: 0 },
      { user: "g***1", bet: 9000.00, cashOut: 0 },
      { user: "w***2", bet: 11000.00, cashOut: 0 },
      { user: "w***u", bet: 4500.00, cashOut: 0 },
      { user: "p***8", bet: 9600.00, cashOut: 0 },
      { user: "s***4", bet: 8500.00, cashOut: 0 },
      { user: "y***8", bet: 1100.00, cashOut: 0 },
      { user: "g***1", bet: 7500.00, cashOut: 0 },
      { user: "w***2", bet: 2300.00, cashOut: 0 },
      { user: "w***u", bet: 6900.00, cashOut: 0 },
      { user: "p***8", bet: 6300.00, cashOut: 0 },
      { user: "s***4", bet: 9800.00, cashOut: 0 },
      { user: "y***8", bet: 8700.00, cashOut: 0 },
      { user: "g***1", bet: 9400.00, cashOut: 0 },
    ]
  );
  const handleBetChange = (e) => {

    const value = e.target.value;

    // Allow only numbers and empty value

    if (/^\d*$/.test(value)) {

      setBet(value);

    }

  };
  const placedBet = () => {
    if (bet <= 0) {
      toast.error("bet amout more than 0");
    } else if (bet > profile.walletBalance) {
      toast.error("Insufficient balance!");
    } else
      if (isPlaying && progress > 0 && progress < 100) { // Only allow bets during progress
        if (bet <= profile.walletBalance) {
          setShowBetPopup(true);
          betPlaceApi()
          fetchNameWallet()
          setBalance((prev) => prev - bet); // Deduct bet from balance
          profile.walletBalance = profile.walletBalance - bet
          setTimeout(() => {
            setShowBetPopup(false)

          }, 1000)
        }
      }
  };

  const updateBetHistory = () => {
    const newHistory = [{ bet, result: result, winnings: winning, multiplier: currentMultiplier, date: new Date().toLocaleString() }, ...betHistory];
    setBetHistory(newHistory);
    localStorage.setItem('betHistory', JSON.stringify(newHistory));
  };

  const startGame = () => {
    setIsPlaying(true);
    setProgress(0);
    setTileMultipliers(window.innerWidth < 768 ? Array(20).fill(null) : Array(24).fill(null));
    setBombBlastIndex(null);
    setGameResult(null);
    assignBombs();
    let shuffledMultipliers = [...multipliers].sort(() => Math.random() - 0.5).slice(0, 13);
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          startMultiplierAssignment(multipliers);
          return 100;
        }
        return prev + 1;
      });
    }, 100);
  };

  const startMultiplierAssignment = (shuffledMultipliers) => {
    setBetPlaced(true)
    let index = -1; // Start from the second tile
    const assignInterval = setInterval(() => {
      if (index >= 23 || bombBlastIndex !== null) {
        clearInterval(assignInterval);
        return;
      }
      setTileMultipliers((prev) => {
        const newMultipliers = [...prev];
        setTileBombs((currentBombs) => {
          if (currentBombs[index]) {
            if (!cashout) {
              newMultipliers[index] = '💣';
              setBombBlastIndex(index);
              clearInterval(assignInterval);
              setBombBlast(true);
              setGameOver(true);
              setIsPlaying(false);
              setTimeout(() => {
                window.location.reload();
              }, 5000); // Restart the game after 5 seconds
            }
          } else {
            newMultipliers[index] = shuffledMultipliers[index % shuffledMultipliers.length];
            setCurrentMultiplier(shuffledMultipliers[index % shuffledMultipliers.length]);
            setMultiplier((prevMultiplier) => prevMultiplier + shuffledMultipliers[index % shuffledMultipliers.length]); // Increase the multiplier shown on the top
          }
          return currentBombs;
        });
        return newMultipliers;
      });

      index++;
    }, 500); // Increased the speed by reducing the interval duration to 500ms
  };
  useEffect(() => {
    handlePlay();
  }, []) // first time render

  const handlePlay = () => {
    setIsPlaying(true);
    startGame();
    setProgress(0);
    setActiveTiles([]);

  };

  const handleReload = () => {
    if (gameOver) {
      setTimeout(() => {
        window.location.reload();
      }, 1000)
    }
  };


  const handleCashOut = async () => {
    if (!cashout) {
      if (bet > 0 && bet <= profile.walletBalance) {
        if (!bombBlast) {
          const winnings = bet * currentMultiplier;
          const updatedBalance = balance + winnings;
          setBalance(updatedBalance);
          setWinning(winnings);
          setGameResult(
            <div>
              <img src={win} alt="Bomb Blast" style={{ height: "90px", width: "90px", background: "transparent", margin: "auto" }} />
              <p>

            You Won!  Multiplier: x{currentMultiplier}</p> </div>);
          // setResult("Won");
          updateBetHistory();
          await recordGameResult(true, winnings, 0, updatedBalance);

          setCashout(true);
          fetchNameWallet()

          
        } else {
          setGameResult(<span style={{ color: 'red' }}>You Lost! <span role="img" aria-label="explosion"> </span><span role="img" aria-label="crying face"> </span> Bomb Blasted!</span>);
          // await recordGameResult(false, 0, bet, balance);
        }
        // setTimeout(() => {
          setIsPlaying(false); 
        // }, 10000);
       
      } else {
        toast.error("Please place a bet before cashing out.");
      }
    } else {

      toast.error("You Already Cashout")
    }


  };
  return (
    <div>
      <DashboardNavbar />
      <Container>
        <BettingTable
          betData={betData}
          setBetData={setBetData}
          progress={progress}
          setProgress={setProgress}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          startGame={startGame}
          betPlaced={betPlaced}

        />
        <GameArea>
          {/* {isPlaying && ( */}
          <ProgressBar>
            <Progress progress={progress} />
          </ProgressBar>
          {/* )} */}
          <MultiplierDisplay>Multiplier: {currentMultiplier}x</MultiplierDisplay>
          <Grid>
            {tileMultipliers.map((mult, i) => (
              <motion.div
                key={i}
                initial={{ rotateY: 0 }}
                animate={
                  bombBlastIndex === i
                    ? {
                      scale: [1, 1.5, 0.8, 1.2, 1],
                      rotate: [0, 20, -20, 10, 0], // Shaking effect
                      backgroundColor: ['#3b3f51', 'red', 'red', 'red', '#3b3f51'],
                      boxShadow: ['0 0 10px red', '0 0 20px rgb(233, 86, 86)', '0 0 30px red'],
                      rotateY: [0, 180], // Flip horizontally
                      transition: { duration: 0.9 } // Reduced duration for faster flip
                    }
                    : mult || (bombBlast && tileBombs[i])
                      ? {
                        rotateY: [0, 180], // Flip horizontally
                        transition: { duration: 0.5 } // Reduced duration for faster flip
                      }
                      : {}
                }
                style={{
                  width: window.innerWidth > 768 ? '60px' : '19%',
                  height: '60px',
                  background: bombBlastIndex === i
                    ? 'red'
                    : mult || (bombBlast && tileBombs[i])
                      ? 'linear-gradient(45deg, #ffcc00, #ff9900)'
                      : 'linear-gradient(135deg,rgb(114, 49, 19),rgb(103, 35, 15))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: bombBlastIndex === i ? '40px' : mult ? '17px' : '17px',
                  boxShadow: bombBlastIndex === i
                    ? '0 0 30px red'
                    : mult || (bombBlast && tileBombs[i])
                      ? '0 4px 15px rgba(0, 0, 0, 0.3)'
                      : 'none',
                  transition: 'transform 0.5s ease, box-shadow 0.5s ease',
                  transformStyle: 'preserve-3d', // Needed for 3D flip effect
                  position: 'relative',
                  perspective: '1000px' // Needed for 3D effect
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(0deg)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#3b3f51',
                    borderRadius: '12px',
                    color: 'rgb(131 140 180)',

                    fontSize: '50px',
                    fontWeight: 'bold'
                  }}
                >
                  <span style={{ marginBottom: '1.8rem' }}>

                    .

                  </span>
                  {/* Removed "Card" text */}
                </div>
                <div
                  style={{
                    position: 'absolute',
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: bombBlastIndex === i
                      ? 'rgb(59, 63, 81)'

                      : 'linear-gradient(45deg, #ffcc00, #ff9900)',
                    borderRadius: '12px',
                    color: 'green',

                    fontSize: bombBlastIndex === i

                      ? '30px' : bombBlast && tileBombs[i] ? "25px"
                        : '16px',
                    fontWeight: 'bold'
                  }}
                >
                  {bombBlastIndex === i ? '💥' : bombBlast && tileBombs[i] ? '💣' : mult ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                      <span style={{ fontSize: "20px", color: "black" }}>★</span>
                      <span>{mult}x</span>
                    </div>
                  )
                    : ''}
                </div>
              </motion.div>
            ))}
          </Grid>

          <BettingControls>
            {/* <div style={{ display: 'flex', alignItems: 'center' }}> */}
            {/* <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            {/* <span>Balance:</span> */}
            {/* <span style={{ fontSize: '1.2em', fontWeight: 'bold', marginLeft: '5px' }}> ₹{profile.walletBalance}</span>
          </div> */}

            <BetAdjust>
              <AdjustButton onClick={decreaseBet}>-</AdjustButton>
              <BetAmount value={bet} onChange={handleBetChange} />
              <AdjustButton onClick={increaseBet}>+</AdjustButton>
            </BetAdjust>
            {/* </div> */}

            <QuickBets>
              {[100, 200, 500, 1000, 2000, 5000].map((amount) => (
                <QuickBetButton key={amount} onClick={() => setBet(amount)}>
                  {amount}
                </QuickBetButton>
              ))}
            </QuickBets>
            <ActionButtons>
              <ActionButton primary onClick={placedBet}>BET ₹{bet}</ActionButton>
              {/* {!isPlaying && <PlayButton onClick={handlePlay} >Play</PlayButton>} */}

              <ActionButton
                onClick={handleCashOut}
                disabled={progress < 100}
                style={{ cursor: progress < 100 ? 'not-allowed' : 'pointer' }}
              >
                Cash out
              </ActionButton>

            </ActionButtons>
          </BettingControls>

          {bet > 0 && showBetPopup && (
            <Popup>
              <PopupContent>
                <h2>Bet Placed! {bet}</h2>
                {/* <CloseButton onClick={() => { setShowBetPopup(false) }}>Ok</CloseButton> */}
              </PopupContent>
            </Popup>
          )}
          {gameResult && !bombBlast && (
            <Popup>
              <PopupContent>
                <h2>{gameResult}</h2>
                <CloseButton onClick={() => { setGameResult(null); handleReload() }}>Close</CloseButton>
              </PopupContent>
            </Popup>
          )}
        </GameArea>

        <ToastContainer position="top-right" autoClose={2000} />
      </Container>
    </div>

  );
};

export default BettingGame;


const CloseButton = styled.button`
  background-color: transparent;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
  float: right;
  margin-top: -10px;
  margin-right: -10px;
  padding: 10px;
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: auto;
  background-color: #1a1d29;
  color: white;
  padding: 20px;
  padding-top: 6rem;
  box-sizing: border-box;
  flex-wrap: wrap;
  @media (max-width: 768px) {
    flex-direction: column-reverse;
    padding:10px 0px;
  }
`;

const GameArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  padding-top: 4rem;
  box-sizing: border-box;
  @media (max-width: 768px) {
    width: 100%;
    padding-top:85px;
  }
`;

const MultiplierDisplay = styled.div`
  font-size: 24px;
  margin-bottom: 20px;
  color: #ffcc00; /* Gold color for premium look */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); /* Add shadow for depth */
`;

const Grid = styled.div`
  // display: grid;
  // grid-template-columns: repeat(6, 60px);
  // gap: 10px;
  // @media (max-width: 768px) {
  //   grid-template-columns: repeat(6, 40px);
  //    gap: 5px;
  // }
  display: flex;
  // grid-template-columns: repeat(6, 60px);
  flex-wrap:wrap;
  gap: 2px;
  width:40%;
  @media (max-width: 768px) {
    // grid-template-columns: repeat(6, 40px);
    //  gap: 5px;
      width:100%;
      // background:red;
  }
`;

const ProgressBar = styled.div`
  width: 50%;
  height: 10px;
  background-color: #3b3f51;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3); /* Add shadow for depth */
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Progress = styled.div`
  height: 100%;
  background-color: #28a745;
  width: ${(props) => props.progress}%;
  transition: width 0.1s linear;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3); /* Add shadow for depth */
`;


const BettingControls = styled.div`
  margin-top: 20px;
  background: linear-gradient(135deg, #2b2f3e, #3b3f51);
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 45%;
  box-sizing: border-box;
  transition: all 0.3s ease-in-out;

  @media (max-width: 768px) {
    width: 100%;

  }
`;

const BetAdjust = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const AdjustButton = styled.button`
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  border: none;
  color: white;

  padding: 6px 24px;
  border-radius: 15px;
  margin: 0 10px;
  cursor: pointer;
  font-size: 18px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 0 15px #a777e3;
  }
`;


const BetAmount = styled.input`
  background-color: #1a1d29;
  padding: 4px;
  border-radius: 12px;
  box-sizing:border-box;
  font-size: 22px;
  width:80px;
  color: #fff;
  font-weight: bold;
  text-align:center;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);
`;

const QuickBets = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap:8px;
`;

const QuickBetButton = styled.button`
  flex: 1;
  // margin: 0 5px;
  background: linear-gradient(135deg, #3b3f51, #4e5473);
  color: white;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;

  &:hover {
    background: linear-gradient(135deg, #6e8efb, #a777e3);
    transform: scale(1.05);
  }
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const ActionButton = styled.button`
  flex: 1;
  margin: 0 5px;
  padding: 10px 20px;
  border: none;
  border-radius: 12px;
  background: ${(props) => (props.primary ? 'linear-gradient(135deg, #28a745, #34d058)' : 'linear-gradient(135deg, #007bff, #3399ff)')};
  color: white;
  cursor: pointer;
  font-weight: bold;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: background 0.3s ease, transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 20px ${(props) => (props.primary ? '#34d058' : '#3399ff')};
  }

  &:disabled {
    background: #555;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

// { /* <Popup>
//   <PopupContent>
//     <h2>Bet Placed! {bet}</h2>
//     <CloseButton onClick={() => { setShowBetPopup(false) }}>Ok</CloseButton>
//   </PopupContent>
// </Popup> */ }
// { /* <Popup>
//   <PopupContent>
//     <h2>{gameResult}</h2>
//     <CloseButton onClick={() => { setGameResult(null); handleReload() }}>Close</CloseButton>
//   </PopupContent>
// </Popup> */ }

const Popup = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  // opacity: 0.6;
  // z-index: 1000;
  display: flex;
  opacity: 0.8;
  color:green;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.1s ease-in-out;
 z-index: 1000;
  // @keyframes fadeIn {
  //   from {
  //     opacity: 0;
  //   }
  //   to {
  //     opacity: 0.6;
  //   }
  // }
`;
const PopupContent = styled.div`
  background: #3b3f51;  // Set to black
  padding: 2px 50px;
  border-radius: 5px;
  text-align: center;
  // color: white;  // Make text white for visibility
  animation: slideIn 0.1s ease-in-out;
  color:green;
  font-size:10px;
  font-weight:medium;
  z-index: 1000;
  @keyframes slideIn {
    from {
      transform: Scale(0%);
      opacity: 0;
    }
    to {
      transform: Scale(100%);
      opacity: 0.8;
    }
  }
`;