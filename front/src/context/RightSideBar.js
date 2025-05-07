import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";

// Styled Components
const BetSectionContainer = styled.div`
  background: linear-gradient(135deg, #e0f7fa, #b2ebf2);
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  padding: 15px;
  color: #333;
  font-family: "Arial", sans-serif;
  max-width: 100%;
  overflow-x: auto;
  box-sizing: border-box;

`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(90deg, #1976d2, #2196f3);
  padding: 12px;
  border-radius: 8px;
  color: white;
  font-size: 18px;
  font-weight: 600;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 15px;

`;

const SectionTitle = styled.h3`
  margin: 0;
`;

const BetForContainer = styled.div`
  flex-direction: column;
  width: 100%;
  margin-bottom: 15px;
  text-align: center;
`;

const BetContent = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 15px;
  min-width: 0;

  @media (max-width: 768px) {
    gap: 4px;
  }

`;

const BetRow = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 80px;
`;

const BetLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const BetInput = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  text-align: center;
  background: #fff;
  transition: border-color 0.3s ease;
  box-sizing: border-box;

  &:focus {
    border-color: #2196f3;
    box-shadow: 0 0 5px rgba(33, 150, 243, 0.5);
  }

  &[readonly] {
    background: #f5f5f5;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    font-size: 12px;
    padding: 6px;
  }

  @media (max-width: 480px) {
    font-size: 10px;
    padding: 5px;
  }
`;

const StakeButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
  gap: 10px;
  margin-bottom: 15px;
  width: 100%;

`;

const StakeButton = styled.button`
  background: linear-gradient(90deg, #2196f3, #1976d2);
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  transition: transform 0.2s ease, background 0.3s ease;

  &:hover {
    transform: scale(1.05);
    background: linear-gradient(90deg, #1976d2, #2196f3);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 768px) {
    padding: 8px;
    font-size: 12px;
  }

  @media (max-width: 480px) {
    padding: 6px;
    font-size: 10px;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 10px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    gap: 40px;
  }

`;

const ActionButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
  color: white;

  ${({ type }) =>
    type === "reset"
      ? `
        background: linear-gradient(90deg, #f44336, #d32f2f);
        &:hover {
          background: linear-gradient(90deg, #d32f2f, #f44336);
          transform: scale(1.05);
        }
      `
      : `
        background: linear-gradient(90deg, #4caf50, #388e3c);
        &:hover {
          background: linear-gradient(90deg, #388e3c, #4caf50);
          transform: scale(1.05);
        }
      `}

  @media (max-width: 768px) {
    padding: 8px 15px;
    font-size: 12px;
  }

`;

const MyBetTableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  margin-top: 25px;
`;

const MyBetTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  min-width: 600px;

  thead {
    background: #f2f2f2;
    position: sticky;
    top: 0;
  }

  th,
  td {
    padding: 10px;
    text-align: center;
    border-bottom: 1px solid #ddd;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  th {
    font-weight: 600;
  }

  tr:nth-child(even) {
    background: #f9f9f9;
  }

  tr:hover {
    background: #f0f0f0;
  }

  .exposure-cell {
    font-weight: 600;
    &.positive {
      color: #4caf50;
    }
    &.negative {
      color: #f44336;
    }
  }

  @media (max-width: 768px) {
    min-width: 500px;
    th,
    td {
      padding: 8px;
      font-size: 12px;
    }
  }

  @media (max-width: 480px) {
    min-width: 400px;
    th,
    td {
      padding: 6px;
      font-size: 10px;
    }
  }
`;

// BetSection Component
const BetSection = ({
  selectedBet,
  stakeValue,
  setStakeValue,
  profit,
  isPaused,
  setSelectedBet,
  setProfit,
  handleSubmit,
  myBets,
  setCurrentStake,
  calculateProfitLoss,
  wallet,
  setWallet,
  setSessionBets,
  betPopup,
  setBetPopup,
  stakeValues = [100, 200, 300, 400, 500, 600],
  currentBalance,
  currentExposure
}) => {
  const [timer, setTimer] = useState(null);

  // Calculate current exposure for each market type
  const getCurrentExposures = useCallback((bets) => {
    if (!bets || bets.length === 0) return { matchOdds: 0, overMarket: 0 };
    
    const exposures = bets.reduce((acc, bet) => {
      const exposure = parseFloat(bet.exposure) || 0;
      const marketType = bet.marketType || 'matchOdds';
      
      // Initialize market if not exists
      if (!acc[marketType]) {
        acc[marketType] = 0;
      }
      
      // Update exposure for the market
      acc[marketType] = exposure;
      
      return acc;
    }, {});

    return {
      matchOdds: exposures.matchOdds || 0,
      overMarket: exposures.overMarket || 0
    };
  }, []);

  // Comprehensive fancy cricket betting calculations
  const calculateFancyBet = useCallback((betType, stake, odds, rate, runs) => {
    if (!stake || !odds || !rate || !runs) return { profit: 0, loss: 0, exposure: 0 };

    const parsedStake = parseFloat(stake);
    const parsedOdds = parseFloat(odds);
    const parsedRate = parseFloat(rate);
    const parsedRuns = parseFloat(runs);

    // Validate inputs
    if (isNaN(parsedStake) || isNaN(parsedOdds) || isNaN(parsedRate) || isNaN(parsedRuns)) {
      throw new Error('Invalid input values for calculation');
    }

    // Base calculations
    let profit = 0;
    let loss = 0;
    let exposure = 0;
    let deduction = 0;

    // Special handling for rates below 100
    if (parsedRate < 100) {
      if (betType.toLowerCase() === 'no') {
        // For NO bets with rate < 100
        profit = parsedStake;
        loss = parsedStake;
        exposure = parsedStake;
        deduction = parsedStake;
      } else {
        // For YES bets with rate < 100
        profit = parsedRate;
        loss = parsedStake;
        exposure = parsedStake;
        deduction = 0;
      }
    } else {
      // Standard calculations for rates 100 and above
      if (betType.toLowerCase() === 'yes') {
        profit = (parsedStake * parsedOdds) / 100;
        loss = parsedStake;
        exposure = parsedStake;
        deduction = 0;
      } else {
        profit = parsedStake;
        loss = (parsedStake * parsedOdds) / 100;
        exposure = (parsedStake * parsedOdds) / 100;
        deduction = 0;
      }
    }

    // Calculate net position for matched bets
    const calculateNetPosition = (yesBets, noBets) => {
      if (!yesBets?.length && !noBets?.length) return { netExposure: 0, cancelableAmount: 0 };

      // Calculate total stakes and weighted average rates
      const yesTotal = yesBets.reduce((acc, bet) => acc + parseFloat(bet.stake), 0);
      const noTotal = noBets.reduce((acc, bet) => acc + parseFloat(bet.stake), 0);
      
      const yesAvgRate = yesBets.length ? 
        yesBets.reduce((acc, bet) => acc + (parseFloat(bet.rate) * parseFloat(bet.stake)), 0) / yesTotal : 0;
      const noAvgRate = noBets.length ? 
        noBets.reduce((acc, bet) => acc + (parseFloat(bet.rate) * parseFloat(bet.stake)), 0) / noTotal : 0;

      // Calculate cancelable amount
      let cancelableAmount = 0;
      if (yesBets.length && noBets.length) {
        if (yesAvgRate <= noAvgRate) {
          cancelableAmount = Math.min(yesTotal, noTotal);
        }
      }

      // Calculate net exposure
      const netExposure = Math.abs(yesTotal - noTotal) - cancelableAmount;

      return { netExposure, cancelableAmount };
    };

    return {
      profit,
      loss,
      exposure,
      deduction,
      calculateNetPosition
    };
  }, []);

  // Calculate profit based on bet type and rate
  const calculateProfit = useCallback((betType, odds, stake, rate) => {
    const fancyBet = calculateFancyBet(betType, stake, odds, rate, rate);
    return fancyBet.profit;
  }, [calculateFancyBet]);

  const displayProfit = useCallback(() => {
    if (!selectedBet?.type || !stakeValue) return "0.00";
    
    const stake = parseFloat(stakeValue);
    const odds = parseFloat(selectedBet.odds);
    const rate = parseFloat(selectedBet.rate);
    
    if (isNaN(stake) || isNaN(odds) || isNaN(rate)) return "0.00";

    if (selectedBet.marketType === 'overMarket') {
      if (selectedBet.type.toLowerCase() === 'yes') {
        return (stake * odds / 100).toFixed(2);
      } else {
        return (-stake).toFixed(2);
      }
    } else {
      // For match odds
      const decimalOdds = (odds / 100) + 1;
      return (stake * (decimalOdds - 1)).toFixed(2);
    }
  }, [selectedBet, stakeValue]);

  // Update profit when stake changes
  useEffect(() => {
    if (selectedBet?.type && stakeValue) {
      const calculatedProfit = displayProfit();
      setProfit(parseFloat(calculatedProfit));
    } else {
      setProfit(0);
    }
  }, [selectedBet, stakeValue, displayProfit, setProfit]);

  const resetBet = useCallback(() => {
    setSelectedBet({ label: "", odds: "", type: "", rate: "" });
    setStakeValue("");
    setProfit(0);
    setTimer(null);
  }, [setSelectedBet, setStakeValue, setProfit]);

  useEffect(() => {
    if (selectedBet?.label) {
      setTimer(7);
      const countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            resetBet();
            clearInterval(countdown);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [selectedBet, resetBet]);

  const formatTime = useCallback((timestamp) => {
    if (!timestamp) return "-";
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString();
    } catch (error) {
      console.error("Error formatting time:", error);
      return "-";
    }
  }, []);

  const handleStakeButtonClick = useCallback(
    (val) => {
      if (isPaused) return;
      setStakeValue(val.toString());
      setCurrentStake(val.toString());
    },
    [isPaused, setStakeValue, setCurrentStake]
  );

  return (
    <BetSectionContainer id="bet-section">
      <SectionHeader>
        <SectionTitle>Place Bet</SectionTitle>
        <span>(Bet for)</span>
      </SectionHeader>

      <BetForContainer>
        <BetLabel>Bet For</BetLabel>
        <BetInput
          type="text"
          value={selectedBet?.label ? `${selectedBet.label} (${selectedBet.type || ""})` : ""}
          readOnly
          placeholder="Select a Bet"
        />
      </BetForContainer>
      <BetContent>
        <BetRow>
          <BetLabel>{selectedBet.type === "yes" || selectedBet.type === "no" ? "Rate" : "Odds"}</BetLabel>
          <BetInput type="number" value={selectedBet.odds || ""} readOnly placeholder="Odds" />
        </BetRow>
        <BetRow>
          <BetLabel>{selectedBet.type === "yes" || selectedBet.type === "no" ? "Odds" : "Rate"}</BetLabel>
          <BetInput type="number" value={selectedBet.rate || ""} readOnly placeholder="Rate" />
        </BetRow>
        <BetRow>
          <BetLabel>Stake</BetLabel>
          <BetInput
            type="text"
            value={stakeValue || ""}
            onChange={(e) => {setStakeValue(e.target.value); setCurrentStake(e.target.value);}}
            placeholder="0.00"
            disabled={isPaused}
          />
        </BetRow>
        <BetRow>
          <BetLabel>Profit</BetLabel>
          <BetInput type="text" value={displayProfit()} readOnly />
        </BetRow>
      </BetContent>
      <StakeButtons>
        {stakeValues.map((val) => (
          <StakeButton
            key={val}
            onClick={() => handleStakeButtonClick(val)}
            disabled={isPaused}
          >
            {val}
          </StakeButton>
        ))}
      </StakeButtons>
      <ActionButtons>
        <ActionButton type="reset" onClick={resetBet}>
          Reset {timer ? `(${timer})` : ""}
        </ActionButton>
        <ActionButton onClick={handleSubmit}>Submit</ActionButton>
      </ActionButtons>

      <SectionHeader>
        <SectionTitle>My Bet</SectionTitle>
      </SectionHeader>

      <MyBetTableContainer>
        <MyBetTable>
          <thead>
            <tr>
              <th>Matched Bet</th>
              <th>Mode</th>
              <th>Odds</th>
              <th>Rate</th>
              <th>Stake</th>
              <th>Team A Profit</th>
              <th>Team B Profit</th>
              <th>Balance</th>
              <th>Exposure</th>
            </tr>
          </thead>
          <tbody>
            {myBets && myBets.length > 0 ? (
              myBets
                .slice(-10)
                .reverse()
                .map((bet, betIdx) => (
                  <tr key={`bet-${betIdx}`}>
                    <td>{bet.label || "-"}</td>
                    <td>{bet.marketType === 'overMarket' ? 
                      `${bet.type?.toUpperCase() || "-"} @ ${bet.runValue || "-"}` : 
                      bet.type || "-"}</td>
                    <td>{bet.odds || "-"}</td>
                    <td>{bet.marketType === 'overMarket' ? bet.rate || bet.runValue || "-" : bet.odds || "-"}</td>
                    <td>{bet.stake || "0.00"}</td>
                    <td style={{ color: parseFloat(bet.teamAProfit || 0) >= 0 ? 'green' : 'red' }}>
                      {bet.marketType === 'overMarket' ? 
                        (bet.type?.toLowerCase() === 'yes' ? 
                          (parseFloat(bet.stake || 0) * parseFloat(bet.odds || 0) / 100).toFixed(2) : 
                          (-parseFloat(bet.stake || 0)).toFixed(2)) :
                        (parseFloat(bet.teamAProfit || 0)).toFixed(2)}
                    </td>
                    <td style={{ color: parseFloat(bet.teamBProfit || 0) >= 0 ? 'green' : 'red' }}>
                      {bet.marketType === 'overMarket' ? "-" : (parseFloat(bet.teamBProfit || 0)).toFixed(2)}
                    </td>
                    <td>{(parseFloat(currentBalance || 0)).toFixed(2)}</td>
                    <td style={{ color: parseFloat(currentExposure || 0) >= 0 ? 'green' : 'red' }}>
                      {(parseFloat(currentExposure || 0)).toFixed(2)}
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="9">No bets found</td>
              </tr>
            )}
          </tbody>
        </MyBetTable>
      </MyBetTableContainer>
    </BetSectionContainer>
  );
};

export default BetSection;