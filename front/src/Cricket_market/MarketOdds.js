import React from 'react';
import styled from 'styled-components';
import { useBetting } from '../context/BettingContext';

const MarketContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const MarketHeader = styled.div`
  background-color: #f5f5f5;
  padding: 12px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
`;

const MarketTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  color: #333;
  font-weight: 500;
`;

const MarketStatus = styled.div`
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${props => {
    switch (props.$status) {
      case 'OPEN':
        return '#e8f5e9';
      case 'SUSPENDED':
        return '#ffebee';
      case 'CLOSED':
        return '#f5f5f5';
      default:
        return '#f5f5f5';
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'OPEN':
        return '#2e7d32';
      case 'SUSPENDED':
        return '#c62828';
      case 'CLOSED':
        return '#757575';
      default:
        return '#757575';
    }
  }};
`;

const MarketContent = styled.div`
  padding: 15px;
`;

const MarketInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 12px;
  color: #666;
`;

const MarketLimits = styled.div`
  span {
    margin-left: 10px;
  }
`;

const OddsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const OddsRow = styled.tr`
  &:not(:last-child) {
    border-bottom: 1px solid #f0f0f0;
  }
`;

const RunnerName = styled.td`
  padding: 10px 0;
  font-weight: 500;
  color: #333;
  width: 40%;
`;

const OddsCell = styled.td`
  padding: 10px 5px;
  text-align: center;
`;

const OddsButton = styled.div`
  background-color: ${props => {
    switch (props.$type) {
      case 'back':
        return '#a7d8fd';
      case 'lay':
        return '#f6c9cc';
      case 'yes':
        return '#a7d8fd';
      case 'no':
        return '#f6c9cc';
      default:
        return '#f0f0f0';
    }
  }};
  color: #333;
  padding: 8px 0;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  position: relative;
  
  &:hover {
    background-color: ${props => {
      switch (props.$type) {
        case 'back':
          return '#72b6e4';
        case 'lay':
          return '#e48a93';
        case 'yes':
          return '#72b6e4';
        case 'no':
          return '#e48a93';
        default:
          return '#e0e0e0';
      }
    }};
  }
  
  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const OddsValue = styled.div`
  font-weight: bold;
`;

const OddsSize = styled.div`
  font-size: 12px;
  color: #666;
`;

const FancyContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 4px;
  background-color: #f9f9f9;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const FancyInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const FancyName = styled.div`
  font-weight: 500;
  color: #333;
  margin-bottom: 5px;
`;

const FancyValue = styled.div`
  font-size: 12px;
  color: #666;
`;

const FancyOddsContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const FancyOddsButton = styled.div`
  background-color: ${props => props.$type === 'yes' ? '#a7d8fd' : '#f6c9cc'};
  color: #333;
  padding: 8px 15px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 80px;
  
  &:hover {
    background-color: ${props => props.$type === 'yes' ? '#72b6e4' : '#e48a93'};
  }
  
  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const BookmakerContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 4px;
  background-color: #f9f9f9;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const BookmakerName = styled.div`
  font-weight: 500;
  color: #333;
`;

const BookmakerOdds = styled.div`
  display: flex;
  gap: 5px;
`;

const NoDataMessage = styled.div`
  padding: 20px;
  text-align: center;
  color: #666;
`;

const MarketOdds = ({ market, type = 'main' }) => {
  const { formatOdds, formatStakeSize } = useBetting();
  
  // Safely format stake size with fallback
  const safeFormatStakeSize = (value) => {
    try {
      return formatStakeSize(value);
    } catch (error) {
      console.error('Error formatting stake size:', error);
      return '-';
    }
  };
  
  // Render different market types
  const renderMarketContent = () => {
    switch (type) {
      case 'fancy':
        return renderFancyMarket();
      case 'bookmaker':
        return renderBookmakerMarket();
      default:
        return renderMainMarket();
    }
  };
  
  // Render main market (match odds, etc.)
  const renderMainMarket = () => {
    if (!market || !market.runners || market.runners.length === 0) {
      return <NoDataMessage>No odds data available</NoDataMessage>;
    }
    
    return (
      <>
        <MarketInfo>
          <div>Min: {market.minStake || 100}</div>
          <MarketLimits>
            <span>Max: {market.maxStake || 10000}</span>
            {market.betDelay > 0 && <span>Delay: {market.betDelay}s</span>}
          </MarketLimits>
        </MarketInfo>
        
        <OddsTable>
          <tbody>
            {market.runners.map((runner, index) => (
              <OddsRow key={runner.selectionId || runner.sid || index}>
                <RunnerName>{runner.name || runner.runnerName}</RunnerName>
                
                {/* Lay Odds (in reverse order) */}
                {Array.from({ length: 3 }).map((_, i) => {
                  const layIndex = 2 - i;
                  const layPrice = runner.ex?.availableToLay?.[layIndex]?.price;
                  const laySize = runner.ex?.availableToLay?.[layIndex]?.size;
                  
                  return (
                    <OddsCell key={`lay-${layIndex}`}>
                      {layPrice ? (
                        <OddsButton 
                          $type="lay"
                          className={runner.status === 'SUSPENDED' ? 'disabled' : ''}
                        >
                          <OddsValue>{layPrice.toFixed(2)}</OddsValue>
                          {laySize && <OddsSize>{laySize}</OddsSize>}
                        </OddsButton>
                      ) : (
                        <OddsButton $type="lay" className="disabled">
                          <OddsValue>-</OddsValue>
                        </OddsButton>
                      )}
                    </OddsCell>
                  );
                })}
                
                {/* Back Odds */}
                {Array.from({ length: 3 }).map((_, i) => {
                  const backPrice = runner.ex?.availableToBack?.[i]?.price;
                  const backSize = runner.ex?.availableToBack?.[i]?.size;
                  
                  return (
                    <OddsCell key={`back-${i}`}>
                      {backPrice ? (
                        <OddsButton 
                          $type="back"
                          className={runner.status === 'SUSPENDED' ? 'disabled' : ''}
                        >
                          <OddsValue>{backPrice.toFixed(2)}</OddsValue>
                          {backSize && <OddsSize>{backSize}</OddsSize>}
                        </OddsButton>
                      ) : (
                        <OddsButton $type="back" className="disabled">
                          <OddsValue>-</OddsValue>
                        </OddsButton>
                      )}
                    </OddsCell>
                  );
                })}
              </OddsRow>
            ))}
          </tbody>
        </OddsTable>
      </>
    );
  };
  
  // Render fancy market
  const renderFancyMarket = () => {
    if (!market) {
      return <NoDataMessage>No fancy market data available</NoDataMessage>;
    }
    
    return (
      <>
        <MarketInfo>
          <div>Min: {market.minStake || 100}</div>
          <MarketLimits>
            <span>Max: {market.maxStake || 10000}</span>
          </MarketLimits>
        </MarketInfo>
        
        <FancyContainer>
          <FancyInfo>
            <FancyName>{market.marketName || market.mn}</FancyName>
            <FancyValue>
              {market.runValue?.yes && `Yes @ ${market.runValue.yes}`}
              {market.runValue?.no && ` | No @ ${market.runValue.no}`}
            </FancyValue>
          </FancyInfo>
          
          <FancyOddsContainer>
            <FancyOddsButton 
              $type="yes"
              className={market.status === 'SUSPENDED' ? 'disabled' : ''}
            >
              <OddsValue>{market.odds?.yes || '-'}</OddsValue>
              <OddsSize>YES</OddsSize>
            </FancyOddsButton>
            
            <FancyOddsButton 
              $type="no"
              className={market.status === 'SUSPENDED' ? 'disabled' : ''}
            >
              <OddsValue>{market.odds?.no || '-'}</OddsValue>
              <OddsSize>NO</OddsSize>
            </FancyOddsButton>
          </FancyOddsContainer>
        </FancyContainer>
      </>
    );
  };
  
  // Render bookmaker market
  const renderBookmakerMarket = () => {
    if (!market || !market.selections || market.selections.length === 0) {
      return <NoDataMessage>No bookmaker data available</NoDataMessage>;
    }
    
    return (
      <>
        <MarketInfo>
          <div>Min: {market.minStake || 100}</div>
          <MarketLimits>
            <span>Max: {market.maxStake || 10000}</span>
          </MarketLimits>
        </MarketInfo>
        
        {market.selections.map((selection, index) => (
          <BookmakerContainer key={selection.id || index}>
            <BookmakerName>{selection.name}</BookmakerName>
            
            <BookmakerOdds>
              <OddsButton 
                $type="back"
                className={selection.status === 'SUSPENDED' ? 'disabled' : ''}
              >
                <OddsValue>{selection.backOdds || '-'}</OddsValue>
                <OddsSize>BACK</OddsSize>
              </OddsButton>
              
              <OddsButton 
                $type="lay"
                className={selection.status === 'SUSPENDED' ? 'disabled' : ''}
              >
                <OddsValue>{selection.layOdds || '-'}</OddsValue>
                <OddsSize>LAY</OddsSize>
              </OddsButton>
            </BookmakerOdds>
          </BookmakerContainer>
        ))}
      </>
    );
  };
  
  const getMarketTitle = () => {
    if (type === 'fancy') {
      return market.marketName || market.mn || 'Fancy Market';
    } else if (type === 'bookmaker') {
      return market.marketName || 'Bookmaker';
    } else {
      return market.marketName || market.name || 'Match Odds';
    }
  };
  
  const getMarketStatus = () => {
    return market.status || market.st || 'OPEN';
  };
  
  return (
    <MarketContainer>
      <MarketHeader>
        <MarketTitle>{getMarketTitle()}</MarketTitle>
        <MarketStatus $status={getMarketStatus()}>
          {getMarketStatus()}
        </MarketStatus>
      </MarketHeader>
      
      <MarketContent>
        {renderMarketContent()}
      </MarketContent>
    </MarketContainer>
  );
};

export default MarketOdds; 