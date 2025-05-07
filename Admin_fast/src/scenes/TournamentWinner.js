import React, { useState, useEffect, useCallback } from "react";
import "./TournamentWinner.css";
import styled from "styled-components";
import axios from 'axios'
import { useOverMarket } from "../context/OverMarketContext";
import { ToastContainer, toast } from "react-toastify";

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

const ReverseButton = styled.button`
  padding: 8px 16px;
  background: linear-gradient(135deg,rgb(202, 85, 26),rgb(189, 53, 20));
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 600;
  margin-left: 8px;
  box-shadow: 0 2px 4px rgba(232, 75, 23, 0.2);
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:hover {
    background: linear-gradient(135deg,rgb(160, 73, 69),rgb(219, 61, 13));
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(200, 79, 19, 0.3);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(189, 58, 18, 0.2);
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
    padding: 8px;
  }
`;

const TeamInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
`;

const OddsButton = styled.button`
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 100px;
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
  background: linear-gradient(90deg, #ffebee, #ffcdd2);
  margin: auto;
  &:hover {
    background: linear-gradient(90deg, #ffcdd2, #ef9a9a);
  }

  // &.selected {
  //   background: linear-gradient(90deg, #ef9a9a, #e57373);
  // }
`;

const KhaaiButton = styled(OddsButton)`
  background: linear-gradient(90deg, #e1f5fe, #b3e5fc);
  margin: auto;

  &:hover {
    background: linear-gradient(90deg, #b3e5fc, #81d4fa);
  }

  // &.selected {
  //   background: linear-gradient(90deg, #81d4fa, #4fc3f7);
  // }
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
  openBetPopup,
  metBet,
  matchOddsTotal,
  match
}) => {
  const { overTeam1Winnings, overTeam2Winnings } = useOverMarket();
  const [tselectedBet, setTSelectedBet] = useState({ label: "", odds: "", type: "", rate: "" });
  const [back, setback] = useState("b");
  const [lay, setlay] = useState("l");
  const [backIndex, setbackIndex] = useState(0);
  const [backProfit, setBackProfit] = useState(0);
  const [layProfit, setLayProfit] = useState(0);
  const [count, setCount] = useState(0);
  const [betPopup, setBetPopup] = useState(null);
  const [sessionBets, setSessionBets] = useState([]);
  const [Newruns, setRuns] = useState(0);
  const [matchOddsResult, setMatchOddsResult] = useState("")
  const [matchName, setMatchName] = useState("")
  const [Alldata, setData] = useState([])
  const [yesRuns, setYesRuns] = useState(0);
  const [noRuns, setNoRuns] = useState(0)
  const [totalBetAmt, setTotalBetAmt] = useState(0)
  const [oddstype, setOddsType] = useState("")

  // Determine styling based on the data structure

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
    // Only call openBetPopup if it exists (mobile view)
    if (openBetPopup) {
      openBetPopup();
    }
    const betData = {
      label: isMatchOdds ? data[rowIndex][0] : metBet[rowIndex][1],
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

    // Only scroll to bet section if not in mobile view (openBetPopup doesn't exist)
    if (!openBetPopup) {
      const betSection = document.getElementById('bet-section');
      if (betSection) {
        betSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const fetchMatchData = async (matchName) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/cricket-market-match/${matchName}`);

      setData(response.data);

      // Calculate the sum of all stake values
      const totalStake = response.data.reduce((sum, betdata) => sum + (betdata.stake || 0), 0);
      console.log(totalStake)
      setTotalBetAmt(totalStake);

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMatchData()
  }, [])


  // console.log(metBet, "m")
  // console.log(matchName, Newruns, yesRuns, noRuns)
  const postResult = async (match_name, no_runs, yes_runs) => {
    console.log("API Call Triggered with Data:", { Newruns, matchName, yesRuns, noRuns });

    if (!Newruns || !match_name || !yes_runs || !no_runs) {
      toast.error("Missing required data. Please try again.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/session-results/post`,
        { runs: Newruns, matchName: match_name, match: match, yesRuns: yes_runs, noRuns: no_runs }
      );

      if (response.data.success) {
        toast.success("Successfully posted data!");
      } else {
        toast.error(response.data.message || "Failed to update result.");
      }
    } catch (error) {
      console.error("Error updating result:", error);
      toast.error("There was an error updating the result. Please try again.");
    }
  };


  const matchOddsResultFunc = async (match_name) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/admin/new-declaration`, {
        resultType: matchOddsResult, winner: match_name, match: match
      })
      if (response.status === 200) {
        // fetchMatchData(matchName)
        toast.success(response.data.message)
      } else {
        toast.error(response.data.message || "Failed to update result.");
      }
    } catch (error) {
      console.error("Error updating result:", error);
      toast.error("There was an error updating the result. Please try again.");
    }
  }

  const handleReverse = async () => {
    try {
      console.log("🔹 Sending request...");
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/session-results/reset`);
      console.log("✅ Response received:", response);

      if (response.status === 200) {
        toast("Successfully reversed");
      } else {
        toast.error(response?.data?.message?.toString() || "Failed to update result.");
      }
    } catch (error) {
      console.error("❌ Error updating result:", error);
      toast.error(error?.response?.data?.message?.toString() || "There was an error updating the reverse.");
    }
  };
  const handleReverseMatchOdds = async () => {
    try {
      console.log("🔹 Sending request...");
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/admin/matchodds/resetAllData`, oddstype);
      console.log("✅ Response received:", response);

      if (response.status === 200) {
        toast("Successfully reversed");
      } else {
        toast.error(response?.data?.message?.toString() || "Failed to update result.");
      }
    } catch (error) {
      console.error("❌ Error updating result:", error);
      toast.error(error?.response?.data?.message?.toString() || "There was an error updating the reverse.");
    }
  };
  // console.log(metBet)


  return (
    <div className="tournament_winner">
      <ToastContainer
        position="top-center"
        autoClose={2000}
        // hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        // theme="colored"
        style={{
          top: "12%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          position: "fixed",
          zIndex: 9999,
          // backgroundColor: "green"
        }}
      />
      <div className="T20_header">
        <h1>{title}</h1>
        {isMatchOdds ?
          <ReverseButton onClick={handleReverseMatchOdds}>Reverse</ReverseButton>
          :
          ""
        }
      </div>
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <TableHeader>{columns[0]}</TableHeader>
              <TableHeader>{isMatchOdds ? "LGAAI" : "NO"}</TableHeader>
              <TableHeader>{isMatchOdds ? "KHAAI" : "YES"}</TableHeader>
              <TableHeader>ACTIONS</TableHeader>
            </tr>
          </thead>
          <tbody>
            {isMatchOdds
              ? matchOddsTotal
                .map((row, rowIndex) => {
                  const isSelected = tselectedBet.label === row.label;
                  const isOverMarket = title.toLowerCase().includes("over market");
                  const winnings = isOverMarket
                    ? rowIndex === 0
                      ? overTeam1Winnings
                      : overTeam2Winnings
                    : rowIndex === 0
                      ? team1Winnings
                      : team2Winnings;

                  return (
                    <tr key={rowIndex}>
                      <TableCell>
                        <TeamInfo>
                          <span className="team-name" style={{ fontWeight: 'bold', color: '#333' }}>
                            {row.label}
                            <span style={{ color: '#888', marginLeft: '5px' }}>-{row.totalStake1}</span>
                          </span>
                          {/* <span>000</span> */}
                          {/* <span>{row.totalStake} 000</span> */}
                        </TeamInfo>
                      </TableCell>
                      <TableCell>
                        <LagaiButton
                          className={
                            isSelected && tselectedBet.type === "Lgaai" ? "selected" : ""
                          }
                          onClick={() =>
                            handleBetSelect(
                              rowIndex,
                              "Lgaai",
                              setOddsType("lgaai"),
                              parseFloat(row[1]?.[1] || 0).toFixed(2),
                              parseFloat(row[1]?.[0] || 0).toFixed(2)
                            )
                          }
                        >
                          {isOverMarket ? (
                            <>
                              <div className="rate-value">
                                {row[1]?.[0] ? parseFloat(row[1][0]).toFixed(2) : "-"}
                              </div>
                              <div className="odds-value">
                                {row[1]?.[1] ? parseFloat(row[1][1]).toFixed(2) : "-"}
                              </div>
                            </>
                          ) : (
                            <div className="odds-value">
                              {row[1]?.[0] ? parseFloat(row[1][0]).toFixed(2) : "-"}
                            </div>
                          )}
                        </LagaiButton>
                      </TableCell>
                      <TableCell>
                        <KhaaiButton
                          className={
                            isSelected && tselectedBet.type === "khaai" ? "selected" : ""
                          }
                          onClick={() =>
                            handleBetSelect(
                              rowIndex,
                              "khaai",
                              setOddsType("khaai"),
                              parseFloat(row[2]?.[1] || 0).toFixed(2),
                              parseFloat(row[2]?.[0] || 0).toFixed(2)
                            )
                          }
                        >
                          {isOverMarket ? (
                            <>
                              <div className="rate-value">
                                {row[2]?.[0] ? parseFloat(row[2][0]).toFixed(2) : "-"}
                              </div>
                              <div className="odds-value">
                                {row[2]?.[1] ? parseFloat(row[2][1]).toFixed(2) : "-"}
                              </div>
                            </>
                          ) : (
                            <div className="odds-value">
                              {row[2]?.[0] ? parseFloat(row[2][0]).toFixed(2) : "-"}
                            </div>
                          )}
                        </KhaaiButton>
                      </TableCell>
                      <TableCell>
                        <ActionContainer>
                          {isMatchOdds ? (
                            <ActionSelect onChange={(e) => setMatchOddsResult(e.target.value)}>
                              <option value="">Select</option>
                              <option value="Winner">Winner</option>
                              <option value="loss">loss</option>
                              <option value="Draw">Draw</option>
                            </ActionSelect>
                          ) : (
                            <ActionInput
                              type="number"
                              placeholder="Enter Runs"
                              min="1"
                              max="25000"
                              step="100"
                              onChange={(e) => setRuns(e.target.value)}
                            />
                          )}
                          <SubmitButton
                            onClick={() => {
                              const matchName = row.label;
                              if (isMatchOdds) {
                                matchOddsResultFunc(matchName);
                              } else {
                                const noRuns = parseFloat(row[1]?.[0] || 0).toFixed(2);
                                const yesRuns = parseFloat(row[2]?.[0] || 0).toFixed(2);

                                postResult(matchName, noRuns, yesRuns);
                                setNoRuns(noRuns);
                                setYesRuns(yesRuns);
                                setMatchName(matchName);
                              }
                            }}
                          >
                            Submit
                          </SubmitButton>

                        </ActionContainer>
                      </TableCell>
                    </tr>
                  );
                })
              : metBet.map((row, rowIndex) => {
                const isSelected = tselectedBet.label === row;

                return (
                  <tr key={rowIndex}>
                    <TableCell>
                      <TeamInfo>
                        <span className="team-name">{row.label}</span>
                      </TeamInfo>
                    </TableCell>
                    <TableCell>
                      <LagaiButton
                        className={
                          isSelected && tselectedBet.type === "no" ? "selected" : ""
                        }
                      // onClick={() =>
                      //   handleBetSelect(
                      //     rowIndex,
                      //     "no",
                      //     parseFloat(row[1]?.[1] || 0).toFixed(2),
                      //     parseFloat(row[1]?.[0] || 0).toFixed(2)
                      //   )
                      // }
                      >
                        <div className="odds-value">
                          {row.noRuns ? parseFloat(row.noRuns).toFixed(2) : "0.00"}

                        </div>
                      </LagaiButton>
                    </TableCell>
                    <TableCell>
                      <KhaaiButton
                        className={
                          isSelected && tselectedBet.type === "yes" ? "selected" : ""
                        }

                      >
                        <div className="odds-value">
                          {row.yesRuns ? parseFloat(row.yesRuns).toFixed(2) : "0.00"}
                        </div>
                      </KhaaiButton>
                    </TableCell>
                    <TableCell>
                      <ActionContainer>
                        <ActionInput
                          type="number"
                          placeholder="Enter Runs"
                          min="1"
                          max="25000"
                          step="100"
                          onChange={(e) => setRuns(e.target.value)}
                        />
                        <SubmitButton
                          onClick={() => {
                            const noRuns = parseFloat(row[1]?.[0] || 0).toFixed(2);
                            const yesRuns = parseFloat(row[2]?.[0] || 0).toFixed(2);
                            const matchName = row.label;

                            postResult(matchName, noRuns, yesRuns);
                            setNoRuns(noRuns);
                            setYesRuns(yesRuns);
                            setMatchName(matchName);
                          }}
                        >
                          Submit
                        </SubmitButton>
                        <ReverseButton onClick={handleReverse}>Reverse</ReverseButton>
                      </ActionContainer>
                    </TableCell>
                  </tr>
                );
              })}

          </tbody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default TournamentWinner;
