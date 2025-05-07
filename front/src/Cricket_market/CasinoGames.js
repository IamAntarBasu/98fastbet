import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaPlay } from 'react-icons/fa';

const GamesContainer = styled.div`
  margin: 20px 0;
`;

const GamesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
`;

const GameCard = styled(Link)`
  display: block;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
  
  img {
    width: 100%;
    height: auto;
    display: block;
    aspect-ratio: 16/9;
    object-fit: cover;
  }
`;

const GameOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  padding: 15px;
  color: white;
  font-weight: bold;
`;

const PlayButton = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.9);
  background-color: rgba(255, 255, 255, 0.2);
  border: 2px solid white;
  color: white;
  padding: 8px 20px;
  border-radius: 20px;
  font-weight: bold;
  opacity: 0;
  transition: opacity 0.3s, transform 0.3s;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 5px;
  }
  
  ${GameCard}:hover & {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
`;

const SliderControls = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const SliderDot = styled.button`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.$active ? '#c62828' : '#ddd'};
  margin: 0 5px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: ${props => props.$active ? '#c62828' : '#bbb'};
  }
`;

const SliderArrow = styled.button`
  background-color: #f0f0f0;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin: 0 10px;
  
  &:hover {
    background-color: #e0e0e0;
  }
`;

const CasinoGames = () => {
  const games = [
    { id: 1, name: 'Aviator', image: '/images/games/aviator.gif', path: '/casino/aviator' },
    { id: 2, name: 'Fun Games', image: '/images/games/fungames.gif', path: '/casino/fun-games' },
    { id: 3, name: 'Andar Bahar', image: '/images/games/more_slots_andar_bahar.webp', path: '/casino/andar-bahar' },
    { id: 4, name: 'Twist', image: '/images/games/more_slots_twist.webp', path: '/casino/twist' },
    { id: 5, name: 'Jetx', image: '/images/games/more_slots_jetx.webp', path: '/casino/jetx' },
    { id: 6, name: 'Pushpa Rani', image: '/images/games/more_slots_pushpa_rani.webp', path: '/casino/pushpa-rani' },
    { id: 7, name: 'Mines', image: '/images/games/mines.gif', path: '/casino/mines' },
    { id: 8, name: 'Color Prediction', image: '/images/games/color-prediction.gif', path: '/casino/color-prediction' }
  ];
  
  return (
    <GamesContainer>
      <GamesGrid>
        {games.map(game => (
          <GameCard key={game.id} to={game.path}>
            <img src={game.image} alt={game.name} />
            <GameOverlay>{game.name}</GameOverlay>
            <PlayButton><FaPlay /> PLAY</PlayButton>
          </GameCard>
        ))}
      </GamesGrid>
      
      <SliderControls>
        <SliderArrow>←</SliderArrow>
        <SliderDot $active />
        <SliderDot />
        <SliderDot />
        <SliderArrow>→</SliderArrow>
      </SliderControls>
    </GamesContainer>
  );
};

export default CasinoGames; 