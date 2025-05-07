import React, { useState, useEffect } from "react";
import "./TournamentWinner.css";
import { useOverMarket } from "../context/OverMarketContext";
import styled from "styled-components";

const ActionSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #2196f3;
  border-radius: 6px;
  background: linear-gradient(135deg, #ffffff, #f5f5f5);
  color: #333;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-width: 120px;
  outline: none;

  &:hover {
    border-color: #1976d2;
    box-shadow: 0 4px 8px rgba(33, 150, 243, 0.2);
  }

  &:focus {
    border-color: #1976d2;
    box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
  }

  option {
    padding: 8px;
    background: white;
    color: #333;
  }

  @media (max-width: 768px) {
    padding: 6px 10px;
    font-size: 12px;
    min-width: 100px;
  }
`;

const ActionInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #2196f3;
  border-radius: 6px;
  background: linear-gradient(135deg, #ffffff, #f5f5f5);
  color: #333;
  font-size: 14px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 120px;
  outline: none;

  &::placeholder {
    color: #999;
  }

  &:hover {
    border-color: #1976d2;
    box-shadow: 0 4px 8px rgba(33, 150, 243, 0.2);
  }

  &:focus {
    border-color: #1976d2;
    box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
  }

  @media (max-width: 768px) {
    padding: 6px 10px;
    font-size: 12px;
    width: 100px;
  }
`;

const ActionContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  min-width: 120px;
  height: 100%;

  @media (max-width: 768px) {
    padding: 0 4px;
    min-width: 100px;
  }
`;

const SubmitButton = styled.button`
  padding: 8px 16px;
  background: linear-gradient(135deg, #4caf50, #45a049);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 600;
  margin-left: 8px;
  box-shadow: 0 2px 4px rgba(76, 175, 80, 0.2);
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:hover {
    background: linear-gradient(135deg, #45a049, #3d8b40);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(76, 175, 80, 0.3);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(76, 175, 80, 0.2);
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 12px;
    font-size: 13px;
  }
`;

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;

  @media (max-width: 768px) {
    margin-bottom: 15px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;

  @media (max-width: 768px) {
    min-width: 100%;
  }
`;

const TableHeader = styled.th`
  padding: 12px;
  text-align: center;
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #eee;
  white-space: nowrap;

  @media (max-width: 768px) {
    padding: 8px;
    font-size: 12px;
  }
`;

const TableCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid #eee;
  vertical-align: middle;
  margin: auto;

  @media (max-width: 768px) {    
       padding: 3px;
       border: 1px solid #9d989873; 
  }
`;

const TeamInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0px;
  }
`;

const OddsButton = styled.button`
  padding: 8px 12px;
  border: 0px solid #e0e0e0;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  margin: 0 4px;

  &.selected {
    background: #e3f2fd;
  }

  &:hover {
    background: #f5f5f5;
  }

  @media (max-width: 768px) {
    width: 100%;
    margin: 0;
    padding: 6px 8px;
  }
`;

// Add new styled components for specific button types
const LagaiButton = styled(OddsButton)`
  // background: linear-gradient(90deg, #ffebee, #ffcdd2);
  color: #de5050;
  margin: auto;
  &:hover {
    // background: linear-gradient(90deg, #ffcdd2, #ef9a9a);
  }

  &.selected {
    background: linear-gradient(90deg, #ef9a9a, #e57373);
    color: red;
  }
`;

const KhaaiButton = styled(OddsButton)`
  // background: linear-gradient(90deg, #e1f5fe, #b3e5fc);
  color: #5d5deb;
  margin: auto;

  &:hover {
    // background: linear-gradient(90deg, #b3e5fc, #81d4fa);
  }

  &.selected {
    background: linear-gradient(90deg, #81d4fa, #4fc3f7);
    color: blue;
  }
`;

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
  betFor, 
  openBetPopup
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

    // Open the bet popup when a button is clicked
    if (openBetPopup) {
      openBetPopup();
    }

    // Only scroll to bet section if not in mobile view (openBetPopup doesn't exist)
    if (!openBetPopup) {
      const betSection = document.getElementById('bet-section');
      if (betSection) {
        betSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return (
    <div className="tournament_winner">
      {/* <div className="T20_header">
        <h1>{title  }</h1>
      </div> */}
      {title === "Tournament Winner" ?
        (< div className="T20_header">
          <h1>{}</h1>
        </div>) :
        ""
      }
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <TableHeader>{columns[0]}</TableHeader>
              <TableHeader>{isMatchOdds ? "LGAAI" : "NO"}</TableHeader>
              <TableHeader>{isMatchOdds ? "KHAAI" : "YES"}</TableHeader>
            </tr>
          </thead>
          <tbody>
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
                  <tr key={rowIndex}>
                    <TableCell>
                    <TeamInfo>
                        <span className="team-name">{row[0]}</span>
                        {title === "Match Odds" && (
                          <span className={`winning ${winnings >= 0 ? 'positive' : 'negative'}`}>
                            {winnings >= 0 ? `+${winnings}` : winnings}
                          </span>
                        )}
                      </TeamInfo>
                    </TableCell>
                    <TableCell>
                      <LagaiButton
                        className={isSelected && tselectedBet.type === (isMatchOdds ? "Lgaai" : "no") ? 'selected' : ''}
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
                            <div className="odds-value odds-value-lk">{row[1] && row[1][1] ? parseFloat(row[1][1]).toFixed(2) : '-'}</div>
                          </>
                        ) : (
                          <div className="odds-value ">{row[1] && row[1][0] ? parseFloat(row[1][0]).toFixed(2) : '-'}</div>
                        )}
                      </LagaiButton>
                    </TableCell>
                    <TableCell>
                      <KhaaiButton
                        className={isSelected && tselectedBet.type === (isMatchOdds ? "khaai" : "yes") ? 'selected' : ''}
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
                            <div className="odds-value odds-value-lk">{row[2] && row[2][1] ? parseFloat(row[2][1]).toFixed(2) : '-'}</div>
                          </>
                        ) : (
                          <div className="odds-value">{row[2] && row[2][0] ? parseFloat(row[2][0]).toFixed(2) : '-'}</div>
                        )}
                      </KhaaiButton>
                    </TableCell>

                  </tr>
                );
              })}
          </tbody>
        </Table>
      </TableContainer>
    </div >
  );
};

export default TournamentWinner;
