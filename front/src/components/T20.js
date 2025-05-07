import React, { useState, useEffect, useRef } from "react";
import "./T20.css";
import BetSection from "./RightSideBar";
import TournamentWinner from "./TournamentWinner";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import Navbar from '../AllGamesNavbar/AllNavbar';
import io from "socket.io-client";
import axios from "axios";
const socket = io(`${process.env.REACT_APP_BASE_URL}`);



const T20 = () => {
  const [showBetPopup, setShowBetPopup] = useState(false);

  const openBetPopup = () => setShowBetPopup(true);
  const closeBetPopup = () => setShowBetPopup(false);
console.log(showBetPopup, "popup")

  const [selectedBet, setSelectedBet] = useState({ label: "", odds: "", type: "", rate: "" });
  const [stakeValue, setStakeValue] = useState("");
  const [profit, setProfit] = useState(0);
  const [myBets, setMyBets] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const location = useLocation();
  const { id, iframeUrl, match } = location.state || {};
  const stakeInputRef = useRef(null);

  const [TournamentWinnerClicked, setTournamentWinnerClicked] = useState(false);
  const [NormalClicked, setNormalClicked] = useState(false);
  //Session Logic
  // console.log(id, iframeUrl, match)
  const [betPopup, setBetPopup] = useState(null);
  const [balance, setBalance] = useState(15000);
  const [exposure, setExposure] = useState(0);
  const [sessionBets, setSessionBets] = useState([]);


  const handleOpenBetPopup = (sessionId, type, odds, runs) => {
    setBetPopup({ sessionId, type, odds, runs, stake: "" });
  };

  const handlePlaceBetSession = () => {
    if (!betPopup || betPopup.stake === "") return;

    const betAmount = parseFloat(betPopup.stake);
    if (betAmount > balance) {
      alert("Insufficient balance!");
      return;
    }

    setSessionBets((prev) => [
      ...prev,
      {
        sessionId: betPopup.sessionId,
        type: betPopup.type,
        odds: betPopup.odds,
        runs: betPopup.runs,
        stake: betPopup.stake,
        rate: betPopup.rate
      },
    ]);

    setBalance((prev) => prev - betAmount);
    setBetPopup(null);
  };


  // const calculateProfitLoss = (bets, type) => {
  //   const filteredBets = bets.filter((bet) => bet.type === type);
  //   let totalProfit = 0, totalLoss = 0;
  //   filteredBets.forEach((bet) => {
  //     const stake = parseFloat(bet.stake) || 0;
  //     if (type === "yes") {
  //       totalProfit += bet.rate * stake;
  //       totalLoss += stake;
  //     } else if (type === "no") {
  //       totalProfit += stake;
  //       totalLoss += bet.rate * stake;
  //     } else if (type === "Lgaai") {
  //       totalProfit += bet.odds * stake;
  //       totalLoss += stake;
  //     } else if (type === "khaai") {
  //       totalProfit += stake;
  //       totalLoss += bet.odds * stake;
  //     }
  //   });

  //   return { profit: totalProfit, loss: totalLoss };
  // };

  useEffect(() => {
    let totalExposure = 0;
    const groupedSessions = {};

    // Group bets by session ID
    sessionBets.forEach((bet) => {
      const { sessionId, type } = bet;
      if (!groupedSessions[sessionId]) {
        groupedSessions[sessionId] = { yes: [], no: [], Lgaai: [], khaai: [] };
      }
      groupedSessions[sessionId][type].push(bet);
    });

    // Calculate exposure for each session
    Object.values(groupedSessions).forEach((session) => {
      const { yes, no, Lgaai, khaai } = session;

      // Handle Yes/No bets
      if (yes.length > 0 || no.length > 0) {
        let totalYesLoss = 0, totalNoLoss = 0;
        let yesOdds = yes.length > 0 ? yes[0].odds : null;
        let noOdds = no.length > 0 ? no[0].odds : null;

        yes.forEach(bet => {
          totalYesLoss += parseFloat(bet.stake);
        });

        no.forEach(bet => {
          totalNoLoss += parseFloat(bet.stake) * bet.rate;
        });

        if (yes.length > 0 && no.length > 0) {
          if (yesOdds <= noOdds) {
            totalExposure += Math.abs(parseInt(totalYesLoss) - parseInt(totalNoLoss));
          } else {
            totalExposure += parseInt(totalNoLoss + totalYesLoss);
          }
        } else {
          totalExposure += totalYesLoss + totalNoLoss;
        }
      }

      // Handle Lgaai/Khaai bets
      if (Lgaai.length > 0 || khaai.length > 0) {
        let totalLgaaiLoss = 0, totalKhaaiLoss = 0;

        Lgaai.forEach(bet => {
          totalLgaaiLoss += parseFloat(bet.stake);
        });

        khaai.forEach(bet => {
          totalKhaaiLoss += parseFloat(bet.stake);
        });

        if (Lgaai.length > 0 && khaai.length > 0) {
          totalExposure += Math.abs(totalLgaaiLoss - totalKhaaiLoss);
        } else {
          totalExposure += totalLgaaiLoss + totalKhaaiLoss;
        }
      }
    });

    setExposure(totalExposure);
  }, [sessionBets]);



  //Match Logic

  const [currentStake, setCurrentStake] = useState('');
  const [backProfit, setBackProfit] = useState(0);
  const [layProfit, setLayProfit] = useState(0);
  const [team1Winnings, setTeam1Winnings] = useState(0);
  const [team2Winnings, setTeam2Winnings] = useState(0);




  const handleSubmit = async () => {
    if (!selectedBet.label || !stakeValue || isNaN(stakeValue)) {
      alert("Please fill out all fields correctly!");
      return;
    }

    const stake = parseFloat(stakeValue);
    const decimalOdds = (parseFloat(selectedBet.odds) / 100) + 1;
    const newProfit = Math.round(stake * (decimalOdds - 1));
    const teamIndex = data.findIndex(row => row[0] === selectedBet.label);

    // Calculate potential losses
    let potentialLoss = 0;

    if (selectedBet.type === "Lgaai") {
      potentialLoss = stake;
    } else if (selectedBet.type === "khaai") {
      potentialLoss = newProfit;
    }

    // Check if user has sufficient balance
    if (potentialLoss > balance) {
      alert('Insufficient balance.');
      return;
    }

    // First, revert all exposure back to balance
    if (exposure > 0) {
      setBalance(prevBalance => prevBalance + exposure);
      setExposure(0);
    }

    let newBalance = balance;
    let newExposure = exposure;
    let newBackProfit = backProfit;
    let newLayProfit = layProfit;

    if (selectedBet.type === "Lgaai") {
      newBackProfit = backProfit + newProfit;
      setBackProfit(newBackProfit);

      newBalance = layProfit === 0 ?
        balance - stake :
        balance - Math.abs(newBackProfit - layProfit);

      newExposure = layProfit === 0 ?
        stake :
        Math.abs(newBackProfit - layProfit);

      if (teamIndex === 0) {
        setTeam1Winnings((newBackProfit - layProfit));
        setTeam2Winnings(prev => prev + (-stake));
      } else if (teamIndex === 1) {
        setTeam2Winnings((newBackProfit - layProfit));
        setTeam1Winnings(prev => prev + (-stake));
      }
    } else if (selectedBet.type === "khaai") {
      newLayProfit = layProfit + newProfit;
      setLayProfit(newLayProfit);

      newBalance = balance - Math.abs(backProfit - newLayProfit);
      newExposure = Math.abs(backProfit - newLayProfit);

      if (teamIndex === 0) {
        setTeam1Winnings((backProfit - newLayProfit));
        setTeam2Winnings(prev => prev + stake);
      } else if (teamIndex === 1) {
        setTeam2Winnings((backProfit - newLayProfit));
        setTeam1Winnings(prev => prev + stake);
      }
    }

    // Update state
    setBalance(newBalance);
    setExposure(newExposure);

    const now = new Date();
    const formattedDate = now.toLocaleDateString();
    const formattedTime = now.toLocaleTimeString();

    // Store the bet with the new balance and exposure
    setMyBets((prevBets) => [
      ...prevBets,
      {
        ...selectedBet,
        time: `${formattedDate} ${formattedTime}`,
        stake: stakeValue,
        teamAProfit: selectedBet.type === "Lgaai" ?
          (teamIndex === 0 ? (newBackProfit - layProfit).toFixed(2) : (-stake).toFixed(2)) :
          (teamIndex === 0 ? (backProfit - newLayProfit).toFixed(2) : 0),
        teamBProfit: selectedBet.type === "Lgaai" ?
          (teamIndex === 1 ? (newBackProfit - layProfit).toFixed(2) : (-stake).toFixed(2)) :
          (teamIndex === 1 ? (backProfit - newLayProfit).toFixed(2) : 0),
        balance: newBalance.toFixed(2),
        exposure: newExposure.toFixed(2)
      },
    ]);


    setSelectedBet({ label: "", odds: "" });
    setStakeValue("");
    setProfit(0);
  };

  const calculateProfit = (odds, stake) => {
    if (!odds || !stake) return 0;
    // Convert odds from percentage format (e.g., 30) to decimal format (e.g., 1.30)
    const decimalOdds = (parseFloat(odds) / 100) + 1;
    return Math.round(parseFloat(stake) * (decimalOdds - 1));
  };
  const [oddsData, setOddsData] = useState({});
  const [data, setData] = useState([]);

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
    ],
    [
      (parseFloat(team.khaai) * 100).toFixed(2), // Lay odds
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


  const [fancyData, setFancyData] = useState([]);

  useEffect(() => {
    setFancyData(formattedFancyMarkets || []);
  }, [oddsData]);


  // const columnsOB = ["Min: 100 Max: 1K","YES", "NO"];

  // const OverBookmaker = [
  //   ["SEC 1 to 6 over run", [360], [400]],
  //   ["pc 1 to 6 over run", [280], [310]]
  // ];

  const columnstied = ["Min: 100 Max: 25000", "NO", "YES"];

  const tied = [
    ["Team A", [360], [400]],
    ["Team B", [280], [310]]
  ];
  // console.log(fancyData);

  // const columnsNormal = ["Min: 100 Max: 50K", "YES", "NO"];


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
            stakeInputRef={stakeInputRef}
            openBetPopup={openBetPopup}
          />

          <TournamentWinner
            title={"over market"}
            columns={columnstied}
            data={fancyData}
            setSelectedBet={setSelectedBet}
            profit={profit}
            betFor={selectedBet}
            stake={stakeValue}
            clicked={NormalClicked}
            setTournamentWinnerClicked={setNormalClicked}
            team1Winnings={team1Winnings}
            team2Winnings={team2Winnings}
            stakeInputRef={stakeInputRef}
            openBetPopup={openBetPopup}
          />
          {/* {showBetPopup && (
            <div className="mobile-view" >
              <BetSection
                selectedBet={selectedBet}
                stakeValue={stakeValue}
                setStakeValue={setStakeValue}
                profit={profit}
                isPaused={isPaused}
                setSelectedBet={setSelectedBet}
                setProfit={setProfit}
                handleSubmit={handleSubmit}
                myBets={myBets}
                setCurrentStake={setCurrentStake}
                stakeValues={[100, 200, 500, 1000, 2000, 5000, 10000, 15000, 20000, 25000]}
                stakeInputRef={stakeInputRef}
              />
            </div>
          )} */}

          {showBetPopup && (
            <div className="bet-popup-overlay" onClick={closeBetPopup}>
              <div className="bet-popup" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={closeBetPopup}>X</button>
                <BetSection
                  selectedBet={selectedBet}
                  stakeValue={stakeValue}
                  setStakeValue={setStakeValue}
                  profit={profit}
                  isPaused={isPaused}
                  setSelectedBet={setSelectedBet}
                  setProfit={setProfit}
                  handleSubmit={handleSubmit}
                  myBets={myBets}
                  setCurrentStake={setCurrentStake}
                  stakeValues={[100, 200, 500, 1000, 2000, 5000, 10000, 15000, 20000, 25000]}
                />
              </div>
            </div>
          )}

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
            myBets={myBets}
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
  margin-top: 2rem;
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

export default T20;
