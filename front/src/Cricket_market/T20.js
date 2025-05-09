import React, { useState, useEffect, useRef, useCallback } from "react";
import "./T20.css";
import BetSection from "./RightSideBar";
import TournamentWinner from "./TournamentWinner";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import Navbar from '../AllGamesNavbar/AllNavbar';
import io from "socket.io-client";
import { OverMarketProvider, useOverMarket } from "../context/OverMarketContext";
import "react-toastify/dist/ReactToastify.css";
import { useProfile } from '../context/ProfileContext';
import { FaPlay } from 'react-icons/fa';
import axios from 'axios'
import { ToastContainer, toast } from "react-toastify";
const socket = io(process.env.REACT_APP_BASE_URL);
const T20Content = () => {
  const [initialbalce, setInitialbalce] = useState(null);
  // const INITIAL_BALANCE = 15000;
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
  const [balance, setBalance] = useState(null);
  const [exposure, setExposure] = useState(null);
  const [marketOddsExposure, setMarketOddsExposure] = useState(0);
  const [overMarketExposure, setOverMarketExposure] = useState(0);
  const [prevMarketOddsExposure, setPrevMarketOddsExposure] = useState(0);
  const [prevOverMarketExposure, setPrevOverMarketExposure] = useState(0);
  const [newMarketOddsExposure, setNewMarketOddsExposure] = useState(0);
  // console.log(prevMarketOddsExposure, "prevMarketOddsExposure")
  // console.log(marketOddsExposure, "marketOddsExposure")
  const [backProfit, setBackProfit] = useState(0);
  const [layProfit, setLayProfit] = useState(0);
  const [team1Winnings, setTeam1Winnings] = useState(0);
  const [team2Winnings, setTeam2Winnings] = useState(0);
  const [betPopup, setBetPopup] = useState(null);
  const [sessionBets, setSessionBets] = useState([]);
  const [currentStake, setCurrentStake] = useState('');
  const [balanceChange, setBalanceChange] = useState(false);
  const [selectedBetLabel, setSelectedBetLabel] = useState('');
  const [selectedBetOdds, setSelectedBetOdds] = useState('');
  const [selectedBetType, setSelectedBetType] = useState('');
  const [insufficientBalancePopup, setInsufficientBalancePopup] = useState(false);
  const [insufficientBalanceMessage, setInsufficientBalanceMessage] = useState('');
  const [isClosing, setIsClosing] = useState(false);
  const [successPopup, setSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [teamInd, setTeamInd] = useState(0)
  const [showBetPopup, setShowBetPopup] = useState(false);
  const openBetPopup = () => {
    setShowBetPopup(true);
  };
  const closeBetPopup = () => {
    setShowBetPopup(false);
  };
  const fetchWalletData2 = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem('user'))?.id;
      if (!userId) throw new Error('User ID not found');
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/getwalletandexposure/${userId}`);
      setInitialbalce(response.data.balance)
      // console.log(response.data)
    } catch (err) {
      toast.error('Failed to fetch wallet data.');
    }
  };
  useEffect(() => {
    fetchWalletData2();
  }, [balance]);
  // console.log("marketOdddsExposore",marketOddsExposure);
  // console.log("overMarketExposure",overMarketExposure);
  const fetchWalletData = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem('user'))?.id;
      if (!userId) throw new Error('User ID not found');
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/getwalletandexposure/${userId}`);
      setBalance(response.data.balance);
      setMarketOddsExposure(response.data.exposureBalance)
      // setTeam1Winnings(response.data.teamAProfit)
      // setTeam2Winnings(response.data.teamBProfit)
      // console.log(response.data)
    } catch (err) {
      toast.error('Failed to fetch wallet data.');
    }
  };
  // useEffect(() => {
  //   fetchWalletData();
  // }, []);

  useEffect(() => {
    fetchWalletData();
    const intervalId = setInterval(fetchWalletData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const userId1 = JSON.parse(localStorage.getItem('user'))?.id;
  const fetchApiMatchOdds = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/laggai_khai_getuserbet/${userId1}`);
      const allData = response.data.bets;
      // Filter data to only include entries where 'match' equals 'matchConstant'
      const filtered = allData.filter((item) => item.match === match);
      console.log(response.data, "data")
      console.log(filtered, "filtereddata")
      setTeam1Winnings(filtered[0].teamAProfit); // Accessing the first object in the array
      setTeam2Winnings(filtered[0].teamBProfit);
      // fetchNameWallet();
    } catch (err) {
      console.error('Error fetching bets:', err);
      // toast.error("There was an error fetching bets.");
    }
  }
  useEffect(() => {
    fetchApiMatchOdds()
  }, []);
  const [previousBet, setPreviousBet] = useState({
    runs: null,
    profit: null,
    type: null,
    rate: null
  });
  const location = useLocation();
  const { id, iframeUrl, match } = location.state || {};
  localStorage.setItem("match", match)
  const {
    overTeam1Winnings,
    overTeam2Winnings,
    handleOverBetPlacement,
    overMarketBets,
    calculateNetPositionForRun,
    calculateTotalExposure
  } = useOverMarket();
  const updateExposureAndBalance = useCallback(() => {
    const totalExposure = Math.abs(marketOddsExposure) + Math.abs(overMarketExposure);
    setExposure(totalExposure);
    // setBalance(initialbalce - totalExposure);
  }, [marketOddsExposure, overMarketExposure]);
  const calculateProfitLoss = useCallback((type, stake, odds, rate) => {
    const parsedStake = parseFloat(stake);
    const parsedOdds = parseFloat(odds);
    const parsedRate = parseFloat(rate);
    if (isNaN(parsedStake) || isNaN(parsedOdds) || isNaN(parsedRate)) {
      throw new Error('Invalid input values for calculation');
    }
    if (parsedRate < 100) {
      if (type.toLowerCase() === 'no') {
        return {
          profit: -parsedStake,
          loss: parsedStake,
          exposure: parsedStake,
          runs: parsedRate
        };
      } else {
        return {
          profit: (parsedStake * parsedOdds) / 100,
          loss: -parsedStake,
          exposure: parsedStake,
          runs: parsedRate
        };
      }
    }
    if (type.toLowerCase() === 'yes') {
      return {
        profit: (parsedStake * parsedOdds) / 100,
        loss: -parsedStake,
        exposure: parsedStake,
        runs: parsedRate
      };
    } else {
      return {
        profit: parsedStake,
        loss: -(parsedStake * parsedOdds) / 100,
        exposure: (parsedStake * parsedOdds) / 100,
        runs: parsedRate
      };
    }
  }, []);
  const handlePlaceBetSession = useCallback(() => {
    if (!betPopup || !betPopup.stake) return;
    try {
      const stake = parseFloat(betPopup.stake);
      const odds = parseFloat(betPopup.odds);
      const rate = parseFloat(betPopup.runs);
      if (isNaN(stake) || isNaN(odds) || isNaN(rate)) {
        throw new Error('Invalid bet values');
      }
      const { profit, loss, exposure } = calculateProfitLoss(
        betPopup.type,
        stake,
        odds,
        rate
      );
      const potentialExposure = exposure + exposure;
      if (potentialExposure > initialbalce) {
        throw new Error('Insufficient balance for this bet');
      }
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
      setSessionBets(prev => [...prev, newBet]);
      updateExposureAndBalance();
      setBetPopup(null);
    } catch (error) {
      console.error('Session bet error:', error);
      // alert(error.message);
      setInsufficientBalanceMessage(error.message);
      setInsufficientBalancePopup(true);
    }
  }, [betPopup, updateExposureAndBalance]);
  useEffect(() => {
    let totalExposure = 0;
    const groupedSessions = {};
    sessionBets.forEach((bet) => {
      const { sessionId, type, runs } = bet;
      if (!groupedSessions[sessionId]) {
        groupedSessions[sessionId] = { yes: [], no: [] };
      }
      groupedSessions[sessionId][type.toLowerCase()].push(bet);
    });
    Object.entries(groupedSessions).forEach(([sessionId, session]) => {
      const { yes, no } = session;
      if (yes.length > 0 || no.length > 0) {
        let sessionExposure = 0;
        const rate = yes.length > 0 ? yes[0].runs : (no.length > 0 ? no[0].runs : 0);
        if (rate < 100) {
          const yesStakes = yes.reduce((sum, bet) => sum + parseFloat(bet.stake), 0);
          const noStakes = no.reduce((sum, bet) => sum + parseFloat(bet.stake), 0);
          const noExposure = noStakes;
          const yesExposure = (yesStakes * parseFloat(yes[0]?.odds || 0)) / 100;
          sessionExposure = Math.max(noExposure, yesExposure);
        } else {
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
  const handleSubmit = useCallback(async () => {
    try {
      setSubmitClick(1);
      if (!selectedBet.odds || parseFloat(selectedBet.odds) === 0) {
        throw new Error("Invalid odds value.");
      }

      if (!selectedBet.label || !stakeValue) {
        throw new Error("Invalid odds value.");
      }

      const stake = Number(stakeValue);
      if (isNaN(stake) || stake <= 0) {
        throw new Error("Invalid stake amount!");
      }

      if (selectedBet.isOverMarket) {
        const parsedRate = parseFloat(selectedBet.rate);
        const parsedStake = parseFloat(stakeValue);
        const betType = selectedBet.type.toLowerCase();
        const currentRuns = parseFloat(selectedBet.odds);
        const currentProfit = (parsedRate / 100) * parsedStake;
        const oppositeBets = sessionBets.filter(bet =>
          bet.runs === currentRuns &&
          bet.type.toLowerCase() !== betType
        );
        let deductionAmount = 0;
        if (parsedRate < 100 && previousBet.runs === currentRuns) {
          deductionAmount = previousBet.profit || 0;
          const newBalance = balance + deductionAmount;
          if (newBalance < 0) {
            setInsufficientBalanceMessage("Insufficient balance after deduction!");
            setInsufficientBalancePopup(true);
            return;
          }
        }
        let amountToDeduct = 0;
        if (parsedRate < 100) {
          amountToDeduct = parsedStake;
        }
        const success = handleOverBetPlacement(
          selectedBet,
          stake,
          balance - deductionAmount,
          (newBalance) => {
            const newExposure = initialbalce - newBalance;
            setOverMarketExposure(Math.abs(newExposure));
            updateExposureAndBalance();
          },
          (newExposure) => {
            setOverMarketExposure(Math.abs(newExposure));
          }
        );
        if (success) {
          setPreviousBet({
            runs: currentRuns,
            profit: currentProfit,
            type: betType,
            rate: parsedRate
          });
          setBalance(balance - amountToDeduct);
          setSelectedBet({ label: "", odds: "" });
          setStakeValue("");
          setProfit(0);
        }
        return;
      }

      // Get current session data
      const currentSessionData = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/laggai_khai_getuserbet/${JSON.parse(localStorage.getItem('user'))?.id}/${localStorage.getItem("match")}`);
      const currentBets = currentSessionData.data.bets || [];
      
      // Calculate current team winnings from existing bets
      let currentTeam1Winnings = 0;
      let currentTeam2Winnings = 0;
      
      currentBets.forEach(bet => {
        if (bet.type === "Lgaai") {
          if (bet.teamIndex === 0) {
            currentTeam1Winnings += (parseFloat(bet.stake) * parseFloat(bet.odds) / 100);
            currentTeam2Winnings -= parseFloat(bet.stake);
          } else if (bet.teamIndex === 1) {
            currentTeam2Winnings += (parseFloat(bet.stake) * parseFloat(bet.odds) / 100);
            currentTeam1Winnings -= parseFloat(bet.stake);
          }
        } else if (bet.type === "khaai") {
          if (bet.teamIndex === 0) {
            currentTeam1Winnings -= (parseFloat(bet.stake) * parseFloat(bet.odds) / 100);
            currentTeam2Winnings += parseFloat(bet.stake);
          } else if (bet.teamIndex === 1) {
            currentTeam2Winnings -= (parseFloat(bet.stake) * parseFloat(bet.odds) / 100);
            currentTeam1Winnings += parseFloat(bet.stake);
          }
        }
      });

      const decimalOdds = (Number(selectedBet.odds) / 100) + 1;
      const newProfit = Math.round(stake * (decimalOdds - 1));
      const teamIndex = data && data.length > 0 ? data.findIndex(row => row[0] === selectedBet.label) : -1;
      setTeamInd(teamIndex);

      if (teamIndex === -1) {
        throw new Error("Invalid team selection");
      }

      // Calculate new winnings based on current session data
      let newTeam1Winnings = currentTeam1Winnings;
      let newTeam2Winnings = currentTeam2Winnings;

      if (selectedBet.type === "Lgaai") {
        if (teamIndex === 0) {
          newTeam1Winnings += newProfit;
          newTeam2Winnings -= stake;
        } else if (teamIndex === 1) {
          newTeam2Winnings += newProfit;
          newTeam1Winnings -= stake;
        }
      } else if (selectedBet.type === "khaai") {
        if (teamIndex === 0) {
          newTeam1Winnings -= newProfit;
          newTeam2Winnings += stake;
        } else if (teamIndex === 1) {
          newTeam2Winnings -= newProfit;
          newTeam1Winnings += stake;
        }
      }

      // Calculate the new exposure based on current session data
      const newExposure = Math.abs(Math.min(newTeam1Winnings, newTeam2Winnings));
      
      // Calculate the actual amount to deduct (only the stake amount)
      const amountToDeduct = stake;

      // Check if user has sufficient balance for the stake amount
      if (amountToDeduct > balance) {
        setInsufficientBalanceMessage("Insufficient balance for this bet!");
        setInsufficientBalancePopup(true);
        return;
      }

      // Update balance and exposure immediately
      setBalance(prevBalance => prevBalance - amountToDeduct);
      setMarketOddsExposure(newExposure);
      setTeam1Winnings(newTeam1Winnings);
      setTeam2Winnings(newTeam2Winnings);

      // Calculate total exposure including over market
      const totalExposure = newExposure + overMarketExposure;
      updateExposure(totalExposure);

      // Place the bet via API
      const now = new Date();
      const newBet = {
        time: now.toISOString(),
        label: selectedBet.label,
        odds: selectedBet.odds,
        type: selectedBet.type,
        stake: stakeValue,
        teamAProfit: Number(newTeam1Winnings.toFixed(2)),
        teamBProfit: Number(newTeam2Winnings.toFixed(2)),
        balance: Number((balance - amountToDeduct).toFixed(2)),
        exposure: Number(totalExposure.toFixed(2)),
        marketType: 'matchOdds',
        rate: selectedBet.odds,
        userId: JSON.parse(localStorage.getItem('user'))?.id,
        match: match,
        teamIndex: teamIndex
      };

      try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/laggai_khai_bets`, newBet);
        
        if (response.status === 201) {
          // Update wallet data immediately after successful bet placement
          await fetchNameWallet();
          setSuccessMessage("Bet placed successfully.");
          setSuccessPopup(true);

          // Reset form
          setSelectedBet({ label: "", odds: "" });
          setStakeValue("");
          setProfit(0);
        } else {
          // Revert balance if bet placement fails
          setBalance(prevBalance => prevBalance + amountToDeduct);
          setMarketOddsExposure(prevExposure => prevExposure - newExposure);
          toast.error(response.data.message || "Failed to place bet.");
        }
      } catch (error) {
        // Revert balance if API call fails
        setBalance(prevBalance => prevBalance + amountToDeduct);
        setMarketOddsExposure(prevExposure => prevExposure - newExposure);
        console.error('API Error:', error);
        toast.error("Failed to place bet. Please try again.");
      }
    } catch (error) {
      console.error('Bet placement error:', error);
      setInsufficientBalanceMessage(error.message);
      setInsufficientBalancePopup(true);
    }
  }, [
    selectedBet,
    stakeValue,
    balance,
    data,
    team1Winnings,
    team2Winnings,
    marketOddsExposure,
    overMarketExposure,
    match,
    fetchNameWallet,
    updateExposure
  ]);
  const calculateProfit = (odds, stake) => {
    if (!odds || !stake) return 0;
    const decimalOdds = (parseFloat(odds) / 100) + 1;
    return Math.round(parseFloat(stake) * (decimalOdds - 1));
  };
  useEffect(() => {
    if (selectedBet.label) {
      console.log("selectedBet", selectedBet.label);
      setSelectedBetLabel(selectedBet.label);
    }
    if (selectedBet.odds) {
      console.log("selectedBet", selectedBet.odds);
      setSelectedBetOdds(selectedBet.odds);
    }
    if (selectedBet.type) {
      console.log("selectedBet", selectedBet.type);
      setSelectedBetType(selectedBet.type);
    }
  }, [selectedBet]);
  useEffect(() => {
    if (balance && exposure) {
      setBalanceChange(true);
    }
    console.log("balance", balance);
    console.log("stakeValue", stakeValue);
    console.log("selectedBet", selectedBet);
    console.log("team1Winnings", team1Winnings);
    console.log("team2Winnings", team2Winnings);
    console.log("balance", balance);
    console.log("exposure", exposure);
    console.log("match", match);
    console.log("balanceChange", balanceChange);
    console.log("currentStake", currentStake);
    console.log("oddsData", oddsData);
    console.log("profit", profit)
  }, [balance, exposure]);
  
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
      (parseFloat(team.lgaai) * 100).toFixed(2),
      (parseFloat(team.lgaai) * 100).toFixed(2),
    ],
    [
      (parseFloat(team.khaai) * 100).toFixed(2),
      (parseFloat(team.khaai) * 100).toFixed(2),
    ],
  ]);
  useEffect(() => {
    setData(formattedMatchOdds || []);
  }, [oddsData]);
  useEffect(() => {
    if (selectedBet.odds && stakeValue) {
      const stake = parseFloat(stakeValue);
      const decimalOdds = (parseFloat(selectedBet.odds) / 100) + 1;
      const newProfit = Math.round(stake * (decimalOdds - 1));
      const teamIndex = data.findIndex(row => row[0] === selectedBet.label);
      let potentialLoss = 0;
      if (selectedBet.type === "Lgaai") {
        potentialLoss = stake;
      } else if (selectedBet.type === "khaai") {
        potentialLoss = newProfit;
      }
      if (potentialLoss > balance) {
        console.log('Insufficient balance');
      }
      setProfit(calculateProfit(selectedBet.odds, stakeValue));
    }
  }, [selectedBet.odds, stakeValue, balance, data, selectedBet.label, selectedBet.type]);
  const formattedFancyMarkets = oddsData.fancyMarkets?.map((market) => [
    market.session_name,
    [
      market.runsNo,
      (parseFloat(market.oddsNo) * 100).toFixed(2),
    ],
    [
      market.runsYes,
      (parseFloat(market.oddsYes) * 100).toFixed(2),
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
  const allBets = [...myBets, ...overMarketBets].sort((a, b) => {
    const timeA = a.timestamp || a.time;
    const timeB = b.timestamp || b.time;
    return new Date(timeB) - new Date(timeA);
  });
  useEffect(() => {
    if (insufficientBalancePopup) {
      const timer = setTimeout(() => {
        setIsClosing(true);
        setTimeout(() => {
          setInsufficientBalancePopup(false);
          setIsClosing(false);
        }, 300);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [insufficientBalancePopup]);
  useEffect(() => {
    if (successPopup) {
      const timer = setTimeout(() => {
        setIsClosing(true);
        setTimeout(() => {
          setSuccessPopup(false);
          setIsClosing(false);
        }, 300);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [successPopup]);
const [news, setNews] = useState([{content:"Get Ready for Action - Welcome to 98FastBet!"}]);
  
    useEffect(() => {
      axios.get(`${process.env.REACT_APP_BASE_URL}/api/platform/news`)
        .then((response) => {
          if(response.data.length > 0){
            setNews(response.data)
          }
        })
        .catch((error) => console.error("Error fetching news:", error));
    }, []);
  
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
      {insufficientBalancePopup && (
        <PopupOverlay className={isClosing ? 'closing' : ''}>
          <PopupContainer className={isClosing ? 'closing' : ''}>
            <PopupContent>
              <PopupTitle>{insufficientBalanceMessage}</PopupTitle>
            </PopupContent>
          </PopupContainer>
        </PopupOverlay>
      )}
      {successPopup && (
        <PopupOverlay className={isClosing ? 'closing' : ''}>
          <PopupContainer className={isClosing ? 'closing' : ''} style={{ background: 'linear-gradient(135deg, rgba(42, 64, 42, 0.5), rgba(30, 47, 30, 0.5))' }}>
            <PopupContent>
              <PopupTitle style={{ color: '#4CAF50' }}>{successMessage}</PopupTitle>
            </PopupContent>
          </PopupContainer>
        </PopupOverlay>
      )}
      <div className="T20_container">
        <ToastContainer
          position="top-center"
          autoClose={2000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="colored"
          style={{ top: "12%", left: "50%", transform: "translate(-50%, -50%)", position: "fixed", zIndex: 9999 }}
        />
        <div className="left_side">
          <div className="T20_header">
          <ScrollingTextContainer>
              <ScrollingText>
                <h3>{news[0].content}</h3>
              </ScrollingText>
           </ScrollingTextContainer>
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
            openBetPopup={openBetPopup}
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
            openBetPopup={openBetPopup}
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
              currentBalance={balance}
              currentExposure={exposure}
              betPopup={showBetPopup}
              setBetPopup={setShowBetPopup}
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
            currentBalance={balance}
            currentExposure={exposure}
            betPopup={showBetPopup}
            setBetPopup={setShowBetPopup}
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
const ScrollingTextContainer = styled.div`
  display: flex;
  align-items: center;
  overflow: hidden;
  white-space: nowrap;
  flex: 1;
  margin-right: 0px;
  margin-top:25px;
  @media (max-width: 768px) {
    max-width: 100%;
  }
`;
const ScrollingText = styled.div`
  display: inline-block;
  animation: scrollText 13s linear infinite;
  color: #ff8600;
  font-weight: 500;
  
  @keyframes scrollText {
    0% { transform: translateX(250%); }
    100% { transform: translateX(-100%); }
  }
  
  h3 {
    margin: 0;
    font-size: 16px;
    display: flex;
    align-items: center;
    
    svg {
      margin-right: 8px;
      animation: pulse 1.5s infinite;
      font-size: 22px;
    }
    
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.2); }
      100% { transform: scale(1); }
    }
    
    @media (max-width: 768px) {
      font-size: 14px;
      
      svg {
        margin-right: 6px;
        font-size: 20px;
      }
       @keyframes scrollText {
        0% { transform: translateX(100%); }
        100% { transform: translateX(-100%); }
      }
    }
  }
`;
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
const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000;
  animation: fadeIn 0.3s ease-in-out;
  &.closing {
    animation: fadeOut 0.3s ease-in-out forwards;
  }
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
`;
const PopupContainer = styled.div`
  background: linear-gradient(135deg, rgba(42, 42, 64, 0.5), rgba(30, 30, 47, 0.5));
  border-radius: 5px;
  padding: 0.5rem 1rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  width: auto;
  // max-width: 400px;
  box-sizing:border-box;
  animation: slideIn 0.3s ease-in-out;
  &.closing {
    animation: slideOut 0.3s ease-in-out forwards;
  }
  @keyframes slideIn {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  @keyframes slideOut {
    from {
      transform: translateY(0);
      opacity: 1;
    }
    to {
      transform: translateY(20px);
      opacity: 0;
    }
  }
`;
const PopupContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;
const PopupTitle = styled.h3`
  color: #ff4d4d;
  font-size: 1rem;
  margin-bottom: 1rem;
  font-weight: 600;
`;
const T20 = () => (
  <OverMarketProvider>
    <T20Content />
  </OverMarketProvider>
);
export default T20;