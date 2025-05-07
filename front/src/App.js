import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import Header from './components/Header';
import History from './components/History';
import HomePage from './pages/HomePage';
import MatchPage from './pages/MatchPage';
import CasinoPage from './pages/CasinoPage';
import LoginPage from './pages/LoginPage';
import Profile from './pages/Profile';
import Aviator from './Aviator/Aviator';
import BettingGame from './mines/Mines';
import Papu from './Titli/Papu';
import AndharBhar from './AndharBhar/AndharBhar';
import Login from './pages/Login';
import { BettingProvider } from './context/BettingContext';
import './App.css';
import { ProfileProvider } from './context/ProfileContext';
import WalletHistory from './components/WalletHistory';
import DummyTesting from './Cricket_market/DummyTesting';
import T20 from './Cricket_market/T20';
import ProtectedRoute from './components/ProtectedRoute';
import LiveCricketMarket from './Cricket/Components/LiveCricket';
import Cricket from './Cricket/Cricket';
import PlayGames from './matka/PlayGames';
import Play from './matka/Play';
import BidPage from './matka/bidPage'
import { OverMarketProvider } from './context/OverMarketContext';
import MobileOnlyWrapper from './components/MobileOnlyWrapper';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f8f9fa;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 20px;
`;

// Layout component to wrap routes that need the standard layout
const MainLayout = ({ children }) => (
  <AppContainer>
    <Header />
    <MainContent>{children}</MainContent>
  </AppContainer>
);

function App() {
  return (
<MobileOnlyWrapper>
    <ProfileProvider>
      <BettingProvider>
      <OverMarketProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/cricket2" element={<LiveCricketMarket />} />
          <Route path="/cricket2/games/:Livematch" element={<Cricket />} />
          <Route path="/signup" element={<LoginPage />} />
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <MainLayout>
                <HomePage />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/match/currmtc" element={
            <ProtectedRoute>
              <T20 />
            </ProtectedRoute>
          } />

          <Route path="/casino/aviator" element={
            <ProtectedRoute>
              <Aviator />
            </ProtectedRoute>
          } />

          <Route path="/casino/mines" element={
            <ProtectedRoute>
              <BettingGame />
            </ProtectedRoute>
          } />

          <Route path="/casino/fun-games" element={
            <ProtectedRoute>
              <Papu />
            </ProtectedRoute>
          } />

          <Route path="/casino/andar-bahar" element={
            <ProtectedRoute>
              <AndharBhar />
            </ProtectedRoute>
          } />

          <Route path="/match" element={
            <ProtectedRoute>
              <DummyTesting />
            </ProtectedRoute>
          } />

          <Route path="/account/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

          <Route path="/history" element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          } />

          <Route path="/sport/:sportId" element={
            <ProtectedRoute>
              <MainLayout>
                <HomePage />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/match/:matchId" element={
            <ProtectedRoute>
              <MainLayout>
                <MatchPage />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/account/transactions" element={
            <ProtectedRoute>
              <MainLayout>
                <WalletHistory />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/casino/*" element={
            <ProtectedRoute>
              <MainLayout>
                <CasinoPage />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/casino/matka" element={
            <ProtectedRoute>
              <MainLayout>
                <PlayGames />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/casino/play/:gameName/:bidStatus" element={
            <ProtectedRoute>
              <MainLayout>
                <Play />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/casino/bidpage/:gameName/:bitType/:pointsToplay/:profit/:bitStatus" element={
            <ProtectedRoute>
              <MainLayout>
                <BidPage />

              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/inplay" element={<Navigate to="/" replace />} />
        </Routes>
        </OverMarketProvider>
      </BettingProvider>
    </ProfileProvider>
</MobileOnlyWrapper>
  );
}

export default App;
