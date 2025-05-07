import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaHome, FaFootballBall, FaBasketballBall, FaVolleyballBall } from 'react-icons/fa';
import { GiCricketBat, GiTennisRacket, GiBoxingGlove, GiPokerHand } from 'react-icons/gi';
import { MdCasino, MdSportsEsports } from 'react-icons/md';
import { SiElectron } from 'react-icons/si';
import axios from "axios";
const NavbarContainer = styled.div`
  background-color: #2d3748;
  padding: 5px 10px;
  overflow-x: auto;
  white-space: nowrap;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  
  &::-webkit-scrollbar {
    height: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: #4a5568;
    border-radius: 3px;
  }
  
  @media (max-width: 768px) {
    padding: 5px;
  }
`;

const NavItems = styled.div`
  display: flex;
  align-items: center;
`;

const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  color: white;
  text-decoration: none;
  padding: 6px 12px;
  margin-right: 5px;
  font-size: 12px;
  text-transform: uppercase;
  border-radius: 4px;
  transition: all 0.2s;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  &.active {
    background-color: rgba(255, 255, 255, 0.2);
  }
  
  @media (max-width: 576px) {
    padding: 5px 10px;
    font-size: 11px;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 6px;
  color: ${props => props.color || 'white'};
  font-size: 14px;
  
  @media (max-width: 576px) {
    margin-right: 4px;
    font-size: 12px;
  }
`;

const SportNavbar = () => {
  const sports = [
    { id: 'home', name: 'HOME', icon: <FaHome />, color: '#3498db', path: '/' },
    { id: 'cricket', name: 'CRICKET', icon: <GiCricketBat />, color: '#2ecc71', path: '/sport/cricket' },
    { id: 'football', name: 'FOOTBALL', icon: <FaFootballBall />, color: '#e74c3c', path: '/sport/football' },
    { id: 'tennis', name: 'TENNIS', icon: <GiTennisRacket />, color: '#f1c40f', path: '/sport/tennis' },
    { id: 'casino', name: 'CASINO', icon: <MdCasino />, color: '#9b59b6', path: '/casino' },
    { id: 'boxing', name: 'BOXING', icon: <GiBoxingGlove />, color: '#e67e22', path: '/sport/boxing' },
    { id: 'winner-cup', name: 'WINNER CUP', icon: <FaFootballBall />, color: '#f39c12', path: '/winner-cup' },
    { id: 'election', name: 'ELECTION', icon: <GiPokerHand />, color: '#c0392b', path: '/election' },
    { id: 'kabaddi', name: 'KABADDI', icon: <FaVolleyballBall />, color: '#d35400', path: '/sport/kabaddi' },
    { id: 'esports', name: 'ESPORTS', icon: <MdSportsEsports />, color: '#2980b9', path: '/sport/esports' },
    { id: 'basketball', name: 'BASKETBALL', icon: <FaBasketballBall />, color: '#e67e22', path: '/sport/basketball' }
  ];
  
  return (
    <NavbarContainer>
      <NavItems>
        {sports.map(sport => (
          <NavItem key={sport.id} to={sport.path}>
            <IconWrapper color={sport.color}>
              {sport.icon}
            </IconWrapper>
            {sport.name}
          </NavItem>
        ))}
      </NavItems>
    </NavbarContainer>
  );
};

export default SportNavbar; 