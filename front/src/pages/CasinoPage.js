import React from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import CasinoGames from '../components/CasinoGames';
import Navbar from '../AllGamesNavbar/AllNavbar';

const CasinoContainer = styled.div`
  margin-top: -20px;
  margin-left: -20px;
`;

const CasinoPageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  margin-top: 0rem;
  padding: 0 20px;
  padding-top: 6rem;
`;

const CasinoHeader = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const CasinoTitle = styled.h1`
  font-size: 24px;
  margin: 0 0 10px;
  color: #333;
`;

const CasinoTabs = styled.div`
  display: flex;
  margin-top: 20px;
  border-bottom: 1px solid #eee;
  overflow-x: auto;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 4px;
  }
`;

const CasinoTab = styled.div`
  padding: 10px 20px;
  cursor: pointer;
  color: ${props => props.active ? '#c62828' : '#666'};
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  border-bottom: 2px solid ${props => props.active ? '#c62828' : 'transparent'};
  
  &:hover {
    color: #c62828;
  }
`;

const GameContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  text-align: center;
  
  h2 {
    margin-bottom: 20px;
  }
  
  img {
    max-width: 100%;
    border-radius: 8px;
    margin-bottom: 20px;
  }
  
  p {
    color: #666;
    line-height: 1.6;
  }
`;

const PlayButton = styled.button`
  background-color: #c62828;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 30px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 20px;
  
  &:hover {
    background-color: #b71c1c;
  }
`;

const CasinoPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const tabs = [
    { id: 'all', name: 'All Games', path: '/casino' },
    { id: 'slots', name: 'Slots', path: '/casino/slots' },
    { id: 'live', name: 'Live Casino', path: '/casino/live' },
    { id: 'aviator', name: 'Aviator', path: '/casino/aviator' },
    { id: 'mines', name: 'Mines', path: '/casino/mines' },
    { id: 'color-prediction', name: 'Color Prediction', path: '/casino/color-prediction' }
  ];
  
  const currentPath = location.pathname;
  
  // Render content based on current path
  const renderContent = () => {
    if (currentPath === '/casino' || currentPath === '/casino/slots' || currentPath === '/casino/live') {
      return <CasinoGames />;
    } else if (currentPath === '/casino/aviator') {
      return (
        <GameContainer>
          <h2>Aviator Game</h2>
          <img src="/images/games/aviator.gif" alt="Aviator Game" />
          <p>
            Aviator is an exciting multiplayer game where you bet on a plane that flies away, 
            with a multiplier that increases as the plane climbs. Cash out before the plane 
            flies away to secure your winnings!
          </p>
          <PlayButton>PLAY NOW</PlayButton>
        </GameContainer>
      );
    } else if (currentPath === '/casino/mines') {
      return (
        <GameContainer>
          <h2>Mines Game</h2>
          <img src="/images/games/mines.gif" alt="Mines Game" />
          <p>
            Mines is a thrilling game where you uncover tiles on a grid, trying to avoid hidden mines. 
            The fewer mines you set, the lower your potential payout. But beware - one wrong move and 
            you lose everything!
          </p>
          <PlayButton>PLAY NOW</PlayButton>
        </GameContainer>
      );
    } else if (currentPath === '/casino/color-prediction') {
      return (
        <GameContainer>
          <h2>Color Prediction</h2>
          <img src="/images/games/color-prediction.gif" alt="Color Prediction Game" />
          <p>
            Color Prediction is a fast-paced game where you bet on which color will appear next. 
            Choose from red, green, or blue and win up to 3x your stake if you predict correctly!
          </p>
          <PlayButton>PLAY NOW</PlayButton>
        </GameContainer>
      );
    } else {
      return <CasinoGames />;
    }
  };
  
  return (
    <CasinoContainer>
      <Navbar />
      <CasinoPageContainer>
        <CasinoHeader>
          <CasinoTitle>Casino Games</CasinoTitle>
          
          <CasinoTabs>
            {tabs.map(tab => (
              <CasinoTab 
                key={tab.id}
                active={currentPath === tab.path}
                onClick={() => navigate(tab.path)}
              >
                {tab.name}
              </CasinoTab>
            ))}
          </CasinoTabs>
        </CasinoHeader>
        
        {renderContent()}
      </CasinoPageContainer>
    </CasinoContainer>
  );
};

export default CasinoPage; 