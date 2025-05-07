import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios'; // Import axios for API calls
import { useProfile } from '../context/ProfileContext';

const BettingHistory = ({ userId }) => {
  const [history, setHistory] = useState([]);
  const { profile } = useProfile();
  // console.log(profile)
  // Fetch betting history from API
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/history/${profile.userId}`);
        console.log(response.data, "data")
        setHistory(response.data);
      } catch (error) {
        console.error('Error fetching betting history:', error);
      }
    };

    if (profile.userId) {
      fetchHistory();
    }
  }, [profile.userId]);

  return (
    <Container>
      {/* <Title>Betting History</Title> */}
      <Table>
        <thead>
          <tr>
            <Th>Time</Th>
            <Th>Bet Amount</Th>
            <Th>Win Amount</Th>
            <Th>Result</Th>
          </tr>
        </thead>
        <tbody>
          {history.length > 0 ? (
            history.map((entry, index) => (
              <Row key={index}>
                <Td>{new Date(entry.createdAt).toLocaleTimeString()}</Td>
                <Td>{entry.betAmt}</Td>
                {entry.isWin === "Won" ? (
                  <Td style={{ color: 'green' }}>{entry.winningAmt.toFixed(2)}</Td>
                ) : (
                  <Td style={{ color: 'red' }}>-{entry.betAmt}</Td>
                )}
                <Result result={entry.result}>
                  <span style={{ color: entry.isWin === "Won" ? 'green' : 'red' }}>
                    {entry.isWin === "Won" ? 'Win' : 'Loss'}
                  </span>
                </Result>
              </Row>
            ))
          ) : (
            <tr>
              <NoHistory colSpan="4">No betting history available.</NoHistory>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default BettingHistory;

// Styled-components for styling
const Container = styled.div`
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 16px;
  height:75vh;
  box-sizing:border-box;
  overflow-y: auto;
  scrollbar-width: thin;
  ::-webkit-scrollbar {
    width: 3px;
    height: 8px;
  }
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  ::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;
// const Title = styled.h2`
//   font-size: 1.25rem;
//   font-weight: bold;
//   margin-bottom: 8px;
// `;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
`;

const Th = styled.th`
  // border-bottom: 1px solid #ddd;
  padding: 0px 8px 8px 8px;
    text-align:center;
`;

const Td = styled.td`
  // border-bottom: 1px solid #ddd;
  padding: 15px 20px;
  font-size:12px;
  text-align:center;
`;

const Row = styled.tr`
  &:hover {
    background-color:rgb(91, 85, 85);
    
  }
`;

const Result = styled(Td)`
  color: ${(props) => (props.result === 'Win' ? 'green' : 'red')};
`;

const NoHistory = styled.td`
  padding: 8px;
  text-align: center;
`;