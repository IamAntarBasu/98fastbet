import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FaPlay, FaLock, FaCrown } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../AllGamesNavbar/AllNavbar";
import { motion } from "framer-motion";

// Premium styled components
const Container = styled.div`
  // background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  // min-height: 100vh;
  padding: 0rem;
  box-sizing: border-box;
`;

const Wrapper = styled.div`
  max-width: 1400px;
  margin: 6rem auto 2rem;
  padding: 0rem;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  // box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const Title = styled.h1`
  color: #fff;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2.5rem;
  font-weight: 700;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
  // padding: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const GameCard = styled(motion.div)`
  background: linear-gradient(145deg, #2a2a3a 0%, #1e1e2a 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-height: 240px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #ff4d4d 0%, #f9cb28 100%);
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
  }
`;

const PremiumBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background: linear-gradient(135deg, #f9cb28 0%, #ff9500 100%);
  color: #000;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const GameHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
`;

const PlayButton = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  text-align: center;
  margin: 0.5rem 0;

  svg {
    font-size: 1.2rem;
    background: ${props => props.disabled ? '#444' : 'linear-gradient(135deg, #ff4d4d 0%, #f9cb28 100%)'};
    padding: 1rem;
    border-radius: 50%;
    color: ${props => props.disabled ? '#777' : '#fff'};
    width: 50px;
    height: 50px;
    margin-bottom: 0.5rem;
    box-shadow: 0 4px 10px ${props => props.disabled ? 'rgba(0,0,0,0.1)' : 'rgba(255, 77, 77, 0.3)'};
    transition: all 0.3s ease;
  }

  p {
    font-size: 1rem;
    font-weight: 600;
    margin-top: 0.25rem;
    color: ${props => props.disabled ? '#777' : '#fff'};
  }
`;

const GameDetails = styled.div`
  text-align: center;
  margin: 1rem 0;

  h4 {
    color: #f9cb28;
    font-size: 1.2rem;
    font-weight: 700;
    margin: 0.5rem 0;
    letter-spacing: 1px;
  }

  h3 {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0.25rem 0;
  }
`;

const TimeInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #aaa;

  p {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
  background: ${props => props.status === "Close" ? 
    'linear-gradient(135deg, #ff4444 0%, #cc0000 100%)' : 
    'linear-gradient(135deg, #00C851 0%, #007e33 100%)'};
  color: white;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  border-top-color: #f9cb28;
  animation: spin 1s ease-in-out infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  background: rgba(255, 77, 77, 0.1);
  border-radius: 10px;
  border-left: 4px solid #ff4444;
  color: #ff4444;
  font-weight: 600;
`;

const PlayGames = () => {
  const [gamesData, setGamesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchGameData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/admin/getMatkas`);
      setGamesData(response.data);
      setError("");
    } catch (err) {
      setError("Failed to load games. Please try again later.");
      console.error("Error fetching game data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGameData();
    const intervalId = setInterval(fetchGameData, 60000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Container>
      {/* <Navbar /> */}
      <Wrapper>
        {/* <Title>Premium Games Lounge</Title> */}
        
        {loading ? (
          <LoadingContainer>
            <LoadingSpinner />
          </LoadingContainer>
        ) : error ? (
          <ErrorMessage>
            {error}
          </ErrorMessage>
        ) : (
          <GridContainer>
            {gamesData.map((game, index) => (
              <GameCard 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {/* {index % 3 === 0 && ( // Example condition for premium badge
                  <PremiumBadge>
                    <FaCrown size={12} /> PREMIUM
                  </PremiumBadge>
                )} */}
                
                <GameHeader>
                  <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>{game.marketName}</h3>
                  <Link
                    to={game.closeStatus === "Close" ? "#" : `/casino/play/${game.marketName}/${game.closeStatus}`}
                    style={{ textDecoration: "none" }}
                    onClick={game.closeStatus === "Close" ? (e) => e.preventDefault() : undefined}
                  >
                    <PlayButton disabled={game.closeStatus === "Close"}>
                      {game.closeStatus === "Close" ? <FaLock /> : <FaPlay />}
                      <p>{game.closeStatus === "Close" ? "CLOSED" : "PLAY NOW"}</p>
                    </PlayButton>
                  </Link>
                </GameHeader>
                <GameDetails>
                  <h4>{game.openNumber}-{game.jodiDigit}-{game.closeNumber}</h4>
                  <StatusBadge status={game.closeStatus}>
                    {game.closeStatus === "Close" ? "CLOSED" : game.closeStatus.toUpperCase()}
                  </StatusBadge>
                </GameDetails>

                <TimeInfo>
                  <p>⏱️ {game.openTime}</p>
                  <p>⏳ {game.closeTime}</p>
                </TimeInfo>
              </GameCard>
            ))}
          </GridContainer>
        )}
      </Wrapper>
    </Container>
  );
};

export default PlayGames;
