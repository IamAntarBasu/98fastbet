import React from "react";
import styled from "styled-components";
import { useProfile } from '../context/ProfileContext';
import { useLocation, useNavigate } from "react-router-dom";

const NavbarContainer = styled.nav`
  margin-top: 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(45deg, #1a1a1a, #2d2d2d, #4a4a4a);
  padding: 14px 0px;
  position: fixed;
  overflow-y: auto;
  z-index: 1000;
  width: 100%;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: 21px;
`;

const LogoText = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  background: linear-gradient(45deg, #ffeb3b, #ffc107); // Yellow gradient
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const WalletIcon = styled.div`
  font-size: 1.5rem;
  margin-right: 21px;
  cursor: pointer;
  transition: transform 0.3s, color 0.3s;

  &:hover {
    transform: scale(1.1);
    color: #f39c12;
  }
`;

const BalanceContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 21px;
`;

const BalanceText = styled.div`
  font-size: 1rem;
  font-weight: 500;
  background: linear-gradient(45deg,rgb(187, 234, 46),rgb(255, 134, 59));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  padding-right: 10px;
`;

const ExposureText = styled.div`
  font-size: 0.8rem;
  color: ${props => props.amount > 0 ? '#f44b4b' : '#f44b4b'};
  margin-top: 2px;
  font-weight: ${props => props.amount > 0 ? '500' : '400'};
`;

export default function Navbar() {
  const { profile } = useProfile();
  const location = useLocation();
  const navigate = useNavigate();
   
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/"); 
  };

  return (
    <NavbarContainer>
      <LogoContainer>
        <LogoText>98FASTBET</LogoText>
      </LogoContainer>
      
      <BalanceContainer>
        <BalanceText>
          Balance: ₹{profile.walletBalance}
        </BalanceText>
        <ExposureText amount={profile.exposureBalance}>
          Exposure: ₹{profile.exposureBalance ? profile.exposureBalance.toFixed(2) : '0.00'}
        </ExposureText>
      </BalanceContainer>

      {/* <WalletIcon onClick={handleLogout}>
        
      </WalletIcon> */}
    </NavbarContainer>
  );
}