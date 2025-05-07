import React, { useState, useEffect, useRef, useCallback } from "react";
import "./T20.css";
// import BetSection from "./RightSideBar";
import TournamentWinner from "./TournamentWinner";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import io from "socket.io-client";
import { OverMarketProvider, useOverMarket } from "../context/OverMarketContext";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios'
import { ToastContainer, toast } from "react-toastify";
const socket = io(process.env.REACT_APP_BACKEND_URL);
const T20Content = () => {
  const [oddsData, setOddsData] = useState({});
  const [data, setData] = useState([]);
  const [fancyData, setFancyData] = useState([]);
  const [selectedBet, setSelectedBet] = useState({ label: "", odds: "", type: "", rate: "" });
  const [betData, setBetData] = useState([]);
  const [stakeValue, setStakeValue] = useState("");
  const [profit, setProfit] = useState(0);
  const [TournamentWinnerClicked, setTournamentWinnerClicked] = useState(false);
  const [NormalClicked, setNormalClicked] = useState(false);
  const [balance, setBalance] = useState(null);
  const [exposure, setExposure] = useState(null);
  const [team1Winnings, setTeam1Winnings] = useState(0);
  const [team2Winnings, setTeam2Winnings] = useState(0);
  const [betPopup, setBetPopup] = useState(null);
  const location = useLocation();
  const { id, iframeUrl, match } = location.state || {};
  const [metBets, setMetBets] = useState([]);
  const [yesPlayer, setYesPlayers] = useState(0)
  const [noPlayers, setNoPlayers] = useState(0)
  const [matchOddsBetData, setMatchOddsBetData] = useState(0)
  const [matchOddsTotal, setMatchOddsTotal] = useState([])
  useEffect(() => {
    localStorage.setItem("matchName", match)
  }, [])
  const {
    overTeam1Winnings,
    overTeam2Winnings,
    overMarketBets,

  } = useOverMarket();
  useEffect(() => {
    if (!id) return;
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/odds?market_id=${id}`)
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

  const fetchMatchOdds = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/match_odds_getuserBets/${match}`);
      const bets = response.data.bets;
      setMatchOddsBetData(bets);
      // console.log(bets)
      // Calculate total stake per match label
      const matchStakeTotals = bets.reduce((acc, bet) => {
        // Ensure we only sum valid stakes and labels
        if (bet.label && typeof bet.stake === "number") {
          if (!acc[bet.label]) {
            acc[bet.label] = { label: bet.label, totalStake1: 0 };
          }
          console.log(acc[bet.label].totalStake1)
          acc[bet.label].totalStake1 += bet.stake;
        }
        return acc;
      }, {});

      console.log(matchStakeTotals, "matchodds");

      // Convert object to array for easy iteration in UI
      const totalStakePerMatch = Object.values(matchStakeTotals);

      setMatchOddsTotal(totalStakePerMatch);
      console.log(totalStakePerMatch, "Total stake per match");

    } catch (err) {
      console.error('Error fetching match odds:', err);
    }
  }, [match]); // Ensure it updates when `match` changes
  useEffect(() => {
    fetchMatchOdds();
  }, []);

  console.log(matchOddsTotal, "matchOddsTotal")
  // console.log(matchOddsBetData, "matchOddsdata")

  const fetchAllData = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/cricket-market-by-matchName/${match}`);
      setBetData(response.data);
      // Extract all metBets safely
      const allMetBets = response.data.map(bet => ({
        label: bet.matbet,  // Grouping key
        mode: bet.mode,
        odds: bet.odds,
        rate: bet.rate,
        stake: bet.stake,
        noRuns: bet.mode === "no" ? bet.noRuns : 0,
        yesRuns: bet.mode === "yes" ? bet.noRuns : 0, // Assuming "yes" maps to `noRuns` too
      }));

      // Group and accumulate runs
      console.log(allMetBets, "allBets")
      const sessionRuns = allMetBets.reduce((acc, bet) => {
        if (!acc[bet.label]) {
          acc[bet.label] = { label: bet.label, yesRuns: 0, noRuns: 0 };
        }
        acc[bet.label].yesRuns = bet.yesRuns;
        acc[bet.label].noRuns = bet.noRuns;
        return acc;
      }, {});

      // Convert object to array and remove duplicates
      const uniqueMetBets = Object.values(sessionRuns);
      setMetBets(uniqueMetBets);
    } catch (err) {
      console.error("Error fetching odds:", err);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]); // Runs once when the component mounts

  // console.log(metBets, "metBets");


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
  console.log(matchOddsTotal, "matchOddsTotal1")
  const columnstied = ["Min: 100 Max: 25000", "NO", "YES"];

  return (
    <>

<div className="scorecard" style={{ paddingTop: "0px" }}>
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
            <h1>NEWS</h1>
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
            metBet={metBets}
            matchOddsTotal={matchOddsTotal}
            match={match}
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
            metBet={metBets}
            matchOddsTotal={matchOddsTotal}
            match={match}
          />

          {/* <div className="mobile-view" ref={useRef(null)}>
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
            />
          </div> */}
        </div>

        {/* <div className="right_side">
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
          />
        </div> */}
      </div>


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
