import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaMobileAlt, FaExclamationTriangle } from 'react-icons/fa';

// Animation for fade-in effect
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Animation for shaking (for warning icon)
const shake = keyframes`
  0%, 100% { transform: rotate(0); }
  25% { transform: rotate(-5deg); }
  75% { transform: rotate(5deg); }
`;

// Styled components for a modern look
const MobileWarning = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const WarningCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2.5rem;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: ${fadeIn} 0.6s ease-out;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const WarningIcon = styled(FaExclamationTriangle)`
  color: #ffcc00;
  animation: ${shake} 1.5s infinite;
`;

const Message = styled.p`
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const MobileIcon = styled(FaMobileAlt)`
  font-size: 3rem;
  margin: 1.5rem 0;
  color: rgba(255, 255, 255, 0.7);
`;

const ActionText = styled.p`
  font-size: 0.9rem;
  opacity: 0.8;
  margin-top: 1.5rem;
`;

const MobileOnlyWrapper = ({ children }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isMobile) {
    return (
      <MobileWarning>
        <WarningCard>
          <Title>
            <WarningIcon /> Mobile Only
          </Title>
          <Message>
            This application is designed exclusively for mobile devices.
            <br />
            Please switch to a smartphone for the best experience.
          </Message>
          <MobileIcon />
          <ActionText>
            {/* Scan the QR code or open this link on your phone. */}
            Open this link on your phone.
          </ActionText>
        </WarningCard>
      </MobileWarning>
    );
  }

  return children;
};

export default MobileOnlyWrapper;
