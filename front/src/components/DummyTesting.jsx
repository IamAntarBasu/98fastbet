
//Match List

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const socket = io(`${process.env.REACT_APP_BASE_URL}`);

const DummyTesting = () => {
  const [leagues, setLeagues] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("updateMatches", (data) => {
      console.log("Received data:", data); // Debugging step
      if (Array.isArray(data)) {
        setLeagues(data);
      } else {
        console.error("Data is not an array:", data);
      }
    });

    return () => socket.off("updateMatches");
  }, []);

  const handleClick = (gameid,iframeUrl,match) => {
    navigate(`/match/currmtc`, {
      state: { id: gameid ,iframeUrl:iframeUrl ,match:match}
    });
    console.log(gameid)
  };   

  return (
    <>
    <Container>
      <Heading>Live Cricket Market</Heading>
      <MatchList>
        {Array.isArray(leagues) &&
          leagues.map((match, index) => (
            <MatchItem key={match.eventId || index} onClick={() => handleClick(match.marketId,match.scoreIframe,match.matchName)}>
              <span>{match.matchName || "Unknown Match"} {match.matchDate}</span>
              <LiveBadge>LIVE</LiveBadge>    
            </MatchItem>    
          ))}     
      </MatchList>
    </Container>     
    </>
  );
};

const Container = styled.div`
  background-color: #0b3c68;
  color: white;
  padding: 20px;
  text-align: center;
  min-height: 100vh;
`;

const Heading = styled.h2`
  margin-bottom: 20px;
  font-size: 24px;
`;

const MatchList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
`;

const MatchItem = styled.div`
  background: white;
  color: #0b3c68;
  width: 100%;
  max-width: 600px;
  padding: 15px;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  box-shadow: 2px 2px 10px rgba(255, 255, 255, 0.2);
`;

const LiveBadge = styled.span`
  background-color: green;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 14px;
  font-weight: bold;
  animation: colorBlink 3.5s infinite alternate;

  @keyframes colorBlink {
    from {
      background-color: green;
    }
    to {
      background-color: red;
    }
  }
`;

export default DummyTesting;

