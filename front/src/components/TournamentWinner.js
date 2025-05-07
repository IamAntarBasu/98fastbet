import React, { useState, useEffect } from "react";
import "./TournamentWinner.css";

const TournamentWinner = ({ title, openBetPopup, columns, data, setSelectedBet, profit, stake, clicked, setTournamentWinnerClicked, team1Winnings, team2Winnings }) => {
  const [tselectedBet, setTSelectedBet] = useState({ label: "", odds: "", type: "", rate: "" });
  // console.log()
  const [back, setback] = useState("b");
  const [lay, setlay] = useState("l");
  const [backIndex, setbackIndex] = useState(0);
  const [backProfit, setBackProfit] = useState(0);
  const [layProfit, setLayProfit] = useState(0);
  const [count, setCount] = useState(0);
  const [betPopup, setBetPopup] = useState(null);
  const [sessionBets, setSessionBets] = useState([]);

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
  const calculateProfit = (betType, odds, stake) => {
    if (!stake || isNaN(parseFloat(stake))) return 0;
    
    if (betType === "YES") {
      return (parseFloat(odds) * parseFloat(stake)) / 100;
    } else if (betType === "NO") {
      return parseFloat(stake);
    } else if (betType === "Lgaai") {
      return parseFloat(stake) * parseFloat(odds);
    } else if (betType === "khaai" || betType === "Khaai") {
      return parseFloat(stake);
    }
    
    return 0;
  };

  // Check if this is the match odds section
  const isMatchOdds = title.toLowerCase().includes("match odds");
  // Check if this is the over market section
  const isOverMarket = title.toLowerCase().includes("over market");

  const handleBetSelect = (rowIndex, type, odds, rate) => {
    openBetPopup(); // ✅ This will trigger the popup
    const betData = {
      label: data[rowIndex][0],
      odds: odds.toString(),
      type: type,
      rate: rate ? rate.toString() : ""
    };

    setSelectedBet(betData);
    setTSelectedBet(betData);
    setTournamentWinnerClicked(true);
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
                <div className="odds-value">{title.toLowerCase().includes("match odds") ? "LGAAI" : "NO"}</div>
                <div className="odds-value">{title.toLowerCase().includes("match odds") ? "KHAAI" : "YES"}</div>
              </div>
            </div>
            {data
              .filter(row => row[0] && row[0] !== "")
              .map((row, rowIndex) => {
                return (
                  <div key={rowIndex} className="odds-row">
                    <div className="team-info">
                      <span className="team-name">{row[0]}</span>
                      {isMatchOdds && (
                        <span className={`winning ${rowIndex === 0 ? team1Winnings >= 0 ? 'positive' : 'negative' : team2Winnings >= 0 ? 'positive' : 'negative'}`}>
                          {rowIndex === 0 ? 
                            (team1Winnings >= 0 ? `+${team1Winnings}` : team1Winnings) :
                            (team2Winnings >= 0 ? `+${team2Winnings}` : team2Winnings)
                          }
                        </span>
                      )}
                    </div>
                    <button 
                      className={`back-btn ${tselectedBet.label === row[0] && tselectedBet.type === "Lgaai" ? 'selected' : ''}`}
                      onClick={() => handleBetSelect(rowIndex, `${title.toLowerCase().includes("match odds") ? "Lgaai" : "no"}`, row[1][0], row[1][1])}
                    >
                      <div className="odds-value">{row[1] && row[1][0] ? parseFloat(row[1][0]).toFixed(2) : '-'}</div>
                      {isOverMarket && row[1] && row[1][1] && (
                        <div className="rate-value">{row[1][1]}</div>
                      )}
                    </button>
                    <button 
                      className={`lay-btn ${tselectedBet.label === row[0] && tselectedBet.type === "khaai" ? 'selected' : ''}`}
                      onClick={() => handleBetSelect(rowIndex, `${title.toLowerCase().includes("match odds") ? "khaai" : "yes"}`, row[2][0], row[2][1])}
                    >
                      <div className="odds-value">{row[2] && row[2][0] ? parseFloat(row[2][0]).toFixed(2) : '-'}</div>
                      {isOverMarket && row[2] && row[2][1] && (
                        <div className="rate-value">{row[2][1]}</div>
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