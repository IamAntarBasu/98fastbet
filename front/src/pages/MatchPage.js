import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useBetting } from '../context/BettingContext';
import LoadingSpinner from '../components/LoadingSpinner';
import MarketOdds from '../components/MarketOdds';

const MatchPageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const MatchHeader = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const MatchTitle = styled.h1`
  font-size: 24px;
  margin: 0 0 10px;
  color: #333;
`;

const MatchInfo = styled.div`
  display: flex;
  align-items: center;
  color: #666;
  font-size: 14px;
  
  span {
    margin-right: 15px;
    display: flex;
    align-items: center;
  }
`;

const LiveBadge = styled.span`
  background-color: #c62828;
  color: white;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  margin-right: 10px;
`;

const MarketsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  
  @media (min-width: 768px) {
    grid-template-columns: 2fr 1fr;
  }
`;

const MainMarkets = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SideMarkets = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ErrorMessage = styled.div`
  background-color: #ffebee;
  color: #c62828;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const MatchPage = () => {
  const { matchId } = useParams();
  const { currentMatch, loading, error, fetchMatchDetails, clearCurrentMatch } = useBetting();
  
  useEffect(() => {
    // Fetch match details when component mounts
    fetchMatchDetails(matchId);
    
    // Clean up when component unmounts
    return () => {
      clearCurrentMatch();
    };
  }, [matchId]);
  
  if (loading) {
    return <LoadingSpinner text="Loading match details..." />;
  }
  
  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }
  
  if (!currentMatch || !currentMatch.match) {
    return <ErrorMessage>Match not found or no data available.</ErrorMessage>;
  }
  
  const { match, markets, fancyMarkets, bookmakers } = currentMatch;
  
  // Find main market (usually Match Odds)
  const mainMarket = markets.find(m => 
    m.marketName === 'Match Odds' || 
    m.marketName === '1X2' || 
    m.marketName?.includes('Winner')
  );
  
  // Other markets
  const otherMarkets = markets.filter(m => m !== mainMarket);
  
  return (
    <MatchPageContainer>
      <MatchHeader>
        <MatchTitle>{match.name}</MatchTitle>
        <MatchInfo>
          {match.inplay && <LiveBadge>LIVE</LiveBadge>}
          <span>{match.league_name || match.competition}</span>
          <span>{new Date(match.event_date).toLocaleString()}</span>
        </MatchInfo>
      </MatchHeader>
      
      <MarketsContainer>
        <MainMarkets>
          {mainMarket && (
            <MarketOdds 
              market={mainMarket}
              type="main"
            />
          )}
          
          {otherMarkets.map(market => (
            <MarketOdds 
              key={market.marketId}
              market={market}
              type="main"
            />
          ))}
        </MainMarkets>
        
        <SideMarkets>
          {fancyMarkets && fancyMarkets.length > 0 && (
            <>
              {fancyMarkets.map(market => (
                <MarketOdds 
                  key={market.marketId}
                  market={market}
                  type="fancy"
                />
              ))}
            </>
          )}
          
          {bookmakers && bookmakers.length > 0 && (
            <>
              {bookmakers.map(market => (
                <MarketOdds 
                  key={market.marketId}
                  market={market}
                  type="bookmaker"
                />
              ))}
            </>
          )}
        </SideMarkets>
      </MarketsContainer>
    </MatchPageContainer>
  );
};

export default MatchPage; 