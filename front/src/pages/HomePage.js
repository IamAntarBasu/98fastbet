import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import MatchList from '../components/MatchList';
import CasinoGames from '../components/CasinoGames';
import { useBetting } from '../context/BettingContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Sidebar from '../components/Sidebar';
import SideNavbar from '../components/SideNavbar';

const HomePageContainer = styled.div`
  display: flex;
  background-color: #f8f9fa;
  position: relative;
  padding-top: 60px; /* Space for fixed SideNavbar */
`;

const SidebarWrapper = styled.div`
  width: 280px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 0;
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 0 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: 768px) {
    padding: 0 15px;
    z-index: 10;
  }
`;

const ErrorMessage = styled.div`
  background-color: #fff1f0;
  color: #cf1322;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border-left: 4px solid #cf1322;
`;

const CasinoSection = styled.div`
  margin-bottom: 30px;

  @media (max-width: 768px) {
    margin-bottom: 20px;
  }
`;

const HomePage = () => {
  const { 
    sports: availableSports, 
    matches, 
    loading, 
    loadingMatches, 
    error, 
    matchError, 
    fetchSports, 
    fetchMatches 
  } = useBetting();

  const [activeSport, setActiveSport] = useState('4'); // Default to Cricket
  const [activeSportName, setActiveSportName] = useState('Cricket');

  useEffect(() => {
    fetchSports();
  }, []);

  useEffect(() => {
    if (activeSport) {
      fetchMatches(activeSport);
    }
  }, [activeSport]);

  const handleSportSelect = (sportId, sportName) => {
    setActiveSport(sportId);
    setActiveSportName(sportName);
  };

  return (
    <HomePageContainer>
      <SidebarWrapper>
        <Sidebar 
          activeSport={activeSport} 
          onSportSelect={handleSportSelect} 
          sportsData={availableSports} // Assuming API returns sports data
        />
      </SidebarWrapper>

      <MainContent>
        <SideNavbar 
          activeSport={activeSport} 
          onSportSelect={handleSportSelect} 
        />

        <CasinoSection>
          <CasinoGames />
        </CasinoSection>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {matchError && <ErrorMessage>{matchError}</ErrorMessage>}

        {loading || loadingMatches ? (
          <LoadingSpinner text={`Loading ${activeSportName} matches...`} />
        ) : matches.length > 0 ? (
          <MatchList 
            title={activeSportName.toUpperCase()} 
            matches={matches}
          />
        ) : (
          <ErrorMessage>No {activeSportName} matches available at the moment.</ErrorMessage>
        )}
      </MainContent>
    </HomePageContainer>
  );
};

export default HomePage;