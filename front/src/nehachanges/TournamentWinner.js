import React, { useState, useEffect } from "react";
import "./TournamentWinner.css";
import { useOverMarket } from "../context/OverMarketContext";

const TournamentWinner = ({ 
  title, 
  columns, 
  data, 
  setSelectedBet, 
  profit, 
  stake, 
  clicked, 
  setTournamentWinnerClicked, 
  team1Winnings, 
  team2Winnings,
  betFor 
}) => {
  const [tselectedBet, setTSelectedBet] = useState({ label: "", odds: "", type: "", rate: "" });
  const [back, setback] = useState("b");
  const [lay, setlay] = useState("l");
  const [backIndex, setbackIndex] = useState(0);
  const [backProfit, setBackProfit] = useState(0);
  const [layProfit, setLayProfit] = useState(0);
  const [count, setCount] = useState(0);
  const [betPopup, setBetPopup] = useState(null);
  const [sessionBets, setSessionBets] = useState([]);

  const { overTeam1Winnings, overTeam2Winnings } = useOverMarket();

  // Determine styling based on the data structure
  const tableStyle = "odds-row-style";

  useEffect(() => {
    const validColumns = columns.slice(1)
      .map((col, index) => ({ col, index: index + 1 }))
      .filter(item => item.col !== "");

    if (validColumns.length > 0) {
      if (back === "b") {
        setback(validColumns[0].col);
        setbackIndex(validColumns[0].index);
      }
      if (lay === "l" && validColumns.length > 1) {
        setlay(validColumns[1].col);
      }
    }
  }, [columns]);

  // Helper function to determine the color based on the value
  const getOutcomeColor = (value) => {
    if (!value && value !== 0) return 'inherit';
    return value > 0 ? 'rgb(8, 113, 74)' : 'rgb(201, 24, 79)';
  };

  // Calculate profit based on bet type and odds
  const calculateProfit = (betType, odds, stake, rate) => {
    if (!stake || isNaN(parseFloat(stake)) || !rate || isNaN(parseFloat(rate))) {
      return { profit: 0, exposure: 0 };
    }
    
    const parsedStake = parseFloat(stake);
    const parsedRate = parseFloat(rate);
    const parsedOdds = parseFloat(odds);

    // Special case for rates below 100 (applies to both YES and NO bets)
    if (parsedRate < 100) {
      const deduction = parsedStake;
      const potentialReturn = (parsedStake * parsedRate / 100);
      const profit = potentialReturn - deduction;
      
      // For rates below 100, exposure is always the stake amount
      // because that's the maximum amount you can lose
      return {
        profit: profit,
        exposure: parsedStake
      };
    }
    
    // Standard calculation for rates 100 and above
    let profit = 0;
    let exposure = 0;

    if (betType === "YES") {
      profit = (parsedOdds * parsedStake) / 100;
      exposure = parsedStake;
    } else if (betType === "NO") {
      profit = parsedStake;
      exposure = (parsedOdds * parsedStake) / 100;
    } else if (betType === "Lgaai") {
      profit = parsedStake * parsedOdds;
      exposure = parsedStake;
    } else if (betType === "khaai" || betType === "Khaai") {
      profit = parsedStake;
      exposure = parsedStake * parsedOdds;
    }
    
    return { profit, exposure };
  };

  // Check if this is the match odds section
  const isMatchOdds = title.toLowerCase().includes("match odds");
  // Check if this is the over market section
  const isOverMarket = title.toLowerCase().includes("over market");

  const handleBetSelect = (rowIndex, type, odds, runs) => {
    const betData = {
      label: data[rowIndex][0],
      odds: isMatchOdds ? runs : odds, // For match odds, odds equals runs/rate
      type,
      rate: runs,
      isOverMarket: isOverMarket
    };
    
    // Calculate profit and exposure based on current stake if available
    if (stake) {
      const { profit, exposure } = calculateProfit(type, odds, stake, runs);
      betData.profit = profit;
      betData.exposure = exposure;
    }
    
    setTSelectedBet(betData);
    setSelectedBet(betData);
    
    // Scroll to bet section
    const betSection = document.getElementById('bet-section');
    if (betSection) {
      betSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="tournament_winner">
      <div className="T20_header">
        <h1>{title}</h1>
      </div>
      <div className="tournament_winner_table">
        <div className="table-container">
          <div className="odds-container">
            <div className="odds-row header-row">
              <div className="team-info">
                <span className="team-name">{columns[0]}</span>
              </div>
              <div className="odds-headers">
                <div className="odds-value">{isMatchOdds ? "LGAAI" : "NO"}</div>
                <div className="odds-value">{isMatchOdds ? "KHAAI" : "YES"}</div>
              </div>
            </div>
            {data
              .filter(row => row[0] && row[0] !== "")
              .map((row, rowIndex) => {
                const isSelected = tselectedBet.label === row[0];
                const isMatchOdds = title.toLowerCase().includes("match odds");
                const isOverMarket = title.toLowerCase().includes("over market");
                const winnings = isOverMarket ? 
                  (rowIndex === 0 ? overTeam1Winnings : overTeam2Winnings) :
                  (rowIndex === 0 ? team1Winnings : team2Winnings);

                return (
                  <div key={rowIndex} className="odds-row">
                    <div className="team-info">
                      <span className="team-name">{row[0]}</span>
                      <span className={`winning ${winnings >= 0 ? 'positive' : 'negative'}`}>
                        {winnings >= 0 ? `+${winnings}` : winnings}
                      </span>
                    </div>
                    <button 
                      className={`back-btn ${isSelected && tselectedBet.type === (isMatchOdds ? "Lgaai" : "no") ? 'selected' : ''}`}
                      onClick={() => handleBetSelect(
                        rowIndex, 
                        isMatchOdds ? "Lgaai" : "no",
                        row[1] && row[1][1] ? parseFloat(row[1][1]).toFixed(2) : 0,
                        row[1] && row[1][0] ? parseFloat(row[1][0]).toFixed(2) : 0
                      )}
                    >
                      {isOverMarket ? (
                        <>
                          <div className="rate-value">{row[1] && row[1][0] ? parseFloat(row[1][0]).toFixed(2) : '-'}</div>
                          <div className="odds-value">{row[1] && row[1][1] ? parseFloat(row[1][1]).toFixed(2) : '-'}</div>
                        </>
                      ) : (
                        <div className="odds-value">{row[1] && row[1][0] ? parseFloat(row[1][0]).toFixed(2) : '-'}</div>
                      )}
                    </button>
                    <button 
                      className={`lay-btn ${isSelected && tselectedBet.type === (isMatchOdds ? "khaai" : "yes") ? 'selected' : ''}`}
                      onClick={() => handleBetSelect(
                        rowIndex,
                        isMatchOdds ? "khaai" : "yes",
                        row[2] && row[2][1] ? parseFloat(row[2][1]).toFixed(2) : 0,
                        row[2] && row[2][0] ? parseFloat(row[2][0]).toFixed(2) : 0
                      )}
                    >
                      {isOverMarket ? (
                        <>
                          <div className="rate-value">{row[2] && row[2][0] ? parseFloat(row[2][0]).toFixed(2) : '-'}</div>
                          <div className="odds-value">{row[2] && row[2][1] ? parseFloat(row[2][1]).toFixed(2) : '-'}</div>
                        </>
                      ) : (
                        <div className="odds-value">{row[2] && row[2][0] ? parseFloat(row[2][0]).toFixed(2) : '-'}</div>
                      )}
                    </button>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentWinner;