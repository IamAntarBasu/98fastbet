import styled from "styled-components";

const HistoryContainer = styled.div`
  width: 100%;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 10px;
  overflow: hidden;
  color: white;
  font-family: Arial, sans-serif;
`;

const Header = styled.div`
  background: linear-gradient(90deg, rgb(255, 87, 34), rgb(233, 30, 99));
  color: white;
  font-weight: bold;
  padding: 15px;
  box-sizing:border-box;
  text-align: left;
  font-size: 16px;
`;

const HistoryList = styled.div`
  max-height: 500px;
  overflow-y: auto;
`;

const HistoryItem = styled.div`
  background: rgba(255, 255, 255, 0.1);
  margin: 10px;
  padding: 10px;
  box-sizing:border-box;
  border-radius: 5px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 14px;
`;

const Label = styled.span`
  color: rgba(255, 255, 255, 0.7);
`;

const Value = styled.span`
  color: ${(props) => (props.highlight ? "red" : "white")};
`;

const UseGameHistory = ({ userGameHistoryData }) => {
  return (
    <HistoryContainer>
      <Header>HISTORY</Header>
      <HistoryList>
        {userGameHistoryData &&
          userGameHistoryData.map((gameData, index) => (
            <HistoryItem key={index}>
              <Row>
                <Label>ROUND ID</Label>
                <Value>{gameData.round_id}</Value>
              </Row>
              <Row>
                <Label>TIME</Label>
                <Value>{new Date(gameData.createdAt).toLocaleTimeString()}</Value>
              </Row>
              <Row>
                <Label>BET</Label>
                <Value>{gameData.betAmt} INR</Value>
              </Row>
              <Row>
                <Label>ODDS</Label>
                <Value>x{gameData.multiplier}</Value>
              </Row>
              <Row>
                <Label>WIN</Label>
                <Value highlight={gameData.winningAmt <= 0}>
                  {gameData.winningAmt > 0 ? `${gameData.winningAmt} INR` : "0 INR"}
                </Value>
              </Row>
            </HistoryItem>
          ))}
      </HistoryList>
    </HistoryContainer>
  );
};

export default UseGameHistory;