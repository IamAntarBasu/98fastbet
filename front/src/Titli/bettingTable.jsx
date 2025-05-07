import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
// import BettingHistory from './bettingHistory';
import History from './History';

const BettingTable = ({titlibets}) => {
  const [activeTab, setActiveTab] = useState('all');

  const [betData, setBetData] = useState(
    [
      { user: "c***5", bet: 8000.00, cashOut: 0 },
      { user: "w***2", bet: 2000.00, cashOut: 0 },
      { user: "w***u", bet: 1000.00, cashOut: 0 },
      { user: "p***8", bet: 1200.00, cashOut: 0 },
      { user: "s***4", bet: 5000.00, cashOut: 0 },
      { user: "y***8", bet: 8000.00, cashOut: 0 },
      { user: "g***1", bet: 9000.00, cashOut: 0 },
      { user: "w***2", bet: 11000.00, cashOut: 0 },
      { user: "w***u", bet: 4500.00, cashOut: 0 },
      { user: "p***8", bet: 9600.00, cashOut: 0 },
      { user: "s***4", bet: 8500.00, cashOut: 0 },
      { user: "y***8", bet: 1100.00, cashOut: 0 },
      { user: "g***1", bet: 7500.00, cashOut: 0 },
      { user: "w***2", bet: 2300.00, cashOut: 0 },
      { user: "w***u", bet: 6900.00, cashOut: 0 },
      { user: "p***8", bet: 6300.00, cashOut: 0 },
      { user: "s***4", bet: 9800.00, cashOut: 0 },
      { user: "y***8", bet: 8700.00, cashOut: 0 },
      { user: "g***1", bet: 9400.00, cashOut: 0 },
    ]
  );
  // Function to update random bet during the game
  const updateRandomBet = () => {
    setBetData((prevData) => {
      const newData = [...prevData];
      const randomIndex = Math.floor(Math.random() * newData.length); // Random index
      const randomOutcome = Math.random() < 0.5 ? -1 : 1; // 50% chance of win or loss
      const randomAmount = Math.floor(Math.random() * 5000) + 1000; // Random amount between 1000 and 6000

      newData[randomIndex] = {
        ...newData[randomIndex],
        cashOut: randomOutcome * randomAmount, // Set random win/loss
      };

      return newData;
    });
  };
// console.log(betPlaced)
  // Trigger random updates while playing
  useEffect(() => {
    // if (isPlaying && betPlaced) {
      const interval = setInterval(() => {
        updateRandomBet();
      }, 600); // Update every second

      return () => clearInterval(interval); // Clear interval when stopped
    // }
  }, []);



  return (
    <Sidebar>
      <TabContainer>
        <Tab active={activeTab === 'all'} onClick={() => setActiveTab('all')}>All Bets</Tab>
        <Tab active={activeTab === 'my'} onClick={() => setActiveTab('my')}>My Bets</Tab>
      </TabContainer>

      {activeTab === 'all' && (
        <BetList>
          {betData.map((bet, index) => (
            <BetItem key={index} color={bet.cashOut > 0 ? 'green' : bet.cashOut < 0 ? 'red' : 'white'}>
              <div>{bet.user}</div>
              <div>₹{bet.bet}</div>
              <div>{bet.cashOut >= 0 ? `₹${bet.cashOut}` : `-₹${Math.abs(bet.cashOut)}`}</div>
            </BetItem>
          ))}
        </BetList>
      )}
      {activeTab === 'my' && <History titlibets={titlibets}/> }
    </Sidebar>
  );
};

const Sidebar = styled.div`
  width: 30%;
  background-color: #2b2f3e;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  height: 90vh;
  flex-direction: column;
  box-sizing: border-box;
  position: fixed;
  left:  20px;
  top:150px;
  @media (max-width: 768px) {
    width: 100%;
     position: unset;
     height: auto;
       padding: 7px;
  }
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const Tab = styled.button`
  flex: 1;
  padding: 10px;
  background-color: ${(props) => (props.active ? '#28a745' : '#3b3f51')};
  color: white;
  border: none;
  border-radius: 10px;
  margin-right: 10px;
  cursor: pointer;
`;

const BetList = styled.div`
  overflow-y: auto;
  flex: 1;
 padding:10px 50px;
  @media (max-width: 768px) {
   padding:10px 20px;
  }
`;

const BetItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  color: ${(props) => props.color};

   @media (max-width: 768px) {
   margin-bottom: 50px;
  }


`;

export default BettingTable;