import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useBetting } from '../context/BettingContext';
import LoadingSpinner from '../components/LoadingSpinner';
import MatchCard from '../components/MatchCard';

const SportPageContainer = styled.div`
  padding: 20px 0;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  
  img {
    width: 32px;
    height: 32px;
    margin-right: 10px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  color: #333;
  margin: 30px 0 15px;
  display: flex;
  align-items: center;
  
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: #e0e0e0;
    margin-left: 15px;
  }
`;

const MatchesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ErrorMessage = styled.div`
  background-color: #ffebee;
  color: #c62828;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const NoMatchesMessage = styled.div`
  text-align: center;
  padding: 30px;
  color: #666;
  background-color: #f9f9f9;
  border-radius: 8px;
`;

const LeagueSection = styled.div`
  margin-bottom: 30px;
`;

const SportPage = () => {
  const { sportId } = useParams();
  const { sports, matches, loading, error, fetchSports, fetchMatches } = useBetting();
  const [groupedMatches, setGroupedMatches] = useState({});
  
  useEffect(() => {
    // Fetch sports if not already loaded
    if (sports.length === 0) {
      fetchSports();
    }
    
    // Fetch matches for this sport
    fetchMatches(sportId);
  }, [sportId]);
  
  // Group matches by league
  useEffect(() => {
    if (matches.length > 0) {
      const grouped = matches.reduce((acc, match) => {
        const leagueName = match.league_name || 'Other';
        if (!acc[leagueName]) {
          acc[leagueName] = [];
        }
        acc[leagueName].push(match);
        return acc;
      }, {});
      
      // Sort matches within each league by date and inplay status
      Object.keys(grouped).forEach(league => {
        grouped[league].sort((a, b) => {
          // Live matches first
          if (a.inplay && !b.inplay) return -1;
          if (!a.inplay && b.inplay) return 1;
          
          // Then by date
          return new Date(a.event_date) - new Date(b.event_date);
        });
      });
      
      setGroupedMatches(grouped);
    }
  }, [matches]);
  
  // Find the current sport
  const currentSport = sports.find(sport => sport.id.toString() === sportId);
  
  return (
    <SportPageContainer>
      <Title>
        {currentSport && currentSport.sport_icon && (
          <img 
            src={`${process.env.REACT_APP_API_URL || ''}/${currentSport.sport_icon}`} 
            alt={currentSport.name} 
          />
        )}
        {currentSport ? currentSport.name : 'Sport'} Matches
      </Title>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {loading ? (
        <LoadingSpinner text="Loading matches..." />
      ) : (
        <>
          {Object.keys(groupedMatches).length > 0 ? (
            Object.entries(groupedMatches).map(([league, leagueMatches]) => (
              <LeagueSection key={league}>
                <SectionTitle>{league}</SectionTitle>
                <MatchesGrid>
                  {leagueMatches.map(match => (
                    <MatchCard key={match.matchId} match={match} />
                  ))}
                </MatchesGrid>
              </LeagueSection>
            ))
          ) : (
            <NoMatchesMessage>
              No matches available for this sport at the moment. Please check back later.
            </NoMatchesMessage>
          )}
        </>
      )}
    </SportPageContainer>
  );
};

export default SportPage; 