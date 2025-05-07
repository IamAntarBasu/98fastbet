import React, { useState, useEffect, useRef, useCallback } from "react";
import "./T20.css";
import BetSection from "./RightSideBar";
import TournamentWinner from "./TournamentWinner";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import Navbar from '../AllGamesNavbar/AllNavbar';
import io from "socket.io-client";
import { OverMarketProvider, useOverMarket } from "../context/OverMarketContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useProfile } from '../context/ProfileContext';
const socket = io(`${process.env.REACT_APP_BASE_URL}`);

const T20Content = () => {
  const INITIAL_BALANCE = 15000;
  const { profile, fetchNameWallet, updateExposure } = useProfile();
  const [submitClick, setSubmitClick] = useState(0);
  const [oddsData, setOddsData] = useState({});
  const [data, setData] = useState([]);
  const [fancyData, setFancyData] = useState([]);
  const [selectedBet, setSelectedBet] = useState({ label: "", odds: "", type: "", rate: "" });
  const [stakeValue, setStakeValue] = useState("");
  const [profit, setProfit] = useState(0);
  const [myBets, setMyBets] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [TournamentWinnerClicked, setTournamentWinnerClicked] = useState(false);
  const [NormalClicked, setNormalClicked] = useState(false);
  const [balance, setBalance] = useState(() => {
    const savedBalance = localStorage.getItem('currentBalance');
    return savedBalance ? parseFloat(savedBalance) : INITIAL_BALANCE;
  });
  const [exposure, setExposure] = useState(() => {
    const savedExposure = localStorage.getItem('currentExposure');
    return savedExposure ? parseFloat(savedExposure) : 0;
  });
  const [marketOddsExposure, setMarketOddsExposure] = useState(0);
  const [overMarketExposure, setOverMarketExposure] = useState(0);
  const [backProfit, setBackProfit] = useState(0);
  const [layProfit, setLayProfit] = useState(0);
  const [team1Winnings, setTeam1Winnings] = useState(0);
  const [team2Winnings, setTeam2Winnings] = useState(0);
  const [betPopup, setBetPopup] = useState(null);
  const [sessionBets, setSessionBets] = useState([]);
  const [currentStake, setCurrentStake] = useState('');
  const [previousBet, setPreviousBet] = useState({
    runs: null,
    profit: null,
    type: null,
    rate: null
  });

  const location = useLocation();
  const { id, iframeUrl, match } = location.state || {};

  const { 
    overTeam1Winnings, 
    overTeam2Winnings, 
    handleOverBetPlacement, 
    overMarketBets,
    calculateNetPositionForRun,
    calculateTotalExposure
  } = useOverMarket();

  // Update exposure and balance together to maintain the invariant
  const updateExposureAndBalance = useCallback(() => {
    // Calculate total exposure by adding match odds and over market exposures
    const totalExposure = Math.abs(marketOddsExposure) + Math.abs(overMarketExposure);
    setExposure(totalExposure);
    const newBalance = balance - totalExposure;
    setBalance(newBalance);
    
    // Persist the updated values
    localStorage.setItem('currentBalance', newBalance.toString());
    localStorage.setItem('currentExposure', totalExposure.toString());
  }, [marketOddsExposure, overMarketExposure, balance]);

  // Add useEffect to load saved values on mount
  useEffect(() => {
    const savedBalance = localStorage.getItem('currentBalance');
    const savedExposure = localStorage.getItem('currentExposure');
    
    if (savedBalance) {
      setBalance(parseFloat(savedBalance));
    }
    if (savedExposure) {
      setExposure(parseFloat(savedExposure));
    }
  }, []);

  // Helper function to calculate profit/loss based on rate
  const calculateProfitLoss = useCallback((type, stake, odds, rate) => {
    const parsedStake = parseFloat(stake);
    const parsedOdds = parseFloat(odds);
    const parsedRate = parseFloat(rate);

    if (isNaN(parsedStake) || isNaN(parsedOdds) || isNaN(parsedRate)) {
      throw new Error('Invalid input values for calculation');
    }

    // Special handling for rates below 100
    if (parsedRate < 100) {
      if (type.toLowerCase() === 'no') {
        // For NO bets with rate < 100, stake is directly deducted
        return {
          profit: -parsedStake, // Loss is the stake amount
          loss: parsedStake,    // Profit is the stake amount
          exposure: parsedStake, // Exposure is the stake amount
          runs: parsedRate
        };
      } else {
        // For YES bets with rate < 100
        return {
          profit: (parsedStake * parsedOdds) / 100,
          loss: -parsedStake,
          exposure: parsedStake,
          runs: parsedRate
        };
      }
    }

    // Standard calculation for rates 100 and above
    if (type.toLowerCase() === 'yes') {
      return {
        profit: (parsedStake * parsedOdds) / 100,
        loss: -parsedStake,
        exposure: parsedStake,
        runs: parsedRate
      };
    } else { // NO bet
      return {
        profit: parsedStake,
        loss: -(parsedStake * parsedOdds) / 100,
        exposure: (parsedStake * parsedOdds) / 100,
        runs: parsedRate
      };
    }
  }, []);

  // Update session bet handling
  const handlePlaceBetSession = useCallback(() => {
    if (!betPopup || !betPopup.stake) return;

    try {
      const stake = parseFloat(betPopup.stake);
      const odds = parseFloat(betPopup.odds);
      const rate = parseFloat(betPopup.runs);

      if (isNaN(stake) || isNaN(odds) || isNaN(rate)) {
        throw new Error('Invalid bet values');
      }

      // Calculate profit/loss based on new rules
      const { profit, loss, exposure } = calculateProfitLoss(
        betPopup.type,
        stake,
        odds,
        rate
      );

      // Check if bet would exceed balance
      const potentialExposure = exposure + exposure;
      if (potentialExposure > INITIAL_BALANCE) {
        throw new Error('Insufficient balance for this bet');
      }

      // Create new bet record with direct stake deduction for NO bets with rate < 100
      const newBet = {
        sessionId: betPopup.sessionId,
        type: betPopup.type,
        odds: odds,
        runs: rate,
        stake: stake,
        profit: profit,
        loss: loss,
        exposure: exposure,
        timestamp: new Date().toISOString(),
        isDirectDeduction: betPopup.type.toLowerCase() === 'no' && rate < 100
      };

      // Update session bets
      setSessionBets(prev => [...prev, newBet]);

      // Update exposure and balance
      updateExposureAndBalance();

      setBetPopup(null);

    } catch (error) {
      console.error('Session bet error:', error);
      alert(error.message);
    }
  }, [betPopup, updateExposureAndBalance]);

  // Update exposure calculation for session bets
  useEffect(() => {
    let totalExposure = 0;
    const groupedSessions = {};
  
    // Group bets by session ID
    sessionBets.forEach((bet) => {
      const { sessionId, type, runs } = bet;
      if (!groupedSessions[sessionId]) {
        groupedSessions[sessionId] = { yes: [], no: [] };
      }
      groupedSessions[sessionId][type.toLowerCase()].push(bet);
    });
  
    // Calculate exposure for each session
    Object.entries(groupedSessions).forEach(([sessionId, session]) => {
      const { yes, no } = session;
      
      if (yes.length > 0 || no.length > 0) {
        let sessionExposure = 0;
        const rate = yes.length > 0 ? yes[0].runs : (no.length > 0 ? no[0].runs : 0);

        // Special handling for rates below 100
        if (rate < 100) {
          // For rates < 100, handle NO bets differently
          const yesStakes = yes.reduce((sum, bet) => sum + parseFloat(bet.stake), 0);
          const noStakes = no.reduce((sum, bet) => sum + parseFloat(bet.stake), 0);
          
          // For NO bets, stake is directly deducted
          const noExposure = noStakes; // Direct stake deduction
          const yesExposure = (yesStakes * parseFloat(yes[0]?.odds || 0)) / 100;
          
          sessionExposure = Math.max(noExposure, yesExposure);
        } else {
          // Standard exposure calculation for rates 100 and above
          let yesExposure = 0, noExposure = 0;
          
          yes.forEach(bet => {
            const { exposure } = calculateProfitLoss('yes', bet.stake, bet.odds, bet.runs);
            yesExposure += exposure;
          });
          
          no.forEach(bet => {
            const { exposure } = calculateProfitLoss('no', bet.stake, bet.odds, bet.runs);
            noExposure += exposure;
          });
          
          sessionExposure = Math.abs(yesExposure - noExposure);
        }
        
        totalExposure += sessionExposure;
      }
    });
  
    updateExposureAndBalance();
  }, [sessionBets, calculateProfitLoss, updateExposureAndBalance]);

  const handleSubmit = useCallback(() => {
    try {
      if (!selectedBet.label || !stakeValue) {
        throw new Error("Please fill out all fields correctly!");
      }

      const stake = Number(stakeValue);
      if (isNaN(stake) || stake <= 0) {
        throw new Error("Invalid stake amount!");
      }

      // Handle Over Market bets
      if (selectedBet.isOverMarket) {
        const parsedRate = parseFloat(selectedBet.rate);
        const parsedStake = parseFloat(stakeValue);
        const betType = selectedBet.type.toLowerCase();
        const currentRuns = parseFloat(selectedBet.odds);

        // Log bet comparison information
        console.log('=== Bet Comparison ===');
        console.log('Current Bet:', {
          runs: currentRuns,
          type: betType,
          rate: parsedRate,
          stake: parsedStake
        });
        console.log('Previous Bet:', {
          runs: previousBet.runs,
          type: previousBet.type,
          profit: previousBet.profit,
          rate: previousBet.rate
        });
        console.log('Runs Match:', previousBet.runs === currentRuns);
        console.log('Previous Rate:', previousBet.rate);
        console.log('Current Rate:', parsedRate);
        console.log('Rate < 100:', parsedRate < 100);
        console.log('====================');

        // Calculate current profit
        const currentProfit = (parsedRate / 100) * parsedStake;

        // Find opposite bets for the same run value
        const oppositeBets = sessionBets.filter(bet => 
          bet.runs === currentRuns && 
          bet.type.toLowerCase() !== betType
        );

        let deductionAmount = 0;
        
        // If rate < 100 and there's a previous bet with same runs
        if (parsedRate < 100 && previousBet.runs === currentRuns) {
          console.log('=== Deduction Calculation ===');
          console.log('Previous Profit to Deduct:', previousBet.profit);
          console.log('Previous Rate:', previousBet.rate);
          console.log('Current Balance:', balance);
          
          // Use the stored previous profit for deduction
          deductionAmount = previousBet.profit || 0;
          
          // Update balance to reflect the deduction
          const newBalance = balance + deductionAmount;
          console.log('New Balance After Deduction:', newBalance);
          console.log('===========================');
          
          if (newBalance < 0) {
            throw new Error("Insufficient balance after deduction!");
          }
          setBalance(newBalance);
        }

        const success = handleOverBetPlacement(
          selectedBet,
          stake,
          balance - deductionAmount,
          (newBalance) => {
            const newExposure = INITIAL_BALANCE - newBalance;
            setOverMarketExposure(Math.abs(newExposure));
            updateExposureAndBalance();
          },
          (newExposure) => {
            setOverMarketExposure(Math.abs(newExposure));
          }
        );

        if (success) {
          console.log('=== Storing New Previous Bet ===');
          console.log('New Previous Bet:', {
            runs: currentRuns,
            profit: currentProfit,
            type: betType,
            rate: parsedRate
          });
          console.log('============================');

          // Store current bet details as previous bet
          setPreviousBet({
            runs: currentRuns,
            profit: currentProfit,
            type: betType,
            rate: parsedRate
          });

          // Create bet history record after a 500ms delay
          setTimeout(() => {
            const now = new Date();
            const newBet = {
              ...selectedBet,
              time: now.toISOString(),
              stake: stake,
              teamAProfit: currentProfit, // Store profit in teamAProfit
              teamBProfit: 0, // Set teamBProfit to 0 for over market bets
              balance: Number(balance.toFixed(2)),
              exposure: -Math.abs(currentProfit), // Store negative profit as exposure
              marketType: 'overMarket',
              currentExposure: Number((Math.abs(marketOddsExposure) + Math.abs(overMarketExposure)).toFixed(2)),
              rate: parsedRate,
              runValue: currentRuns
            };

            // Filter out any previous bet with the same timestamp to avoid duplicates
            const filteredBets = myBets.filter(bet => bet.time !== now.toISOString());
            setMyBets([newBet, ...filteredBets]);
          }, 500);

          // Reset form
          setSelectedBet({ label: "", odds: "" });
          setStakeValue("");
          setProfit(0);
        }
        return;
      }

      // Handle Market Odds bets
      const decimalOdds = (Number(selectedBet.odds) / 100) + 1;
      const newProfit = Math.round(stake * (decimalOdds - 1));
      
      const teamIndex = data && data.length > 0 ? data.findIndex(row => row[0] === selectedBet.label) : -1;
      if (teamIndex === -1) {
        throw new Error("Invalid team selection");
      }

      let newTeam1Winnings = team1Winnings;
      let newTeam2Winnings = team2Winnings;

      // Calculate team winnings based on bet type
      if (selectedBet.type === "Lgaai") {
        if (teamIndex === 0) {
          newTeam1Winnings = team1Winnings + newProfit;
          newTeam2Winnings = team2Winnings - stake;
        } else if (teamIndex === 1) {
          newTeam2Winnings = team2Winnings + newProfit;
          newTeam1Winnings = team1Winnings - stake;
        }
      } else if (selectedBet.type === "khaai") {
        if (teamIndex === 0) {
          newTeam1Winnings = team1Winnings - newProfit;
          newTeam2Winnings = team2Winnings + stake;
        } else if (teamIndex === 1) {
          newTeam2Winnings = team2Winnings - newProfit;
          newTeam1Winnings = team1Winnings + stake;
        }
      }

      // Calculate exposure as negative of minimum team winnings
      const newExposure = -Math.min(newTeam1Winnings, newTeam2Winnings);

      // Update market odds exposure
      setMarketOddsExposure(Math.abs(newExposure));

      // Update total exposure and balance
      updateExposureAndBalance();

      // Update state
      setTeam1Winnings(newTeam1Winnings);
      setTeam2Winnings(newTeam2Winnings);

      // Add bet to history with current exposure
      const now = new Date();
      const newBet = {
        ...selectedBet, 
        time: now.toISOString(),
        stake: stake,
        teamAProfit: Number(newTeam1Winnings.toFixed(2)),
        teamBProfit: Number(newTeam2Winnings.toFixed(2)),
        balance: Number(balance.toFixed(2)),
        exposure: Number(newExposure.toFixed(2)), // Store the negative exposure
        marketType: 'matchOdds',
        currentExposure: Number((Math.abs(marketOddsExposure) + Math.abs(overMarketExposure)).toFixed(2)), // Total exposure
        rate: selectedBet.odds // For match odds, rate equals odds
      };

      setMyBets(prev => [newBet, ...prev]);

      // Reset bet form
      setSelectedBet({ label: "", odds: "" });
      setStakeValue("");
      setProfit(0);

    } catch (error) {
      console.error('Bet placement error:', error);
      alert(error.message);
    }
  }, [
    selectedBet,
    stakeValue,
    balance,
    exposure,
    data,
    team1Winnings,
    team2Winnings,
    marketOddsExposure,
    handleOverBetPlacement,
    updateExposureAndBalance,
    sessionBets,
    previousBet
  ]);

  const calculateProfit = (odds, stake) => {
    if (!odds || !stake) return 0;
    // Convert odds from percentage format (e.g., 30) to decimal format (e.g., 1.30)
    const decimalOdds = (parseFloat(odds) / 100) + 1;
    return Math.round(parseFloat(stake) * (decimalOdds - 1));
  };

  useEffect(() => {
    if (!id) return;
    fetch(`${process.env.REACT_APP_BASE_URL}/api/odds?market_id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setOddsData(data);
      })
      .catch((err) => {
        console.error("Error fetching odds:", err);
      });

    socket.on("updateOdds", (updatedOdds) => {
      if (updatedOdds[id]) {
        setOddsData(updatedOdds[id]);
      }
    });

    return () => socket.off("updateOdds");
  }, [id]);

  const columnsT = ["Min: 100 Max: 25000", "Lgaai", "khaai",];
  const formattedMatchOdds = oddsData.matchOdds?.map((team) => [
    team.team_name,
    [
      (parseFloat(team.lgaai) * 100).toFixed(2), // Back odds
      (parseFloat(team.lgaai) * 100).toFixed(2), // Back rate (same as odds)
    ],
    [
      (parseFloat(team.khaai) * 100).toFixed(2), // Lay odds
      (parseFloat(team.khaai) * 100).toFixed(2), // Lay rate (same as odds)
    ],
  ]);

  // Update data when formattedMatchOdds changes
  useEffect(() => {
    setData(formattedMatchOdds || []);
  }, [oddsData]);

  useEffect(() => {
    if (selectedBet.odds && stakeValue) {
      const stake = parseFloat(stakeValue);
      const decimalOdds = (parseFloat(selectedBet.odds) / 100) + 1;
      const newProfit = Math.round(stake * (decimalOdds - 1));
      const teamIndex = data.findIndex(row => row[0] === selectedBet.label);

      // Calculate potential loss
      let potentialLoss = 0;

      if (selectedBet.type === "Lgaai") {
        potentialLoss = stake;
      } else if (selectedBet.type === "khaai") {
        potentialLoss = newProfit;
      }

      console.log('================================');
      console.log('Current Balance:', balance);
      console.log('Potential Loss:', potentialLoss);
      console.log('Balance Check:', potentialLoss <= balance ? 'Sufficient Balance' : 'Insufficient Balance');
      console.log('================================');

      if (potentialLoss > balance) {
        console.log('Insufficient balance');
      }

      setProfit(calculateProfit(selectedBet.odds, stakeValue));
    }
  }, [selectedBet.odds, stakeValue, balance, data, selectedBet.label, selectedBet.type]);

  const formattedFancyMarkets = oddsData.fancyMarkets?.map((market) => [
    market.session_name, // Fancy market name
    [
      market.runsNo, // Runs for "No"
      (parseFloat(market.oddsNo) * 100).toFixed(2), // Odds for "No"
    ],
    [
      market.runsYes, // Runs for "Yes"
      (parseFloat(market.oddsYes) * 100).toFixed(2), // Odds for "Yes"
    ],
  ]);


  useEffect(() => {
    setFancyData(formattedFancyMarkets || []);
  }, [oddsData]);

  const columnstied = ["Min: 100 Max: 25000", "NO", "YES"];

  const tied = [
    ["Team A", [360], [400]],
    ["Team B", [280], [310]]
  ];

  // Combine regular bets and over market bets
  const allBets = [...myBets, ...overMarketBets].sort((a, b) => {
    const timeA = a.timestamp || a.time;
    const timeB = b.timestamp || b.time;
    return new Date(timeB) - new Date(timeA);
  });

  return (
    <>
    <Navbar />
      <div className="scorecard" style={{ paddingTop: "73px" }}>
          <LiveScoreContainer>
            {iframeUrl ? (
              <iframe
                src={iframeUrl}
                width="100%"
                height="100%"
                title="Live Score"
                style={{ border: "none" }}
                
              ></iframe>
            ) : (
              <PlaceholderText>Live Score Not Available</PlaceholderText>
            )}
          </LiveScoreContainer>
        </div>

        <div>Wallet: {balance}</div>
        <div>Exposure: {exposure}</div>
      
      <div className="T20_container">
        <div className="left_side">
          <div className="T20_header">
            <h1>{match}</h1>
            <h1>{match} Date</h1>
          </div>

          <TournamentWinner 
            title={"Match Odds"}
            columns={columnsT} 
            data={data} 
            setSelectedBet={setSelectedBet} 
            profit={profit} 
            betFor={selectedBet} 
            stake={stakeValue} 
            clicked={TournamentWinnerClicked} 
            setTournamentWinnerClicked={setTournamentWinnerClicked}
            team1Winnings={team1Winnings}
            team2Winnings={team2Winnings}
            setExposure={setExposure}
            setBalance={setBalance}
          />

          <TournamentWinner
              title={"over market"}
              columns={columnstied}
              data={fancyData}
              setSelectedBet={(bet) => setSelectedBet({ ...bet, isOverMarket: true })}
              profit={profit}
              betFor={selectedBet}
              stake={stakeValue}
              clicked={NormalClicked}
              setTournamentWinnerClicked={setNormalClicked}
              team1Winnings={overTeam1Winnings}
              team2Winnings={overTeam2Winnings}
              setExposure={setExposure}
              setBalance={setBalance}
            />

          <div className="mobile-view" ref={useRef(null)}>
            <BetSection
              selectedBet={selectedBet}
              stakeValue={stakeValue}
              setStakeValue={setStakeValue}
              profit={profit}
              isPaused={isPaused}
              setSelectedBet={setSelectedBet}
              setProfit={setProfit}
              handleSubmit={handleSubmit}
              myBets={allBets}
              setCurrentStake={setCurrentStake}
              stakeValues={[100, 200, 500, 1000, 2000, 5000, 10000, 15000, 20000, 25000]}
            />
          </div>
        </div>

        <div className="right_side">
          <BetSection
            selectedBet={selectedBet}
            stakeValue={stakeValue}
            setStakeValue={setStakeValue}
            profit={profit}
            isPaused={isPaused}
            setSelectedBet={setSelectedBet}
            setProfit={setProfit}
            handleSubmit={handleSubmit}
            myBets={allBets}
            setCurrentStake={setCurrentStake}
            stakeValues={[100, 200, 500, 1000, 2000, 5000, 10000, 15000, 20000, 25000]}
          />
        </div>
      </div>

      {betPopup && (
        <div className="bet-popup">
          <h3>Place Bet</h3>
          <p>Type: {betPopup.type.toUpperCase()}</p>
          <p>Runs: {betPopup.runs}</p>
          <p>Odds: {betPopup.odds * 100}</p>
          <input
            type="number"
            placeholder="Enter Stake"
            value={betPopup.stake}
            onChange={(e) =>
              setBetPopup({ ...betPopup, stake: e.target.value })
            }
          />
          <button onClick={handlePlaceBetSession}>Confirm</button>
          <button onClick={() => setBetPopup(null)}>Cancel</button>
        </div>
      )}
    </>
  );
};

const LiveScoreContainer = styled.div`
  background: linear-gradient(135deg, #1e1e2f, #2a2a40);
  width: 100%;
  height: 218px;
  margin-bottom: 20px;
  border-radius: 15px;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  position: relative;
      
`;

const PlaceholderText = styled.p`
  color: #fff;
  text-align: center;
  font-size: 18px;
  margin: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const T20 = () => (
  <OverMarketProvider>
    <T20Content />
  </OverMarketProvider>
);

export default T20;
