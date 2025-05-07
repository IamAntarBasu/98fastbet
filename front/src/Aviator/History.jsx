import React, { useEffect, useState } from "react";
import { FaCoins, FaMoneyBillWaveAlt, FaUser } from "react-icons/fa";
import styled from "styled-components";

// const TableContainer = styled.div`
//   width: 95%;
//   // max-width: 900px;
//   margin: auto;
//   // background: #1B1D36;
//   border-radius: 10px;
//   overflow: hidden;
//   @media (max-width: 768px) {
//     width: 100%;
//     margin-top:5px;
//   }
// `;

// const Header = styled.div`
//   display: flex;
//   justify-content: space-between;
//   // background: linear-gradient(90deg, #ff5722, #e91e63);
//   background:#360000;
//   padding: 15px;
//   box-sizing:border-box;
//   color: white;
//   // font-weight: bold;
//   text-align: center;
//   @media (max-width: 768px) {
//     font-size: 14px;
//   }
// `;

// const TableWrapper = styled.div`
//   max-height: 70vh;
//   overflow-y: auto;
//   scrollbar-width: none;
//   scrollbar-color: #ff5722 #1B1D36;

//   &::-webkit-scrollbar {
//     display: none;
//   }

//   &::-webkit-scrollbar {
//     width: 2px;
//   }

//   &::-webkit-scrollbar-thumb {
//     background-color: #ff5722;
//     border-radius: 10px;
//   }
// `;

// const Table = styled.table`
//   width: 100%;
//   border-collapse: collapse;
//   color: white;
// `;

// const TableHeader = styled.thead`
// //   background: #222;
//   text-transform: uppercase;
//   postion:sticky;
//   top:0;
// `;

// const TableRow = styled.tr`
//   border-bottom: 1px solid #444;
// `;

// const TableCell = styled.td`
//   padding: 12px;
//   text-align: center;
//   box-sizing:border-box;
//   font-size:12px;
// `;

// const TableHeaderCell = styled.th`
//   padding: 12px;
//   text-align: center;
//   font-weight: bold;
//    box-sizing:border-box;
// `;


const ResponsiveTable = ({ bettingData, countdown, isBlast }) => {
  const [totalBet, setTotalBets] = useState(0);
  const [totalWinnings, setWinnings] = useState(0);
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [updatedBets, setUpdatedBets] = useState([]);
  const [timeouts, setTimeouts] = useState([]);

  // Reset everything when countdown starts (countdown === 7)
  useEffect(() => {
    if (countdown === 7) {
      setUpdatedBets([]);
      setTotalBets(0);
      setWinnings(0);
      setTotalPlayers(0);
      timeouts.forEach(timeout => clearTimeout(timeout));
      setTimeouts([]);
    }
  }, [countdown]);

  // Start sequence when countdown ends
  useEffect(() => {
    if (countdown === 0) {
      startSequence();
    }
  }, [countdown]);

  // Handle plane blast - turn remaining white rows red
  useEffect(() => {
    if (isBlast) {
      setUpdatedBets(prev => {
        return bettingData.map((bet, index) => {
          // Only update rows that haven't been updated (still white)
          if (!prev[index]?.updated) {
            return {
              ...bet,
              updated: false,
              color: 'red',
              win: '0 INR'
            };
          }
          // Keep already updated (green) rows as they are
          return prev[index];
        });
      });
    }
  }, [isBlast]);

  const startSequence = () => {
    const newTimeouts = [];
    
    bettingData.forEach((bet, index) => {
      // Generate random delay between 1 and 5 seconds after countdown ends
      const randomDelay = Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000;
      
      const timeout = setTimeout(() => {
        // Update the bet with new values
        const updatedBet = {
          ...bet,
          updated: true,
          color: 'green',
          odds: `x${(Math.random() * 10).toFixed(2)}`,
          bet: `${Math.floor(Math.random() * (8000 - 1000 + 1)) + 1000} INR`,
          win: `${Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000} INR`
        };

        setUpdatedBets(prev => {
          const newBets = [...prev];
          newBets[index] = updatedBet;
          return newBets;
        });

        // Update totals
        setTotalPlayers(prev => prev + 1);
        setTotalBets(prev => prev + parseInt(updatedBet.bet));
        setWinnings(prev => prev + parseInt(updatedBet.win));
      }, randomDelay);

      newTimeouts.push(timeout);
    });

    setTimeouts(newTimeouts);
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [timeouts]);

  return (
    <TableContainer>
      <Header>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          Number of players
          <span><FaUser /> {totalPlayers} </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          <span> Total bets </span>
          <span> <FaCoins /> {totalBet} INR </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          <span> Total winnings </span>
          <span> <FaMoneyBillWaveAlt /> {totalWinnings} INR </span>
        </div>
      </Header>
      <TableWrapper>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Username</TableHeaderCell>
              <TableHeaderCell>Odds</TableHeaderCell>
              <TableHeaderCell>Bet</TableHeaderCell>
              <TableHeaderCell>Win</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <tbody>
            {bettingData.map((bet, index) => {
              const updatedBet = updatedBets[index] || bet;
              const color = updatedBet.color || (updatedBet.updated ? '#10b981' : '#ffffff');
              return (
                <TableRow key={index}>
                  <TableCell style={{ color }}>{updatedBet.username}</TableCell>
                  <TableCell style={{ color }}>{updatedBet.odds}</TableCell>
                  <TableCell style={{ color }}>{updatedBet.bet}</TableCell>
                  <TableCell style={{ color }}>{updatedBet.win}</TableCell>
                </TableRow>
              );
            })}
          </tbody>
        </Table>
      </TableWrapper>
    </TableContainer>
  );
};

export default ResponsiveTable;




const TableContainer = styled.div`
  width: 95%;
  margin: auto;
  border-radius: 10px;
  overflow: hidden;

  @media (max-width: 768px) {
    width: 100%;
    margin-top: 5px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  background: #360000;
  padding: 15px;
  box-sizing: border-box;
  color: white;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const TableWrapper = styled.div`
  max-height: 70vh;
  overflow-y: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    width: 2px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #ff5722;
    border-radius: 10px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  color: white;
`;

const TableHeader = styled.thead`
  position: sticky;
  top: -2;
  z-index: 10;
  background: #0F1124;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #444;
`;

const TableCell = styled.td`
  padding: 12px;
  text-align: center;
  box-sizing: border-box;
  font-size: 12px;
`;

const TableHeaderCell = styled.th`
  padding: 12px;
  text-align: center;
  font-weight: bold;
  box-sizing: border-box;
  position: sticky;
  top: -3px;
  background: #0F1124;
    z-index: 100; /* Keeps it above scrolling content */
`;