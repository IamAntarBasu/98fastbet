import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaTv, FaRegClock } from 'react-icons/fa';
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";


const MatchListContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 10px;
  overflow: hidden;
`;

const MatchListHeader = styled.div`
    background: linear-gradient(45deg, #ffd700, #ffbf00, #ffaa00);
  color: white;
  padding: 8px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const SportTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  
  img {
    height: 24px;
    width: auto;
  }
  
  h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  
  @media (max-width: 576px) {
    h2 {
      font-size: 16px;
    }
    
    img {
      height: 20px;
    }
  }
`;

const MatchTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const TableHeader = styled.thead`
  background-color: #f0f2f5;
  
  th {
    padding: 6px 8px;
    text-align: center;
    font-weight: 500;
    color: #4a5568;
    border-bottom: 1px solid #e2e8f0;
    font-size: 13px;
    
    &:first-child {
      text-align: left;
      width: 40%;
    }
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const TableBody = styled.tbody`
  tr {
    &:hover {
      background-color: #f8f9fa;
    }
    
    &:not(:last-child) {
      border-bottom: 1px solid #e2e8f0;
    }
  }
  
  td {
    padding: 8px;
    text-align: center;
    
    &:first-child {
      text-align: left;
    }
  }
  
  @media (max-width: 768px) {
    display: block;
    
    tr {
      display: flex;
      flex-wrap: wrap;
      padding: 8px 0;
      position: relative;
    }
    
    td {
      padding: 6px 8px;
      
      &:first-child {
        flex: 0 0 100%;
        padding-bottom: 0;
      }
      
      &:not(:first-child) {
        flex: 1;
        min-width: 80px;
        margin-top: 8px;
      }
    }
  }
`;

const MatchInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const MatchTitle = styled(Link)`
  color: #2d3748;
  font-weight: 600;
  text-decoration: none;
  margin-bottom: 4px;
  transition: color 0.2s;
  font-size: 13px;
  
  &:hover {
    color: #3c4d6d;
  }
  
  @media (max-width: 576px) {
    font-size: 12px;
  }
`;

const MatchMeta = styled.div`
  display: flex;
  align-items: center;
  color: #718096;
  font-size: 11px;
  flex-wrap: wrap;
  
  svg {
    margin-right: 4px;
  }
  
  span {
    margin-right: 10px;
    display: flex;
    align-items: center;
    margin-bottom: 2px;
    
    &.live {
      color: #e53e3e;
      font-weight: 600;
      background-color: rgba(229, 62, 62, 0.1);
      padding: 2px 4px;
      border-radius: 4px;
      margin-right: 8px;
    }
  }
  
  @media (max-width: 576px) {
    font-size: 10px;
    
    span {
      margin-right: 8px;
    }
  }
`;

const OddsButton = styled.div`
  background-color: ${props => props.$type === '1' ? '#ebf8ff' : props.$type === 'X' ? '#f7fafc' : '#fff5f5'};
  color: ${props => props.$type === '1' ? '#3182ce' : props.$type === 'X' ? '#4a5568' : '#e53e3e'};
  padding: 10px 0;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid ${props => props.$type === '1' ? '#bee3f8' : props.$type === 'X' ? '#e2e8f0' : '#fed7d7'};
  
  &:hover {
    background-color: ${props => props.$type === '1' ? '#bee3f8' : props.$type === 'X' ? '#edf2f7' : '#fed7d7'};
    transform: translateY(-2px);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  }
  
  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  
  @media (max-width: 768px) {
    padding: 8px 0;
    font-size: 14px;
  }
`;

const OddsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
`;

const BackLayLabel = styled.div`
  font-size: 10px;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 1px;
  font-weight: 500;
`;

const BackButton = styled.div`
  background-color: #87ceeb;
  color: #000;
  border: 1px solid #bee3f8;
  padding: 3px 0;
  border-radius: 4px;
  font-weight: 600;
  font-size: 12px;
  cursor: pointer;
  
  &:hover {
    background-color: #75bfe0;
  }
  
  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LayButton = styled.div`
  background-color: #ffb6c1;
  color: #000;
  border: 1px solid #fed7d7;
  padding: 3px 0;
  border-radius: 4px;
  font-weight: 600;
  font-size: 12px;
  cursor: pointer;
  
  &:hover {
    background-color: #ff9eb0;
  }
  
  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LiveTag = styled.span`
  background-color: #4caf50;
  color: white;
  font-size: 10px;
  font-weight: 600;
  padding: 1px 4px;
  border-radius: 3px;
  text-transform: uppercase;
  margin-right: 6px;
`;

const NoMatchesMessage = styled.div`
  padding: 40px;
  text-align: center;
  color: #718096;
  font-size: 16px;
  
  p {
    margin: 0 0 10px;
  }
  
  svg {
    font-size: 32px;
    margin-bottom: 10px;
    color: #a0aec0;
  }
  
  @media (max-width: 576px) {
    padding: 30px 20px;
    
    svg {
      font-size: 28px;
    }
    
    p {
      font-size: 14px;
    }
  }
`;

// Sample match data for development/testing
const sampleMatches = [
  {
    id: '1',
    title: 'India vs Australia',
    date: '2023-06-15',
    time: '14:00',
    isLive: true,
    hasStream: true,
    odds: { '1': '1.85', 'X': '3.40', '2': '4.50' }
  },
  {
    id: '2',
    title: 'England vs New Zealand',
    date: '2023-06-15',
    time: '16:30',
    isLive: false,
    hasStream: false,
    odds: { '1': '2.10', 'X': '3.25', '2': '3.75' }
  },
  {
    id: '3',
    title: 'South Africa vs Pakistan',
    date: '2023-06-16',
    time: '10:00',
    isLive: false,
    hasStream: true,
    odds: { '1': '2.50', 'X': '3.30', '2': '2.90' }
  }
];

// Helper function to format ISO date string to readable format
const formatDate = (isoString) => {
  if (!isoString) return 'TBD';
  
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return 'TBD';
  }
};

// Helper function to format ISO date string to time
const formatTime = (isoString) => {
  if (!isoString) return 'TBD';
  
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    console.error("Error formatting time:", error);
    return 'TBD';
  }
};

// Helper function to extract match name from backend data
const extractMatchName = (match) => {
  // console.log("Extracting match name from:", match); // Debug log to see the match object structure
  
  // For cricket matches, the event_name field typically contains the match name
  if (match.event_name) return match.event_name;
  
  // Try different properties where match name might be stored
  if (match.match_name) return match.match_name;
  if (match.name) return match.name;
  
  // Check for team names
  if (match.home_team && match.away_team) return `${match.home_team} vs ${match.away_team}`;
  
  // Check for runnerNames which is common in cricket API responses
  if (match.runnerNames && Array.isArray(match.runnerNames) && match.runnerNames.length >= 2) {
    return `${match.runnerNames[0].RN} vs ${match.runnerNames[1].RN}`;
  }
  
  // Check for teams array
  if (match.teams && Array.isArray(match.teams) && match.teams.length >= 2) {
    return `${match.teams[0]} vs ${match.teams[1]}`;
  }
  
  // If we can't find a proper name, use the title or a default with more information
  if (match.title) return match.title;
  if (match.league_name) return `${match.league_name} Match ${match.matchId || match.id || ''}`;
  
  // Last resort - create a more descriptive default
  return `Cricket Match ${match.matchId || match.id || match.event_id || ''}`;
};

// Helper function to extract odds from runners
const extractOddsFromRunners = (match) => {
  const defaultOdds = { 
    '1': { back: '-', lay: '-' }, 
    'X': { back: '-', lay: '-' }, 
    '2': { back: '-', lay: '-' } 
  };
  
  // Check if match has runners (common in cricket API)
  if (match.runners && Array.isArray(match.runners) && match.runners.length >= 2) {
    try {
      // First runner (home team)
      const runner1 = match.runners[0];
      if (runner1 && runner1.ex) {
        if (runner1.ex.b && runner1.ex.b.length > 0) {
          const backPrice = parseFloat(runner1.ex.b[0].p);
          if (!isNaN(backPrice)) {
            defaultOdds['1'].back = backPrice.toFixed(2);
          }
        }
        if (runner1.ex.l && runner1.ex.l.length > 0) {
          const layPrice = parseFloat(runner1.ex.l[0].p);
          if (!isNaN(layPrice)) {
            defaultOdds['1'].lay = layPrice.toFixed(2);
          }
        }
      }
      
      // Second runner (away team)
      const runner2 = match.runners[1];
      if (runner2 && runner2.ex) {
        if (runner2.ex.b && runner2.ex.b.length > 0) {
          const backPrice = parseFloat(runner2.ex.b[0].p);
          if (!isNaN(backPrice)) {
            defaultOdds['2'].back = backPrice.toFixed(2);
          }
        }
        if (runner2.ex.l && runner2.ex.l.length > 0) {
          const layPrice = parseFloat(runner2.ex.l[0].p);
          if (!isNaN(layPrice)) {
            defaultOdds['2'].lay = layPrice.toFixed(2);
          }
        }
      }
    } catch (e) {
      console.warn('Error extracting odds from runners:', e);
    }
  }
  
  return defaultOdds;
};

const MatchList = ({ title, matches = [] }) => {
  const socket = io(`${process.env.REACT_APP_BASE_URL}`);

  const [leagues, setLeagues] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("updateMatches", (data) => {
      // console.log("Received data:", data); // Debugging step
      if (Array.isArray(data)) {
        setLeagues(data);
      } else {
        console.error("Data is not an array:", data);
      }
    });

    return () => socket.off("updateMatches");
  }, []);

const handleClick = (gameid,iframeUrl,match) => {
  navigate(`/match/currmtc`, {
    state: { id: gameid ,iframeUrl:iframeUrl ,match:match}
  });
  // console.log(gameid)
};   


  // console.log("Received matches:", JSON.stringify(matches, null, 2)); // Enhanced debug log with full structure
  
  // Use actual matches data if available, otherwise use sample data
  const displayMatches = matches && matches.length > 0 ? matches : sampleMatches;
  
  // Ensure each match has an odds object with default values and a unique ID
  const safeMatches = displayMatches.map((match, index) => {
    // console.log(`Processing match ${index}:`, match); // Debug log for each match
    
    // Extract date and time from ISO string if available
    const eventDate = match.event_date || match.date;
    const formattedDate = formatDate(eventDate);
    const formattedTime = formatTime(eventDate);
    
    // Extract match name with index for context
    const matchName = extractMatchName(match) || `Cricket Match ${index + 1}`;
    
    // Extract odds from runners if available
    const extractedOdds = extractOddsFromRunners(match);
    
    // Get team names for display in odds columns
    let team1Name = '';
    let team2Name = '';
    
    if (match.runnerNames && Array.isArray(match.runnerNames) && match.runnerNames.length >= 2) {
      team1Name = match.runnerNames[0].RN;
      team2Name = match.runnerNames[1].RN;
    } else if (matchName.includes('vs')) {
      const teams = matchName.split('vs').map(t => t.trim());
      team1Name = teams[0];
      team2Name = teams[1];
    }
    
    console.log(leagues);

    // Create a safe match object with all required properties
    return {
      id: match.id || match.match_id || match.matchId || `match-${index}`,
      title: matchName,
      date: formattedDate,
      time: formattedTime,
      isLive: match.isLive || match.inplay || false,
      hasStream: match.hasStream || match.has_stream || false,
      odds: extractedOdds,
      team1: team1Name,
      team2: team2Name
    };
  });

  // console.log("Safe matches:", safeMatches); // Debug log to see processed data

  return (
    <MatchListContainer>
      <MatchListHeader>
        <SportTitle>
          {/* <img src={logo} alt="Logo" /> */}
          <h2 style ={{color:" #1a1a1a"}}>98FASTBET</h2>
          <h2  style ={{color:" #1a1a1a"}}>{title || 'CRICKET'}</h2>
        </SportTitle>
      </MatchListHeader>
      
      {safeMatches.length === 0 ? (
        <NoMatchesMessage>
          <FaRegClock />
          <p>No matches available at the moment.</p>
          <p>Please check back later or try another sport.</p>
        </NoMatchesMessage>
      ) : (
        <MatchTable>
          {/* <TableHeader>
            <tr>
              <th>Match</th>
              <th>1</th>
              <th>X</th>
              <th>2</th>
            </tr>
          </TableHeader> */}
          {/* {Array.isArray(leagues) &&
          leagues.map((match, index) => (
            <MatchItem key={match.eventId || index} onClick={() => handleClick(match.marketId,match.scoreIframe,match.matchName)}>
              <span>{match.matchName || "Unknown Match"} {match.matchDate}</span>
              <LiveBadge>LIVE</LiveBadge>    
            </MatchItem>    
          ))}  */}
          <TableBody>
            {leagues.map((match, index) => (
              <tr key={match.eventId || index} onClick={() => handleClick(match.marketId,match.scoreIframe,match.matchName)}>
                <td>
                  <MatchInfo>
                    <MatchTitle>
                      <LiveTag>LIVE</LiveTag>
                      {match.matchName}-{match.matchDate}
                    </MatchTitle>
                    <MatchMeta>
                      {/* <span>
                        <FaCalendarAlt />
                        {match.matchDate}
                      </span>
                      <span>
                        <FaRegClock />
                        {match.time}
                      </span> */}
                      {/* {match.hasStream && (
                        <span>
                          <FaTv />
                          Live Stream
                        </span>
                      )} */}
                    </MatchMeta>
                  </MatchInfo>
                </td>
                {/* <td>
                  <OddsContainer>
                    <BackButton className={match.odds['1'].back === '-' ? 'disabled' : ''}>
                      {match.odds['1'].back}
                    </BackButton>
                    <LayButton className={match.odds['1'].lay === '-' ? 'disabled' : ''}>
                      {match.odds['1'].lay}
                    </LayButton>
                  </OddsContainer>
                </td> */}
                {/* <td>
                  <OddsContainer>
                    <BackButton className={match.odds['X'].back === '-' ? 'disabled' : ''}>
                      {match.odds['X'].back}
                    </BackButton>
                    <LayButton className={match.odds['X'].lay === '-' ? 'disabled' : ''}>
                      {match.odds['X'].lay}
                    </LayButton>
                  </OddsContainer>
                </td> */}
                {/* <td>
                  <OddsContainer>
                    <BackButton className={match.odds['2'].back === '-' ? 'disabled' : ''}>
                      {match.odds['2'].back}
                    </BackButton>
                    <LayButton className={match.odds['2'].lay === '-' ? 'disabled' : ''}>
                      {match.odds['2'].lay}
                    </LayButton>
                  </OddsContainer>
                </td> */}
              </tr>
            ))}
          </TableBody>
        </MatchTable>
      )}
    </MatchListContainer>
  );
};

export default MatchList; 








// import React, { useState, useEffect } from 'react';
// import styled from 'styled-components';
// import { Link, useNavigate } from 'react-router-dom';
// import { FaCalendarAlt, FaTv, FaRegClock } from 'react-icons/fa';
// import io from "socket.io-client";
// import { 
//   TrophyIcon,
//   PlusCircleIcon,
//   ChartBarIcon,
//   VideoCameraIcon,
//   TvIcon,
//   LinkIcon
// } from '@heroicons/react/24/solid';
// import "./MatchList.css";

// // Styled Components
// const MatchListContainer = styled.div`
//   background-color: white;
//   border-radius: 8px;
//   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
//   margin-bottom: 10px;
//   overflow: hidden;
// `;

// const MatchListHeader = styled.div`
//   background: linear-gradient(45deg, #ffd700, #ffbf00, #ffaa00);
//   color: white;
//   padding: 8px 12px;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   border-bottom: 1px solid rgba(255, 255, 255, 0.1);
// `;

// const SportTitle = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 8px;
  
//   img {
//     height: 24px;
//     width: auto;
//   }
  
//   h2 {
//     margin: 0;
//     font-size: 18px;
//     font-weight: 600;
//     text-transform: uppercase;
//     letter-spacing: 1px;
//   }
  
//   @media (max-width: 576px) {
//     h2 {
//       font-size: 16px;
//     }
    
//     img {
//       height: 20px;
//     }
//   }
// `;

// const MatchTable = styled.table`
//   width: 100%;
//   border-collapse: collapse;
  
//   @media (max-width: 768px) {
//     display: block;
//   }
// `;

// const TableHeader = styled.thead`
//   background-color: #f0f2f5;
  
//   th {
//     padding: 6px 8px;
//     text-align: center;
//     font-weight: 500;
//     color: #4a5568;
//     border-bottom: 1px solid #e2e8f0;
//     font-size: 13px;
    
//     &:first-child {
//       text-align: left;
//       width: 40%;
//     }
//   }
  
//   @media (max-width: 768px) {
//     display: none;
//   }
// `;

// const TableBody = styled.tbody`
//   tr {
//     &:hover {
//       background-color: #f8f9fa;
//     }
    
//     &:not(:last-child) {
//       border-bottom: 1px solid #e2e8f0;
//     }
//   }
  
//   td {
//     padding: 8px;
//     text-align: center;
    
//     &:first-child {
//       text-align: left;
//     }
//   }
  
//   @media (max-width: 768px) {
//     display: block;
    
//     tr {
//       display: flex;
//       flex-wrap: wrap;
//       padding: 8px 0;
//       position: relative;
//     }
    
//     td {
//       padding: 6px 8px;
      
//       &:first-child {
//         flex: 0 0 100%;
//         padding-bottom: 0;
//       }
      
//       &:not(:first-child) {
//         flex: 1;
//         min-width: 80px;
//         margin-top: 8px;
//       }
//     }
//   }
// `;

// const MatchInfo = styled.div`
//   display: flex;
//   flex-direction: column;
// `;

// const MatchTitle = styled(Link)`
//   color: #2d3748;
//   font-weight: 600;
//   text-decoration: none;
//   margin-bottom: 4px;
//   transition: color 0.2s;
//   font-size: 13px;
  
//   &:hover {
//     color: #3c4d6d;
//   }
  
//   @media (max-width: 576px) {
//     font-size: 12px;
//   }
// `;

// const MatchMeta = styled.div`
//   display: flex;
//   align-items: center;
//   color: #718096;
//   font-size: 11px;
//   flex-wrap: wrap;
  
//   svg {
//     margin-right: 4px;
//   }
  
//   span {
//     margin-right: 10px;
//     display: flex;
//     align-items: center;
//     margin-bottom: 2px;
    
//     &.live {
//       color: #e53e3e;
//       font-weight: 600;
//       background-color: rgba(229, 62, 62, 0.1);
//       padding: 2px 4px;
//       border-radius: 4px;
//       margin-right: 8px;
//     }
//   }
  
//   @media (max-width: 576px) {
//     font-size: 10px;
    
//     span {
//       margin-right: 8px;
//     }
//   }
// `;

// const OddsButton = styled.div`
//   background-color: ${props => props.$type === '1' ? '#ebf8ff' : props.$type === 'X' ? '#f7fafc' : '#fff5f5'};
//   color: ${props => props.$type === '1' ? '#3182ce' : props.$type === 'X' ? '#4a5568' : '#e53e3e'};
//   padding: 10px 0;
//   border-radius: 6px;
//   font-weight: 600;
//   cursor: pointer;
//   transition: all 0.2s;
//   border: 1px solid ${props => props.$type === '1' ? '#bee3f8' : props.$type === 'X' ? '#e2e8f0' : '#fed7d7'};
  
//   &:hover {
//     background-color: ${props => props.$type === '1' ? '#bee3f8' : props.$type === 'X' ? '#edf2f7' : '#fed7d7'};
//     transform: translateY(-2px);
//     box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
//   }
  
//   &.disabled {
//     opacity: 0.5;
//     cursor: not-allowed;
//     transform: none;
//     box-shadow: none;
//   }
  
//   @media (max-width: 768px) {
//     padding: 8px 0;
//     font-size: 14px;
//   }
// `;

// const OddsContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 1px;
// `;

// const BackLayLabel = styled.div`
//   font-size: 10px;
//   color: #718096;
//   text-transform: uppercase;
//   letter-spacing: 0.5px;
//   margin-bottom: 1px;
//   font-weight: 500;
// `;

// const BackButton = styled.div`
//   background-color: #87ceeb;
//   color: #000;
//   border: 1px solid #bee3f8;
//   padding: 3px 0;
//   border-radius: 4px;
//   font-weight: 600;
//   font-size: 12px;
//   cursor: pointer;
  
//   &:hover {
//     background-color: #75bfe0;
//   }
  
//   &.disabled {
//     opacity: 0.5;
//     cursor: not-allowed;
//   }
// `;

// const LayButton = styled.div`
//   background-color: #ffb6c1;
//   color: #000;
//   border: 1px solid #fed7d7;
//   padding: 3px 0;
//   border-radius: 4px;
//   font-weight: 600;
//   font-size: 12px;
//   cursor: pointer;
  
//   &:hover {
//     background-color: #ff9eb0;
//   }
  
//   &.disabled {
//     opacity: 0.5;
//     cursor: not-allowed;
//   }
// `;

// const LiveTag = styled.span`
//   background-color: #4caf50;
//   color: white;
//   font-size: 10px;
//   font-weight: 600;
//   padding: 1px 4px;
//   border-radius: 3px;
//   text-transform: uppercase;
//   margin-right: 6px;
// `;

// const NoMatchesMessage = styled.div`
//   padding: 40px;
//   text-align: center;
//   color: #718096;
//   font-size: 16px;
  
//   p {
//     margin: 0 0 10px;
//   }
  
//   svg {
//     font-size: 32px;
//     margin-bottom: 10px;
//     color: #a0aec0;
//   }
  
//   @media (max-width: 576px) {
//     padding: 30px 20px;
    
//     svg {
//       font-size: 28px;
//     }
    
//     p {
//       font-size: 14px;
//     }
//   }
// `;

// // Sample match data for development/testing (VIRTUAL tab)
// const sampleMatches = [
//   {
//     id: '1',
//     title: "ICC WOMEN'S T20 WORLD CUP",
//     date: '03 OCT',
//     time: '02:30 PM',
//     isLive: true,
//     hasStream: true,
//     odds: {
//       '1': { back: '1.39', lay: '1.41' },
//       'X': { back: '3.4', lay: '3.4' },
//       '2': { back: '3.4', lay: '3.4' }
//     }
//   },
//   {
//     id: '2',
//     title: 'WESTERN AUSTRALIA V QUEENSLAND BULLS',
//     date: '11 OCT',
//     time: '07:30 AM',
//     isLive: true,
//     hasStream: false,
//     odds: {
//       '1': { back: '1.29', lay: '1.41' },
//       'X': { back: '3.4', lay: '3.4' },
//       '2': { back: '3.4', lay: '3.4' }
//     }
//   },
//   {
//     id: '3',
//     title: 'DURBAN SUPER GIANTS SRL V MI CAPE TOWN SRL',
//     date: '11 OCT',
//     time: '11:30 AM',
//     isLive: true,
//     hasStream: true,
//     odds: {
//       '1': { back: '1.39', lay: '1.41' },
//       'X': { back: '3.4', lay: '3.4' },
//       '2': { back: '3.4', lay: '3.4' }
//     }
//   },
//   {
//     id: '4',
//     title: 'SOUTH AFRICA W T10 V OTHERS',
//     date: '11 OCT',
//     time: '12:46 PM',
//     isLive: true,
//     hasStream: true,
//     odds: {
//       '1': { back: '1.39', lay: '1.41' },
//       'X': { back: '3.4', lay: '3.4' },
//       '2': { back: '3.4', lay: '3.4' }
//     }
//   },
//   {
//     id: '5',
//     title: 'AUSTRALIA T10 V PAKISTAN',
//     date: '11 OCT',
//     time: '12:50 PM',
//     isLive: true,
//     hasStream: true,
//     odds: {
//       '1': { back: '1.39', lay: '1.41' },
//       'X': { back: '3.4', lay: '3.4' },
//       '2': { back: '3.4', lay: '3.4' }
//     }
//   },
//   {
//     id: '6',
//     title: 'BANGALORE V CHENNAI',
//     date: '11 OCT',
//     time: '01:06 PM',
//     isLive: true,
//     hasStream: true,
//     odds: {
//       '1': { back: '1.39', lay: '1.41' },
//       'X': { back: '3.4', lay: '3.4' },
//       '2': { back: '3.4', lay: '3.4' }
//     }
//   },
//   {
//     id: '7',
//     title: 'WESTERN PROVINCE W OTHERS',
//     date: '11 OCT',
//     time: '01:30 PM',
//     isLive: true,
//     hasStream: true,
//     odds: {
//       '1': { back: '1.39', lay: '1.41' },
//       'X': { back: '3.4', lay: '3.4' },
//       '2': { back: '3.4', lay: '3.4' }
//     }
//   },
//   {
//     id: '8',
//     title: "ENGLAND WOMEN'S V SCOTLAND",
//     date: '11 OCT',
//     time: '03:30 PM',
//     isLive: true,
//     hasStream: true,
//     odds: {
//       '1': { back: '1.39', lay: '1.41' },
//       'X': { back: '3.4', lay: '3.4' },
//       '2': { back: '3.4', lay: '3.4' }
//     }
//   }
// ];

// // Function to randomly update odds for dummy data
// const updateOddsRandomly = (odds) => {
//   const randomChange = () => (Math.random() * 0.2 - 0.1).toFixed(2);
//   return {
//     '1': {
//       back: (parseFloat(odds['1'].back) + parseFloat(randomChange())).toFixed(2),
//       lay: (parseFloat(odds['1'].lay) + parseFloat(randomChange())).toFixed(2)
//     },
//     'X': {
//       back: (parseFloat(odds['X'].back) + parseFloat(randomChange())).toFixed(2),
//       lay: (parseFloat(odds['X'].lay) + parseFloat(randomChange())).toFixed(2)
//     },
//     '2': {
//       back: (parseFloat(odds['2'].back) + parseFloat(randomChange())).toFixed(2),
//       lay: (parseFloat(odds['2'].lay) + parseFloat(randomChange())).toFixed(2)
//     }
//   };
// };

// // Helper function to format ISO date string to readable format
// const formatDate = (isoString) => {
//   if (!isoString) return 'TBD';
  
//   try {
//     const date = new Date(isoString);
//     return date.toLocaleDateString('en-US', {
//       day: '2-digit',
//       month: 'short'
//     }).toUpperCase();
//   } catch (error) {
//     console.error("Error formatting date:", error);
//     return 'TBD';
//   }
// };

// // Helper function to format ISO date string to time
// const formatTime = (isoString) => {
//   if (!isoString) return 'TBD';
  
//   try {
//     const date = new Date(isoString);
//     return date.toLocaleTimeString('en-US', {
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: true
//     }).toUpperCase();
//   } catch (error) {
//     console.error("Error formatting time:", error);
//     return 'TBD';
//   }
// };

// // Helper function to extract match name from backend data
// const extractMatchName = (match) => {
//   if (match.matchName) return match.matchName.toUpperCase();
//   if (match.event_name) return match.event_name.toUpperCase();
//   if (match.match_name) return match.match_name.toUpperCase();
//   if (match.name) return match.name.toUpperCase();
//   if (match.home_team && match.away_team) return `${match.home_team} V ${match.away_team}`.toUpperCase();
//   if (match.runnerNames && Array.isArray(match.runnerNames) && match.runnerNames.length >= 2) {
//     return `${match.runnerNames[0].RN} V ${match.runnerNames[1].RN}`.toUpperCase();
//   }
//   if (match.teams && Array.isArray(match.teams) && match.teams.length >= 2) {
//     return `${match.teams[0]} V ${match.teams[1]}`.toUpperCase();
//   }
//   if (match.title) return match.title.toUpperCase();
//   if (match.league_name) return `${match.league_name} Match ${match.matchId || match.id || ''}`.toUpperCase();
//   return `Cricket Match ${match.matchId || match.id || match.event_id || ''}`.toUpperCase();
// };

// // Helper function to extract odds from runners
// const extractOddsFromRunners = (match) => {
//   const defaultOdds = { 
//     '1': { back: '1.50', lay: '1.55' }, 
//     'X': { back: '3.0', lay: '3.2' }, 
//     '2': { back: '2.80', lay: '2.90' } 
//   };
  
//   if (match.runners && Array.isArray(match.runners) && match.runners.length >= 2) {
//     try {
//       const runner1 = match.runners[0];
//       if (runner1 && runner1.ex) {
//         if (runner1.ex.b && runner1.ex.b.length > 0) {
//           const backPrice = parseFloat(runner1.ex.b[0].p);
//           if (!isNaN(backPrice)) {
//             defaultOdds['1'].back = backPrice.toFixed(2);
//           }
//         }
//         if (runner1.ex.l && runner1.ex.l.length > 0) {
//           const layPrice = parseFloat(runner1.ex.l[0].p);
//           if (!isNaN(layPrice)) {
//             defaultOdds['1'].lay = layPrice.toFixed(2);
//           }
//         }
//       }
      
//       const runner2 = match.runners[1];
//       if (runner2 && runner2.ex) {
//         if (runner2.ex.b && runner2.ex.b.length > 0) {
//           const backPrice = parseFloat(runner2.ex.b[0].p);
//           if (!isNaN(backPrice)) {
//             defaultOdds['2'].back = backPrice.toFixed(2);
//           }
//         }
//         if (runner2.ex.l && runner2.ex.l.length > 0) {
//           const layPrice = parseFloat(runner2.ex.l[0].p);
//           if (!isNaN(layPrice)) {
//             defaultOdds['2'].lay = layPrice.toFixed(2);
//           }
//         }
//       }
//     } catch (e) {
//       console.warn('Error extracting odds from runners:', e);
//     }
//   }
  
//   return defaultOdds;
// };

// const MatchList = ({ title, matches = [] }) => {
//   const socket = io(`${process.env.REACT_APP_BASE_URL}`);
//   const [leagues, setLeagues] = useState([]);
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState('live');
//   const [displayMatches, setDisplayMatches] = useState(sampleMatches);

//   useEffect(() => {
//     socket.on("updateMatches", (data) => {
//       console.log("Received API data:", data); // Debug log to inspect API data
//       if (Array.isArray(data)) {
//         setLeagues(data);
//       } else {
//         console.error("Data is not an array:", data);
//       }
//     });

//     return () => socket.off("updateMatches");
//   }, []);

//   // Randomly update odds for dummy data (VIRTUAL tab) every 5 seconds
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setDisplayMatches(prevMatches =>
//         prevMatches.map(match => ({
//           ...match,
//           odds: updateOddsRandomly(match.odds)
//         }))
//       );
//     }, 5000);

//     return () => clearInterval(interval);
//   }, []);

//   // Process API matches for LIVE tab
//   const safeMatches = leagues.map((match, index) => {
//     const eventDate = match.matchDate || match.event_date || match.date;
//     const formattedDate = formatDate(eventDate);
//     const formattedTime = formatTime(eventDate);
//     const matchName = extractMatchName(match) || `Cricket Match ${index + 1}`;
//     const extractedOdds = extractOddsFromRunners(match);

//     return {
//       id: match.eventId || match.id || match.match_id || match.matchId || `match-${index}`,
//       title: matchName,
//       date: formattedDate,
//       time: formattedTime,
//       isLive: match.inplay || match.isLive || true, // Assuming API matches are live
//       hasStream: match.scoreIframe ? true : false, // Assuming scoreIframe indicates streaming
//       odds: extractedOdds,
//       scoreIframe: match.scoreIframe // Ensure scoreIframe is passed for navigation
//     };
//   });
  

//   const handleClick = (gameid, iframeUrl, match) => {
//     navigate(`/match/currmtc`, {
//       state: { id: gameid, iframeUrl: iframeUrl, match: match }
//     });

//   };

//   const getOptionIcon = (option) => {
//     switch(option) {
//       case 'stats': return <ChartBarIcon className="icon red-icon bounce" />;
//       case 'video': return <VideoCameraIcon className="icon red-icon bounce" />;
//       case 'facebook': return <LinkIcon className="icon gray-icon bounce" />;
//       case 'tv': return <TvIcon className="icon red-icon bounce" />;
//       default: return null;
//     }
//   };

//   // Determine which matches to display based on the active tab
//   const matchesToDisplay = activeTab === 'live' ? safeMatches : displayMatches;
//   console.log(matchesToDisplay, "match")
//   return (
//     <MatchListContainer>
//       <MatchListHeader>
//         <SportTitle>
//           <TrophyIcon className="trophy-icon bounce" />
//           {/* <h2 style={{ color: "#1a1a1a" }}>DYNEXBET</h2> */}
//           <h2 style={{ color: "#1a1a1a" }}>{title || 'CRICKET'}</h2>
//           <div className="tab-buttons">
//             <button
//               onClick={() => setActiveTab('live')}
//               className={`tab-button ${activeTab === 'live' ? 'active' : ''}`}
//             >
//               <PlusCircleIcon className="button-icon" />
//               <span>LIVE</span>
//             </button>
//             <button
//               onClick={() => setActiveTab('virtual')}
//               className={`tab-button ${activeTab === 'virtual' ? 'active' : ''}`}
//             >
//               <PlusCircleIcon className="button-icon" />
//               <span>VIRTUAL</span>
//             </button>
//           </div>
//         </SportTitle>
//       </MatchListHeader>
      
//       {matchesToDisplay.length === 0 ? (
//         <NoMatchesMessage>
//           <FaRegClock />
//           <p>No matches available at the moment.</p>
//           <p>Please check back later or try another sport.</p>
//         </NoMatchesMessage>
//       ) : (
//         <MatchTable>
//           <TableHeader>
//             <tr>
//               <th>Match</th>
//               <th>Status</th>
//               <th>Date & Time</th>
//               <th>Option</th>
//               <th>1</th>
//               <th>X</th>
//               <th>2</th>
//             </tr>
//           </TableHeader>
//           <TableBody>
            
//             {matchesToDisplay.map((match, index) => (
//               <tr key={match.id || index} onClick={() => handleClick(match.id, match.scoreIframe, match.title)}>
//                 <td>
//                   <MatchInfo>
//                     <MatchTitle to={`/match/${match.id}`}>
//                       {match.isLive && <LiveTag>LIVE</LiveTag>}
//                       {match.title}
//                     </MatchTitle>
//                     <MatchMeta>
//                       <span>
//                         <FaCalendarAlt />
//                         {match.date}
//                       </span>
//                       <span>
//                         <FaRegClock />
//                         {match.time}
//                       </span>
//                       {match.hasStream && (
//                         <span>
//                           <FaTv />
//                           Live Stream
//                         </span>
//                       )}
//                     </MatchMeta>
//                   </MatchInfo>
//                 </td>
//                 <td>
//                   {match.isLive && <LiveTag>LIVE</LiveTag>}
//                 </td>
//                 <td>
//                   <MatchMeta>
//                     <span>{match.date} {match.time}</span>
//                   </MatchMeta>
//                 </td>
//                 <td>
//                   {getOptionIcon(match.hasStream ? 'video' : 'stats')}
//                 </td>
//                 <td>
//                   <OddsContainer>
//                     <BackButton className={match.odds['1'].back === '-' ? 'disabled' : ''}>
//                       {match.odds['1'].back}
//                     </BackButton>
//                     <LayButton className={match.odds['1'].lay === '-' ? 'disabled' : ''}>
//                       {match.odds['1'].lay}
//                     </LayButton>
//                   </OddsContainer>
//                 </td>
//                 <td>
//                   <OddsContainer>
//                     <BackButton className={match.odds['X'].back === '-' ? 'disabled' : ''}>
//                       {match.odds['X'].back}
//                     </BackButton>
//                     <LayButton className={match.odds['X'].lay === '-' ? 'disabled' : ''}>
//                       {match.odds['X'].lay}
//                     </LayButton>
//                   </OddsContainer>
//                 </td>
//                 <td>
//                   <OddsContainer>
//                     <BackButton className={match.odds['2'].back === '-' ? 'disabled' : ''}>
//                       {match.odds['2'].back}
//                     </BackButton>
//                     <LayButton className={match.odds['2'].lay === '-' ? 'disabled' : ''}>
//                       {match.odds['2'].lay}
//                     </LayButton>
//                   </OddsContainer>
//                 </td>
//               </tr>
//             ))}
//           </TableBody>
//         </MatchTable>
//       )}
//     </MatchListContainer>
//   );
// };

// export default MatchList;
