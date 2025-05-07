import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaClock } from 'react-icons/fa';
import { useBetting } from '../context/BettingContext';

const Card = styled(Link)`
  display: block;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 15px;
  margin-bottom: 15px;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const MatchHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const MatchTitle = styled.h3`
  font-size: 16px;
  color: #333;
  margin: 0;
`;

const LeagueName = styled.span`
  font-size: 12px;
  color: #666;
  background-color: #f0f2f5;
  padding: 3px 8px;
  border-radius: 12px;
`;

const MatchTime = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #666;
  margin-bottom: 15px;
  
  svg {
    margin-right: 5px;
  }
`;

const OddsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

const OddsButton = styled.div`
  flex: 1;
  text-align: center;
  background-color: #f0f2f5;
  padding: 8px;
  border-radius: 4px;
  margin: 0 5px;
  font-weight: bold;
  color: #333;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #e0e0e0;
  }
  
  &:first-child {
    margin-left: 0;
  }
  
  &:last-child {
    margin-right: 0;
  }
`;

const InplayBadge = styled.span`
  background-color: #e53935;
  color: white;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 10px;
`;

const MatchCard = ({ match }) => {
  const { formatOdds } = useBetting();
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get runner odds if available
  const getRunnerOdds = () => {
    if (match.runners && match.runners.length > 0) {
      return match.runners.map(runner => {
        // Find the best back odds
        const bestOdds = runner.ex?.b?.[0]?.p || '-';
        return {
          name: match.runnerNames?.find(r => r.SID === runner.sid)?.RN || 'Unknown',
          odds: bestOdds
        };
      });
    }
    
    // Default odds if not available
    return [
      { name: 'Team 1', odds: '-' },
      { name: 'Team 2', odds: '-' }
    ];
  };
  
  const odds = getRunnerOdds();
  
  return (
    <Card to={`/match/${match.event_id}`}>
      <MatchHeader>
        <MatchTitle>
          {match.event_name}
          {match.inplay && <InplayBadge>LIVE</InplayBadge>}
        </MatchTitle>
        <LeagueName>{match.league_name}</LeagueName>
      </MatchHeader>
      
      <MatchTime>
        <FaClock />
        {formatDate(match.event_date)}
      </MatchTime>
      
      <OddsContainer>
        {odds.map((runner, index) => (
          <OddsButton key={index}>
            <div>{runner.name}</div>
            <div>{runner.odds !== '-' ? formatOdds(runner.odds) : '-'}</div>
          </OddsButton>
        ))}
      </OddsContainer>
    </Card>
  );
};

export default MatchCard; 