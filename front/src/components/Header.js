import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaBars, FaTimes, FaWallet, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import WithdrawalForm from './WithdrawalForm';
import VirtualAccountDetails from './AddPointForm';
import './Header.css';
import { useProfile } from '../context/ProfileContext';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const [showDepositForm, setShowDepositForm] = useState(false);
  const isLoggedIn = true;
  const navigate = useNavigate();
  const { profile } = useProfile();

  const handleWithdraw = () => {
    setShowWallet(true);
  };

  const handleDeposit = () => {
    setShowDepositForm(true);
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    window.dispatchEvent(new Event('toggleMobileSidebar'));
  };

  const closeModal = () => {
    setShowWallet(false);
    setShowDepositForm(false);
  };

  return (
    <>
      <header className="header">
        <div className="header-container">
          <div className="logo-buttons-container">
            <div className="logo">
              <h2 className="logo-image">98FASTBET</h2>
            </div>

            {/* Withdraw and Deposit buttons for all views */}
            {isLoggedIn && (
              <div className="action-buttons">
                <button className="withdraw-btn" onClick={handleWithdraw}>
                  <FaArrowUp className="auth-icon" />
                  <span>Withdraw</span>
                </button>
                <button className="deposit-btn" onClick={handleDeposit}>
                  <FaArrowDown className="auth-icon" />
                  <span>Deposit</span>
                </button>
              </div>
            )}
          </div>

          <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>

          <nav className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
            {!isMobileMenuOpen && <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="nav-link">Sports</Link>}
            {!isMobileMenuOpen && <Link to="/casino" onClick={() => setIsMobileMenuOpen(false)} className="nav-link">Casino</Link>}
            
            {/* Desktop auth container with Profile, Wallet, and Logout */}
            {isLoggedIn && (
              <div className="desktop-auth-container">
                <div className="profile-component">
                  <FaUser className="auth-icon" />
                  <span>{profile.username}</span>
                </div>
          
                <div className="wallet-component">
                  <FaWallet className="auth-icon" />
                  <span>₹{profile.walletBalance}</span>
                </div>
              
                <button className="login-btn" onClick={handleLogout}>
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            )}

            {!isLoggedIn && (
              <div className="auth-buttons">
                <Link 
                  to="/login" 
                  className="login-btn" 
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaUser /> Login
                </Link>
                <Link 
                  to="/signup" 
                  className="signup-btn" 
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Withdrawal Form Modal */}
      {showWallet && (
        <div className="modal">
          <div className="modal-content">
            <WithdrawalForm onClose={closeModal} />
          </div>
        </div>
      )}

      {/* Deposit Form Modal */}
      {showDepositForm && (
        <div className="modal">
          <div className="modal-content">
            <VirtualAccountDetails onClose={closeModal} />
          </div>
        </div>
      )}
    </>
  );
};

export default Header;