import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

// Define the paths to the images in the public folder
const sportsItems = {
  Cricket: '/events/menu-4.png',
  Tennis: '/events/menu-2.png',
  Football: '/events/menu-1.png',
  VolleyBall: '/events/menu-998917.png',
  BasketBall: '/events/menu-7522.png',
};

const Sidebar = ({ activeSport, onSportSelect, sportsData = {} }) => {
  const [openSections, setOpenSections] = useState({});
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [activeSport]);

  // NEW: Listen for toggleMobileSidebar event from Header
  useEffect(() => {
    const toggleSidebar = () => setIsMobileSidebarOpen(prev => !prev);
    window.addEventListener('toggleMobileSidebar', toggleSidebar);
    return () => window.removeEventListener('toggleMobileSidebar', toggleSidebar);
  }, []);

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSportClick = (sportId, sportName) => {
    if (onSportSelect) {
      onSportSelect(sportId, sportName);
    }
    navigate(`/sport/${sportId}`);
  };

  const sports = [
    { id: '4', name: 'Cricket' },
    { id: '1', name: 'Football' },
    { id: '2', name: 'Tennis' },
    { id: '7522', name: 'BasketBall' },
    { id: '998917', name: 'VolleyBall' },
  ];

  return (
    <>
      {/* Remove the mobile-toggle button below since functionality is moved to Header */}
      {/* <button 
        className="mobile-toggle" 
        onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      >
        {isMobileSidebarOpen ? (
          <i className="bi bi-x-lg"></i>
        ) : (
          <i className="bi bi-list"></i>
        )}
      </button> */}

      <div 
        className={`overlay ${isMobileSidebarOpen ? 'show' : ''}`} 
        onClick={() => setIsMobileSidebarOpen(false)} 
      />

      <aside className={`sidebar ${isMobileSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
        <h2 >98FASTBET</h2>
        </div>

        <div className="sidebar-section">
          <div 
            className="section-title" 
            onClick={() => toggleSection('sports')}
          >
            Sports
            <span>
              {openSections['sports'] ? (
                <i className="bi bi-chevron-up"></i>
              ) : (
                <i className="bi bi-chevron-down"></i>
              )}
            </span>
          </div>

          <div className={`section-content ${openSections['sports'] ? 'show' : ''}`}>
            {sports.map(sport => (
              <div key={sport.id}>
                <div
                  className={`sport-item ${activeSport === sport.id ? 'active' : ''}`}
                  onClick={() => handleSportClick(sport.id, sport.name)}
                >
                  <div className="sport-icon">
                    <img
                      src={sportsItems[sport.name]}
                      alt={sport.name}
                      onError={(e) => {
                        console.error(`Failed to load image for ${sport.name}`);
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                  {sport.name}
                </div>

                {sportsData[sport.name] && (
                  <div className={`sub-section-content ${activeSport === sport.id ? 'show' : ''}`}>
                    {Object.keys(sportsData[sport.name]).map(tournament => (
                      <div key={tournament} className="sub-section">
                        <div
                          className="sub-section-title"
                          onClick={() => toggleSection(`${sport.id}-${tournament}`)}
                        >
                          {tournament}
                          <span>
                            {openSections[`${sport.id}-${tournament}`] ? (
                              <i className="bi bi-chevron-up"></i>
                            ) : (
                              <i className="bi bi-chevron-down"></i>
                            )}
                          </span>
                        </div>
                        <div className={`matches-content ${openSections[`${sport.id}-${tournament}`] ? 'show' : ''}`}>
                          {sportsData[sport.name][tournament].matches.map((match, index) => (
                            <div key={index} className="match-item">
                              {match}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="sidebar-section">
          <div 
            className="section-title" 
            onClick={() => toggleSection('casino')}
          >
            Casino
            <span>
              {openSections['casino'] ? (
                <i className="bi bi-chevron-up"></i>
              ) : (
                <i className="bi bi-chevron-down"></i>
              )}
            </span>
          </div>

          <div className={`section-content ${openSections['casino'] ? 'show' : ''}`}>
            <div className="nav-item" onClick={() => navigate('/casino/slots')}>
              Slots
            </div>
            <div className="nav-item" onClick={() => navigate('/casino/live-casino')}>
              Live Casino
            </div>
            <div className="nav-item" onClick={() => navigate('/casino/table-games')}>
              Table Games
            </div>
            <div className="nav-item" onClick={() => navigate('/casino/jackpots')}>
              Jackpots
            </div>
          </div>
        </div>

        <div className="sidebar-section">
          <div 
            className="section-title" 
            onClick={() => toggleSection('my-account')}
          >
            My Account
            <span>
              {openSections['my-account'] ? (
                <i className="bi bi-chevron-up"></i>
              ) : (
                <i className="bi bi-chevron-down"></i>
              )}
            </span>
          </div>

          <div className={`section-content ${openSections['my-account'] ? 'show' : ''}`}>
            <div className="nav-item" onClick={() => navigate('/account/profile')}>
              Profile
            </div>
            <div className="nav-item" onClick={() => navigate('/account/bets')}>
              My Bets
            </div>
            <div className="nav-item" onClick={() => navigate('/account/transactions')}>
              Transactions
            </div>
            <div className="nav-item" onClick={() => navigate('/account/settings')}>
              Settings
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;