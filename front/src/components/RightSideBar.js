import React, { useEffect, useState, useCallback, useRef } from "react";
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
  betPopup,
  setBetPopup,
  setSessionBets,
  stakeValues = [100, 200, 500, 1000, 2000, 5000, 10000, 15000, 20000, 25000],
}) => {
  const [timer, setTimer] = useState(null);
  const stakeInputRef = useRef(null);
// console.log(openBetPopup)
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

  const displayProfit = isNaN(profit) || profit === null ? "0.00" : profit.toFixed(2);

  return (
    <BetSectionContainer>
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
          <BetLabel>Odds</BetLabel>
          <BetInput type="number" value={selectedBet.odds || ""} readOnly placeholder="Odds" />
        </BetRow>
        <BetRow>
          <BetLabel>Rate</BetLabel>
          <BetInput type="number" value={selectedBet.rate || ""} readOnly placeholder="Rate" />
        </BetRow>
        <BetRow>
          <BetLabel>Stake</BetLabel>
          <BetInput
            ref={stakeInputRef}
            type="text"
            value={stakeValue || ""}
            onChange={(e) => {setStakeValue(e.target.value); setCurrentStake(e.target.value);}}
            placeholder="0.00"
            disabled={isPaused}
          />
        </BetRow>
        <BetRow>
          <BetLabel>Profit</BetLabel>
          <BetInput type="text" value={displayProfit} readOnly />
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

      <div>
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
          <BetLabel>Odds</BetLabel>
          <BetInput type="number" value={selectedBet.odds || ""} readOnly placeholder="Odds" />
        </BetRow>
        <BetRow>
          <BetLabel>Rate</BetLabel>
          <BetInput type="number" value={selectedBet.rate || ""} readOnly placeholder="Rate" />
        </BetRow>
        <BetRow>
          <BetLabel>Stake</BetLabel>
          <BetInput
            ref={stakeInputRef}
            type="text"
            value={stakeValue || ""}
            onChange={(e) => {setStakeValue(e.target.value); setCurrentStake(e.target.value);}}
            placeholder="0.00"
            disabled={isPaused}
          />
        </BetRow>
        <BetRow>
          <BetLabel>Profit</BetLabel>
          <BetInput type="text" value={displayProfit} readOnly />
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
      </div>

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
                  <tr key={betIdx}>
                    <td>{bet.label || "-"}</td>
                    <td>{bet.type || "-"}</td>
                    <td>{bet.odds || "-"}</td>
                    <td>{bet.rate || "-"}</td>
                    <td>{bet.stake || "0.00"}</td>
                    <td>{bet.teamAProfit || "0.00"}</td>
                    <td>{bet.teamBProfit || "0.00"}</td>
                    <td>{bet.balance || "0.00"}</td>
                    <td>{bet.exposure || "0.00"}</td>
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