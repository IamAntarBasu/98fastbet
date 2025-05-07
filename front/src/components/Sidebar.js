import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaSignOutAlt,  FaWallet, FaPhone  } from 'react-icons/fa';
import WithdrawalForm from './WithdrawalForm';
import VirtualAccountDetails from './AddPointForm';
import './Sidebar.css';
import { useProfile } from '../context/ProfileContext';

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
  const [showWallet, setShowWallet] = useState(false);
  const [showDepositForm, setShowDepositForm] = useState(false);
  const navigate = useNavigate();
  const { profile } = useProfile();
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [activeSport]);

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
    setIsMobileSidebarOpen(false);
  };

  const handleLogout = () => {
    navigate('/login');
    setIsMobileSidebarOpen(false);
  };

  const handleWithdraw = () => {
    setShowWallet(true);
    setIsMobileSidebarOpen(true);
  };

  const handleDeposit = () => {
    setShowDepositForm(true);
    setIsMobileSidebarOpen(true);
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
      <div 
        className={`overlay ${isMobileSidebarOpen ? 'show' : ''}`} 
        onClick={() => setIsMobileSidebarOpen(false)} 
      />

      <aside className={`sidebar ${isMobileSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <h2>98FASTBET</h2>
        </div>

        {/* Mobile-only actions section */}
        <div className="mobile-only-actions">
          <div className="sidebar-section">
            <div className="action-item user-wallet-info">
              <div className="profile-row">
                <div className="profile-component">
                  <FaPhone className="auth-icon" />
                  <span>{profile.username || 'User'}</span>
                </div>
                <div className="wallet-component">
                  <FaWallet className="auth-icon" />
                  <span>₹{profile.walletBalance || 0}</span>
                </div>
              </div>
              <div className="userid-component">
              <FaUser className="auth-icon" />
                <span>ID: {profile.userNo || 'N/A'}</span>
              </div>
            </div>
            <div className="action-item" onClick={handleLogout}>
              <FaSignOutAlt className="action-icon" />
              Logout
            </div>
          </div>
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
            <div className="nav-item" onClick={() => { navigate('/casino/slots'); setIsMobileSidebarOpen(false); }}>
              Slots
            </div>
            <div className="nav-item" onClick={() => { navigate('/casino/live-casino'); setIsMobileSidebarOpen(false); }}>
              Live Casino
            </div>
            <div className="nav-item" onClick={() => { navigate('/casino/table-games'); setIsMobileSidebarOpen(false); }}>
              Table Games
            </div>
            <div className="nav-item" onClick={() => { navigate('/casino/jackpots'); setIsMobileSidebarOpen(false); }}>
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
            <div className="nav-item" onClick={() => { navigate('/account/profile'); setIsMobileSidebarOpen(false); }}>
              Profile
            </div>
            <div className="nav-item" onClick={() => { navigate('/history'); setIsMobileSidebarOpen(false); }}>
              My Bets
            </div>
            <div className="nav-item" onClick={() => { navigate('/account/transactions'); setIsMobileSidebarOpen(false); }}>
              Transactions
            </div>
            <div className="nav-item" onClick={() => { navigate('/account/settings'); setIsMobileSidebarOpen(false); }}>
              Settings
            </div>
          </div>
        </div>

        {/* <div className="sidebar-section">
          <div className="nav-item" onClick={() => { navigate('/rules'); setIsMobileSidebarOpen(false); }}>
            Rules
          </div>
        </div> */}

        {/* Withdrawal Form Modal */}
        {showWallet && (
          <div className="modal">
            <div className="modal-content">
              <button className="close-btn" onClick={() => setShowWallet(false)}>×</button>
              <WithdrawalForm onClose={() => setShowWallet(false)} />
            </div>
          </div>
        )}

        {/* Deposit Form Modal */}
        {showDepositForm && (
          <div className="modal">
            <div className="modal-content">
              <button className="close-btn" onClick={() => setShowDepositForm(false)}>×</button>
              <VirtualAccountDetails onClose={() => setShowDepositForm(false)} />
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
