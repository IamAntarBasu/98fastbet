import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FaExpandAlt, FaCompressAlt, FaSpinner } from 'react-icons/fa';

const LiveScoreTVContainer = styled.div`
  width: 100%;
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  position: relative;
  transition: all 0.3s ease;
`;

const LiveScoreHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #1a2c38;
  color: white;
  cursor: pointer;
  
  &:hover {
    background-color: #263c4a;
  }
`;

const Title = styled.h3`
  margin: 0;
  font-size: 16px;
  display: flex;
  align-items: center;
  
  span {
    margin-left: 8px;
    font-size: 12px;
    background-color: #e74c3c;
    padding: 2px 6px;
    border-radius: 4px;
  }
`;

const ExpandButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  
  &:hover {
    opacity: 0.8;
  }
`;

const IframeContainer = styled.div`
  width: 100%;
  height: ${props => props.$expanded ? '500px' : '0px'};
  max-height: ${props => props.$expanded ? '80vh' : '0px'};
  overflow: hidden;
  transition: height 0.5s ease, max-height 0.5s ease;
  position: relative;
`;

const StyledIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
  display: ${props => props.$expanded ? 'block' : 'none'};
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 1;
  
  svg {
    animation: spin 1s linear infinite;
    font-size: 24px;
    color: #1a2c38;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  padding: 20px;
  text-align: center;
  color: #e74c3c;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const LiveScoreTV = ({ sportId, eventId, sportsradarId }) => {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const iframeRef = useRef(null);
  const intervalRef = useRef(null);

  // Create the iframe URL
  const iframeUrl = `https://scorecard.oddstrad.com/get-scorecard-iframe/${sportId}/${eventId}/${sportsradarId}`;

  // Handle iframe load events
  const handleIframeLoad = () => {
    setLoading(false);
  };

  const handleIframeError = () => {
    setLoading(false);
    setError('Unable to load live score data');
  };

  // Toggle expanded state
  const toggleExpand = () => {
    setExpanded(!expanded);
    
    // Reset loading state when expanding
    if (!expanded) {
      setLoading(true);
    }
  };
  
  // Clean up on unmount or when expanded state changes
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [expanded]);

  return (
    <LiveScoreTVContainer>
      <LiveScoreHeader onClick={toggleExpand}>
        <Title>
          Live Score {expanded && <span>LIVE</span>}
        </Title>
        <ExpandButton>
          {expanded ? <FaCompressAlt /> : <FaExpandAlt />}
        </ExpandButton>
      </LiveScoreHeader>
      
      <IframeContainer $expanded={expanded}>
        {loading && expanded && (
          <LoadingOverlay>
            <FaSpinner />
          </LoadingOverlay>
        )}
        
        {error ? (
          <ErrorMessage>{error}</ErrorMessage>
        ) : (
          <StyledIframe 
            ref={iframeRef}
            src={expanded ? iframeUrl : ''}
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            title="Live Score"
            sandbox="allow-scripts allow-popups"
            $expanded={expanded}
          />
        )}
      </IframeContainer>
    </LiveScoreTVContainer>
  );
};

export default LiveScoreTV; 