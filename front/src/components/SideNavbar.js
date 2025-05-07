import React, { useState ,useEffect} from 'react';
import { HomeIcon, PlayIcon } from '@heroicons/react/24/solid';
import './SideNavbar.css';
import { FaPlay } from 'react-icons/fa';
import styled from 'styled-components';
import axios from "axios";
const SideNavbar = ({ activeSport, onSportSelect }) => {
  const [activeNav, setActiveNav] = useState('HOME');

  const sports = [
    { icon: <HomeIcon className="nav-icon" />, text: 'HOME' },
    { icon: <PlayIcon className="nav-icon" />, text: 'IN-PLAY' },
    { image: '/events/menu-4.png', text: 'CRICKET', id: '4' },
    { image: '/events/menu-2.png', text: 'TENNIS', id: '2' },
    { image: '/events/menu-1.png', text: 'FOOTBALL', id: '1' },
    { image: '/events/menu-2378961.png', text: 'POLITICS' },
    { image: '/events/menu-7.png', text: 'HORSE RACING' },
    { image: '/events/menu-4339.png', text: 'GREYHOUND RACING' },
    { image: '/events/menu-99994.png', text: 'KABADDI' },
    { image: '/events/menu-99999.png', text: 'CASINO' },
    { image: '/events/menu-99991.png', text: 'SPORTS BOOK' },
    { image: '/events/menu-99998.png', text: 'INT CASINO' },
    { image: '/events/menu-99990.png', text: 'BINARY' },
    { image: '/events/menu-26420387.png', text: 'MIXED MARTIAL ARTS' },
    { image: '/events/menu-998917.png', text: 'VOLLEYBALL', id: '998917' },
    { image: '/events/menu-7524.png', text: 'ICE HOCKEY' },
    { image: '/events/menu-7522.png', text: 'BASKETBALL', id: '7522' },
    { image: '/events/menu-7511.png', text: 'BASEBALL', id: '7511' },
    { image: '/events/menu-3503.png', text: 'DARTS' },
    { image: '/events/menu-29.png', text: 'FUTSAL' },
  ];

  const handleNavClick = (text, id) => {
    setActiveNav(text);
    if (id && onSportSelect) {
      onSportSelect(id, text);
    }
  };


  
    const [news, setNews] = useState([{content:"Get Ready for Action - Welcome to 98FastBet!"}]);
  
    useEffect(() => {
      axios.get(`${process.env.REACT_APP_BASE_URL}/api/platform/news`)
        .then((response) => {
          if(response.data.length > 0){
            setNews(response.data)
          }
        })
        .catch((error) => console.error("Error fetching news:", error));
    }, []);

  return (
    <>
    <nav className="side-navbar">
      <div className="navbar-container">
        <div className="nav-items">
          {sports.map((item, index) => (
            <div
              key={index}
              className={`nav-item ${activeNav === item.text ? 'active' : ''} ${
                item.id && activeSport === item.id ? 'sport-active' : ''
              }`}
              onClick={() => handleNavClick(item.text, item.id)}
            >
              <div className="icon-wrapper">
                {item.icon || (
                  <img
                    src={item.image}
                    alt={item.text}
                    className="nav-icon"
                    onError={(e) => {
                      console.error(`Failed to load image for ${item.text}`);
                      e.target.style.display = 'none';
                    }}
                  />
                )}
              </div>
              <span className="nav-text">{item.text}</span>
            </div>
          ))}
        </div>
        <button className="menu-toggle-mobile">
          <i className="bi bi-list"></i>
        </button>
      </div>
    </nav>
       <ScrollingTextContainer>
              <ScrollingText>
                <h3>{news[0].content}</h3>
              </ScrollingText>
      </ScrollingTextContainer>
    </>
  );
};

const ScrollingTextContainer = styled.div`
  display: flex;
  align-items: center;
  overflow: hidden;
  white-space: nowrap;
  flex: 1;
  margin-right: 0px;
  margin-top:25px;
  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const ScrollingText = styled.div`
  display: inline-block;
  animation: scrollText 13s linear infinite;
  color: #ff8600;
  font-weight: 500;
  
  @keyframes scrollText {
    0% { transform: translateX(250%); }
    100% { transform: translateX(-100%); }
  }
  
  h3 {
    margin: 0;
    font-size: 16px;
    display: flex;
    align-items: center;
    
    svg {
      margin-right: 8px;
      animation: pulse 1.5s infinite;
      font-size: 22px;
    }
    
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.2); }
      100% { transform: scale(1); }
    }
    
    @media (max-width: 768px) {
      font-size: 14px;
      
      svg {
        margin-right: 6px;
        font-size: 20px;
      }

       @keyframes scrollText {
        0% { transform: translateX(100%); }
        100% { transform: translateX(-100%); }
      }
    }
  }
`;

export default SideNavbar;
