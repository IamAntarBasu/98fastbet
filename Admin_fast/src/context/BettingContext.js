// import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
// import api, { getMatches, getMatchDetails } from '../utils/api';

// const BettingContext = createContext();

// export const useBetting = () => useContext(BettingContext);

// // Get the API URL from environment variables
// const API_URL = process.env.REACT_APP_API_URL || 'https://reddybackend.vercel.app';

// export const BettingProvider = ({ children }) => {
//   // State
//   const [sports, setSports] = useState([]);
//   const [matches, setMatches] = useState([]);
//   const [currentMatch, setCurrentMatch] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [socket, setSocket] = useState(null);
//   const [activeSubscription, setActiveSubscription] = useState(null);
//   const reconnectTimeoutRef = useRef(null);

//   // Initialize WebSocket connection
//   useEffect(() => {
//     // Use the WebSocket server URL from environment or default to zplay1.in
//     const wsServerUrl = process.env.REACT_APP_WS_URL || 'wss://zplay1.in/socket.io/?EIO=4&transport=websocket';
    
//     const connectWebSocket = () => {
//       try {
//         const ws = new WebSocket(wsServerUrl);
        
//         ws.onopen = () => {
//           console.log('WebSocket connected successfully');
//           // Send initial connection message
//           ws.send('40');
//           console.log('Sent: 40');
//         };
        
//         ws.onmessage = (event) => {
//           const message = event.data;
//           console.log('Received:', message);
          
//           // Handle different message types
//           try {
//             // Skip heartbeat messages
//             if (message === '2') {
//               // Respond to ping with pong
//               ws.send('3');
//               return;
//             }
            
//             // Handle connection acknowledgment
//             if (message.startsWith('40')) {
//               // If we have an active subscription, resubscribe after reconnection
//               if (activeSubscription) {
//                 ws.send(`42["sub","${activeSubscription}"]`);
//                 console.log(`Resubscribed to: ${activeSubscription}`);
//               }
//               return;
//             }
            
//             // Handle data messages
//             if (message.startsWith('42')) {
//               const jsonStr = message.substring(2);
//               const [eventName, eventData] = JSON.parse(jsonStr);
              
//               // Process different event types
//               switch (eventName) {
//                 case 'App\\Events\\SportsBroadcastData':
//                   handleMatchOddsUpdate(eventData);
//                   break;
//                 case 'App\\Events\\BroadcastBookmaker':
//                   handleBookmakerUpdate(eventData);
//                   break;
//                 case 'App\\Events\\BroadcastFancy':
//                   handleFancyUpdate(eventData);
//                   break;
//                 default:
//                   console.log('Unhandled event type:', eventName);
//               }
//             }
//           } catch (err) {
//             console.error('Error processing WebSocket message:', err);
//           }
//         };
        
//         ws.onerror = (error) => {
//           console.error('WebSocket Error:', error);
//         };
        
//         ws.onclose = () => {
//           console.log('WebSocket Disconnected. Reconnecting in 5 seconds...');
//           // Clear any existing timeout
//           if (reconnectTimeoutRef.current) {
//             clearTimeout(reconnectTimeoutRef.current);
//           }
//           // Set a new reconnection timeout
//           reconnectTimeoutRef.current = setTimeout(connectWebSocket, 5000);
//         };
        
//         setSocket(ws);
//       } catch (err) {
//         console.error('Failed to create WebSocket connection:', err);
//         // Attempt to reconnect
//         reconnectTimeoutRef.current = setTimeout(connectWebSocket, 5000);
//       }
//     };
    
//     // Initial connection
//     connectWebSocket();
    
//     // Cleanup on unmount
//     return () => {
//       if (socket) {
//         // Unsubscribe if needed
//         if (activeSubscription) {
//           socket.send(`42["leave",["${activeSubscription}"]]`);
//         }
//         socket.close();
//       }
      
//       // Clear any pending reconnection timeout
//       if (reconnectTimeoutRef.current) {
//         clearTimeout(reconnectTimeoutRef.current);
//       }
//     };
//   }, []);

//   // Subscribe to match updates
//   useEffect(() => {
//     if (!socket || !currentMatch || !currentMatch.match?.eventId) return;
    
//     // Only subscribe if the socket is open
//     if (socket.readyState === WebSocket.OPEN) {
//       // Unsubscribe from previous match if any
//       if (activeSubscription && activeSubscription !== currentMatch.match.eventId) {
//         socket.send(`42["leave",["${activeSubscription}"]]`);
//         console.log(`Unsubscribed from: ${activeSubscription}`);
//       }
      
//       // Subscribe to new match
//       const eventId = currentMatch.match.eventId;
//       socket.send(`42["sub","${eventId}"]`);
//       console.log(`Subscribed to: ${eventId}`);
//       setActiveSubscription(eventId);
//     }
//   }, [socket, currentMatch]);

//   // Handle match odds updates
//   const handleMatchOddsUpdate = (data) => {
//     if (!currentMatch || !data || !Array.isArray(data)) return;
    
//     const updatedMatch = { ...currentMatch };
    
//     // Process each market update
//     data.forEach(marketData => {
//       if (!marketData.mid) return;
      
//       // Find the market to update
//       const marketIndex = updatedMatch.markets.findIndex(m => m.marketId === marketData.mid);
//       if (marketIndex === -1) return;
      
//       const market = { ...updatedMatch.markets[marketIndex] };
      
//       // Update market status
//       if (marketData.st) {
//         market.status = marketData.st;
//       }
      
//       // Update runners
//       if (marketData.runners && Array.isArray(marketData.runners)) {
//         marketData.runners.forEach(runnerUpdate => {
//           const runnerIndex = market.runners.findIndex(r => r.sid === runnerUpdate.sid);
//           if (runnerIndex === -1) return;
          
//           market.runners[runnerIndex] = {
//             ...market.runners[runnerIndex],
//             ex: runnerUpdate.ex || market.runners[runnerIndex].ex
//           };
//         });
//       }
      
//       updatedMatch.markets[marketIndex] = market;
//     });
    
//     setCurrentMatch(updatedMatch);
//   };

//   // Handle bookmaker updates
//   const handleBookmakerUpdate = (data) => {
//     if (!currentMatch || !data || !Array.isArray(data)) return;
    
//     const updatedMatch = { ...currentMatch };
    
//     data.forEach(bookmakerData => {
//       if (!bookmakerData.eid || !bookmakerData.ml?.updated) return;
      
//       bookmakerData.ml.updated.forEach(bookmaker => {
//         if (!bookmaker.mi) return;
        
//         const bookmakerIndex = updatedMatch.bookmakers.findIndex(b => b.marketId === bookmaker.mi);
//         if (bookmakerIndex === -1) return;
        
//         const updatedBookmaker = { ...updatedMatch.bookmakers[bookmakerIndex] };
        
//         // Update status
//         if (bookmaker.sn) {
//           updatedBookmaker.status = bookmaker.sn;
//         }
        
//         // Update selections
//         if (bookmaker.sl && Array.isArray(bookmaker.sl)) {
//           bookmaker.sl.forEach(selUpdate => {
//             const selIndex = updatedBookmaker.selections.findIndex(s => s.id === selUpdate.si);
//             if (selIndex === -1) return;
            
//             updatedBookmaker.selections[selIndex] = {
//               ...updatedBookmaker.selections[selIndex],
//               status: selUpdate.ss || updatedBookmaker.selections[selIndex].status,
//               backOdds: selUpdate.b ?? updatedBookmaker.selections[selIndex].backOdds,
//               layOdds: selUpdate.l ?? updatedBookmaker.selections[selIndex].layOdds
//             };
//           });
//         }
        
//         updatedMatch.bookmakers[bookmakerIndex] = updatedBookmaker;
//       });
//     });
    
//     setCurrentMatch(updatedMatch);
//   };

//   // Handle fancy market updates
//   const handleFancyUpdate = (data) => {
//     if (!currentMatch || !data || !Array.isArray(data)) return;
    
//     const updatedMatch = { ...currentMatch };
    
//     data.forEach(fancyData => {
//       if (!fancyData.eid || !fancyData.ml?.updated) return;
      
//       fancyData.ml.updated.forEach(fancy => {
//         if (!fancy.mi) return;
        
//         const fancyIndex = updatedMatch.fancyMarkets.findIndex(f => f.marketId === fancy.mi);
//         if (fancyIndex === -1) return;
        
//         const updatedFancy = { ...updatedMatch.fancyMarkets[fancyIndex] };
        
//         // Update odds
//         if (fancy.on !== undefined) {
//           updatedFancy.odds = {
//             ...updatedFancy.odds,
//             no: fancy.on
//           };
//         }
//         if (fancy.oy !== undefined) {
//           updatedFancy.odds = {
//             ...updatedFancy.odds,
//             yes: fancy.oy
//           };
//         }
        
//         // Update run values
//         if (fancy.rn !== undefined) {
//           updatedFancy.runValue = {
//             ...updatedFancy.runValue,
//             no: fancy.rn
//           };
//         }
//         if (fancy.ry !== undefined) {
//           updatedFancy.runValue = {
//             ...updatedFancy.runValue,
//             yes: fancy.ry
//           };
//         }
        
//         updatedMatch.fancyMarkets[fancyIndex] = updatedFancy;
//       });
//     });
    
//     setCurrentMatch(updatedMatch);
//   };

//   // Fetch all sports - use predefined data instead of API call
//   const fetchSports = async () => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       // Use predefined sports data instead of API call
//       const sportsData = [
//         { id: '4', name: 'Cricket' },
//         { id: '1', name: 'Football' },
//         { id: '2', name: 'Tennis' },
//         { id: '7522', name: 'Basketball' },
//         { id: '7511', name: 'Baseball' },
//         { id: '27454574', name: 'Table Tennis' }
//       ];
      
//       setSports(sportsData);
//       console.log('Sports data loaded from predefined list:', sportsData);
//     } catch (err) {
//       setError('Failed to load sports data');
//       console.error('Error setting sports data:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch matches for a specific sport
//   const fetchMatches = async (sportId) => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       const matchesData = await getMatches(sportId);
//       console.log(`API response for sport ${sportId}:`, matchesData);
//       console.log(`Matches data structure:`, matchesData.data || []);
//       setMatches(matchesData.data || []);
//       return matchesData.data || [];
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to fetch matches');
//       console.error('Error fetching matches:', err);
//       return [];
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Helper function to get mock matches for a sport - keep as fallback
//   const getMockMatchesForSport = (sportId) => {
//     switch(sportId) {
//       case '1': // Football
//         return [
//           {
//             id: 'football1',
//             matchId: 'football1',
//             name: 'Arsenal v Chelsea',
//             event_date: new Date(Date.now() + 86400000).toISOString(), // tomorrow
//             league: { name: 'Premier League' },
//             status: 'upcoming'
//           },
//           {
//             id: 'football2',
//             matchId: 'football2',
//             name: 'PSG v Lyon',
//             event_date: new Date(Date.now() + 172800000).toISOString(), // day after tomorrow
//             league: { name: 'Ligue 1' },
//             status: 'upcoming'
//           }
//         ];
//       case '2': // Tennis
//         return [
//           {
//             id: 'tennis1',
//             matchId: 'tennis1',
//             name: 'Djokovic v Nadal',
//             event_date: new Date(Date.now() + 86400000).toISOString(),
//             league: { name: 'Wimbledon' },
//             status: 'upcoming'
//           }
//         ];
//       case '4': // Cricket
//         return [
//           {
//             id: 'cricket1',
//             matchId: 'cricket1',
//             name: 'India v Australia',
//             event_date: new Date(Date.now() + 86400000).toISOString(),
//             league: { name: 'T20 World Cup' },
//             status: 'upcoming'
//           }
//         ];
//       case '7522': // Basketball
//         return [
//           {
//             id: 'basketball1',
//             matchId: 'basketball1',
//             name: 'Lakers v Celtics',
//             event_date: new Date(Date.now() + 86400000).toISOString(),
//             league: { name: 'NBA' },
//             status: 'upcoming'
//           }
//         ];
//       case '7511': // Baseball
//         return [
//           {
//             id: 'baseball1',
//             matchId: 'baseball1',
//             name: 'Yankees v Red Sox',
//             event_date: new Date(Date.now() + 86400000).toISOString(),
//             league: { name: 'MLB' },
//             status: 'upcoming'
//           }
//         ];
//       case '27454574': // Table Tennis
//         return [
//           {
//             id: 'tabletennis1',
//             matchId: 'tabletennis1',
//             name: 'Ma Long v Fan Zhendong',
//             event_date: new Date(Date.now() + 86400000).toISOString(),
//             league: { name: 'World Championship' },
//             status: 'upcoming'
//           }
//         ];
//       default:
//         return [];
//     }
//   };

//   // Fetch match details
//   const fetchMatchDetails = async (eventId) => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       const matchData = await getMatchDetails(eventId);
      
//       console.log('Raw match data:', matchData);
      
//       // Check if match data exists
//       if (!matchData || !matchData.match) {
//         console.error('Invalid match data structure:', matchData);
//         setError('Invalid match data received from server');
//         setLoading(false);
//         return;
//       }
      
//       // Structure the match data properly with null checks
//       const structuredMatch = {
//         match: matchData.match,
//         markets: [],
//         fancyMarkets: [],
//         bookmakers: [],
//         upcoming: []
//       };
      
//       // Add match odds market if marketId exists
//       if (matchData.match.marketId) {
//         structuredMatch.markets.push({
//           marketId: matchData.match.marketId,
//           marketName: "Match Odds",
//           question: "Who Will Win The Match?",
//           status: matchData.match.status || "OPEN",
//           minStake: matchData.match.minStake || 100,
//           maxStake: matchData.match.maxStake || 10000,
//           betDelay: matchData.match.betDelay || 0,
//           runners: matchData.match.runners || []
//         });
//       }
      
//       // Add additional markets if they exist
//       if (matchData.markets && Array.isArray(matchData.markets)) {
//         structuredMatch.markets = [...structuredMatch.markets, ...matchData.markets];
//       }
      
//       // Add fancy markets if they exist
//       if (matchData.fancyMarkets && Array.isArray(matchData.fancyMarkets)) {
//         structuredMatch.fancyMarkets = matchData.fancyMarkets;
//       }
      
//       // Add bookmakers if they exist
//       if (matchData.bookmakers && Array.isArray(matchData.bookmakers)) {
//         structuredMatch.bookmakers = matchData.bookmakers;
//       }
      
//       // Add upcoming matches if they exist
//       if (matchData.upcoming && Array.isArray(matchData.upcoming)) {
//         structuredMatch.upcoming = matchData.upcoming;
//       }
      
//       console.log('Structured match data:', structuredMatch);
//       setCurrentMatch(structuredMatch);
      
//       // Subscribe to the match using WebSocket
//       if (socket && socket.readyState === WebSocket.OPEN) {
//         // Unsubscribe from previous match if any
//         if (activeSubscription && activeSubscription !== eventId) {
//           socket.send(`42["leave",["${activeSubscription}"]]`);
//           console.log(`Unsubscribed from: ${activeSubscription}`);
//         }
        
//         // Subscribe to the match
//         socket.send(`42["sub","${eventId}"]`);
//         console.log(`Subscribed to: ${eventId}`);
//         setActiveSubscription(eventId);
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to fetch match details');
//       console.error('Error fetching match details:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Clear current match
//   const clearCurrentMatch = () => {
//     // Unsubscribe from current match
//     if (socket && activeSubscription) {
//       // Use the correct format for unsubscribing
//       socket.send(`42["leave",["${activeSubscription}"]]`);
      
//       // Remove event listener
//       socket.onmessage = null;
      
//       setActiveSubscription(null);
//     }
    
//     setCurrentMatch(null);
//   };

//   // Format odds for display
//   const formatOdds = (odds) => {
//     return parseFloat(odds).toFixed(2);
//   };

//   // Format stake size for display
//   const formatStakeSize = (size) => {
//     if (!size) return '-';
//     const num = parseFloat(size);
//     if (num >= 1000000) {
//       return `${(num / 1000000).toFixed(1)}M`;
//     }
//     if (num >= 1000) {
//       return `${(num / 1000).toFixed(1)}K`;
//     }
//     return num.toFixed(0);
//   };

//   // Add a function to format matches for the MatchList component
//   const formatMatchesForUI = (matches) => {
//     if (!matches || !Array.isArray(matches)) {
//       console.log('No matches data or not an array:', matches);
//       return [];
//     }
    
//     console.log('Formatting matches, count:', matches.length);
    
//     return matches.map(match => {
//       // Initialize with default values
//       const defaultMatch = {
//         id: match?.id || match?.matchId || match?.event_id || 'unknown',
//         title: match?.name || match?.event_name || 'Unknown Match',
//         competition: match?.competition || match?.league_name || match?.league?.name || match?.competition_name || '',
//         date: 'TBD',
//         time: 'TBD',
//         isLive: match?.inplay || match?.isMatchLive || match?.is_live || false,
//         hasStream: match?.has_stream || false,
//         odds: {
//           '1': '-',
//           'X': '-',
//           '2': '-'
//         },
//         backOdds: {
//           '1': '-',
//           'X': '-',
//           '2': '-'
//         }
//       };

//       // If match is undefined, return default
//       if (!match) {
//         console.log('Match is undefined');
//         return defaultMatch;
//       }

//       console.log('Processing match ID:', match.id || match.matchId || match.event_id);
      
//       // Format date and time
//       const dateField = match.event_date || match.date || match.time;
//       if (dateField) {
//         try {
//           const matchDate = new Date(dateField);
//           defaultMatch.date = matchDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
//           defaultMatch.time = matchDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
//         } catch (e) {
//           console.warn('Error formatting date:', e);
//         }
//       }
      
//       // Try to extract odds from runners (cricket API structure)
//       if (match.runners && Array.isArray(match.runners) && match.runners.length > 0) {
//         console.log('Match has runners, count:', match.runners.length);
        
//         // Cricket API structure - extract from runners
//         if (match.runners.length >= 2) {
//           try {
//             // First runner (home team)
//             const runner1 = match.runners[0];
//             if (runner1 && runner1.ex && runner1.ex.b && runner1.ex.b.length > 0) {
//               const price = parseFloat(runner1.ex.b[0].p);
//               console.log('Runner 1 price:', price);
//               if (!isNaN(price)) {
//                 defaultMatch.odds['1'] = price.toFixed(2);
//                 defaultMatch.backOdds['1'] = (price * 1.05).toFixed(2);
//               }
//             }
            
//             // Second runner (away team)
//             const runner2 = match.runners[1];
//             if (runner2 && runner2.ex && runner2.ex.b && runner2.ex.b.length > 0) {
//               const price = parseFloat(runner2.ex.b[0].p);
//               console.log('Runner 2 price:', price);
//               if (!isNaN(price)) {
//                 defaultMatch.odds['2'] = price.toFixed(2);
//                 defaultMatch.backOdds['2'] = (price * 1.05).toFixed(2);
//               }
//             }
            
//             // For cricket, there's no draw (X) option typically
//             defaultMatch.odds['X'] = '-';
//             defaultMatch.backOdds['X'] = '-';
//           } catch (e) {
//             console.warn('Error extracting odds from runners:', e);
//           }
//         }
//       } 
//       // Try to extract odds from markets
//       else if (match.markets && match.markets.length > 0) {
//         console.log('Match has markets:', match.markets);
//         const matchOddsMarket = match.markets.find(m => 
//           m.name === 'Match Odds' || m.name === '1X2' || m.name.includes('Winner')
//         );
        
//         if (matchOddsMarket && matchOddsMarket.runners) {
//           matchOddsMarket.runners.forEach((runner, index) => {
//             if (index === 0 && runner.price) defaultMatch.odds['1'] = runner.price.toFixed(2);
//             if (index === 1 && runner.price) defaultMatch.odds['X'] = runner.price.toFixed(2);
//             if (index === 2 && runner.price) defaultMatch.odds['2'] = runner.price.toFixed(2);
            
//             // Back odds (slightly higher)
//             if (index === 0 && runner.price) defaultMatch.backOdds['1'] = (runner.price * 1.05).toFixed(2);
//             if (index === 1 && runner.price) defaultMatch.backOdds['X'] = (runner.price * 1.05).toFixed(2);
//             if (index === 2 && runner.price) defaultMatch.backOdds['2'] = (runner.price * 1.05).toFixed(2);
//           });
//         }
//       } else if (match.odds) {
//         // Direct odds structure
//         console.log('Match has direct odds:', match.odds);
//         if (match.odds['1']) defaultMatch.odds['1'] = match.odds['1'].toFixed(2);
//         if (match.odds['X']) defaultMatch.odds['X'] = match.odds['X'].toFixed(2);
//         if (match.odds['2']) defaultMatch.odds['2'] = match.odds['2'].toFixed(2);
        
//         // Back odds
//         if (match.odds['1']) defaultMatch.backOdds['1'] = (match.odds['1'] * 1.05).toFixed(2);
//         if (match.odds['X']) defaultMatch.backOdds['X'] = (match.odds['X'] * 1.05).toFixed(2);
//         if (match.odds['2']) defaultMatch.backOdds['2'] = (match.odds['2'] * 1.05).toFixed(2);
//       }
      
//       console.log('Formatted match:', defaultMatch);
//       return defaultMatch;
//     });
//   };

//   // Add a function to fetch inplay matches
//   const fetchInplayMatches = async () => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       const response = await api.get('/api/matches/inplay');
//       const inplayMatches = response.data.data || [];
//       console.log('API response for inplay matches:', response.data);
//       console.log('Inplay matches data structure:', inplayMatches);
//       return inplayMatches;
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to fetch in-play matches');
//       console.error('Error fetching in-play matches:', err);
//       return [];
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Context value
//   const value = {
//     sports,
//     matches,
//     currentMatch,
//     loading,
//     error,
//     fetchSports,
//     fetchMatches,
//     fetchMatchDetails,
//     clearCurrentMatch,
//     formatOdds,
//     formatStakeSize,
//     formatMatchesForUI,
//     fetchInplayMatches
//   };

//   return (
//     <BettingContext.Provider value={value}>
//       {children}
//     </BettingContext.Provider>
//   );
// };

// export default BettingContext; 




import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import api, { getMatches, getMatchDetails } from '../utils/api';

const BettingContext = createContext();

export const useBetting = () => useContext(BettingContext);

// Get the API URL from environment variables
const API_URL = process.env.REACT_APP_API_URL || 'https://reddybackend.vercel.app';

export const BettingProvider = ({ children }) => {
  // State
  const [sports, setSports] = useState([]);
  const [matches, setMatches] = useState([]);
  const [currentMatch, setCurrentMatch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const [activeSubscription, setActiveSubscription] = useState(null);
  const reconnectTimeoutRef = useRef(null);

  // Initialize WebSocket connection
  useEffect(() => {
    // Use the WebSocket server URL from environment or default to zplay1.in
    const wsServerUrl = process.env.REACT_APP_WS_URL || 'wss://zplay1.in/socket.io/?EIO=4&transport=websocket';
    
    const connectWebSocket = () => {
      try {
        const ws = new WebSocket(wsServerUrl);
        
        ws.onopen = () => {
          console.log('WebSocket connected successfully');
          // Send initial connection message
          ws.send('40');
          console.log('Sent: 40');
        };
        
        ws.onmessage = (event) => {
          const message = event.data;
          console.log('Received:', message);
          
          // Handle different message types
          try {
            // Skip heartbeat messages
            if (message === '2') {
              // Respond to ping with pong
              ws.send('3');
              return;
            }
            
            // Handle connection acknowledgment
            if (message.startsWith('40')) {
              // If we have an active subscription, resubscribe after reconnection
              if (activeSubscription) {
                ws.send(`42["sub","${activeSubscription}"]`);
                console.log(`Resubscribed to: ${activeSubscription}`);
              }
              return;
            }
            
            // Handle data messages
            if (message.startsWith('42')) {
              const jsonStr = message.substring(2);
              const [eventName, eventData] = JSON.parse(jsonStr);
              
              // Process different event types
              switch (eventName) {
                case 'App\\Events\\SportsBroadcastData':
                  handleMatchOddsUpdate(eventData);
                  break;
                case 'App\\Events\\BroadcastBookmaker':
                  handleBookmakerUpdate(eventData);
                  break;
                case 'App\\Events\\BroadcastFancy':
                  handleFancyUpdate(eventData);
                  break;
                default:
                  console.log('Unhandled event type:', eventName);
              }
            }
          } catch (err) {
            console.error('Error processing WebSocket message:', err);
          }
        };
        
        ws.onerror = (error) => {
          console.error('WebSocket Error:', error);
        };
        
        ws.onclose = () => {
          console.log('WebSocket Disconnected. Reconnecting in 5 seconds...');
          // Clear any existing timeout
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
          }
          // Set a new reconnection timeout
          reconnectTimeoutRef.current = setTimeout(connectWebSocket, 5000);
        };
        
        setSocket(ws);
      } catch (err) {
        console.error('Failed to create WebSocket connection:', err);
        // Attempt to reconnect
        reconnectTimeoutRef.current = setTimeout(connectWebSocket, 5000);
      }
    };
    
    // Initial connection
    connectWebSocket();
    
    // Cleanup on unmount
    return () => {
      if (socket) {
        // Unsubscribe if needed
        if (activeSubscription) {
          socket.send(`42["leave",["${activeSubscription}"]]`);
        }
        socket.close();
      }
      
      // Clear any pending reconnection timeout
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  // Subscribe to match updates
  useEffect(() => {
    if (!socket || !currentMatch || !currentMatch.match?.eventId) return;
    
    // Only subscribe if the socket is open
    if (socket.readyState === WebSocket.OPEN) {
      // Unsubscribe from previous match if any
      if (activeSubscription && activeSubscription !== currentMatch.match.eventId) {
        socket.send(`42["leave",["${activeSubscription}"]]`);
        console.log(`Unsubscribed from: ${activeSubscription}`);
      }
      
      // Subscribe to new match
      const eventId = currentMatch.match.eventId;
      socket.send(`42["sub","${eventId}"]`);
      console.log(`Subscribed to: ${eventId}`);
      setActiveSubscription(eventId);
    }
  }, [socket, currentMatch]);

  // Handle match odds updates
  const handleMatchOddsUpdate = (data) => {
    if (!currentMatch || !data || !Array.isArray(data)) return;
    
    const updatedMatch = { ...currentMatch };
    
    // Process each market update
    data.forEach(marketData => {
      if (!marketData.mid) return;
      
      // Find the market to update
      const marketIndex = updatedMatch.markets.findIndex(m => m.marketId === marketData.mid);
      if (marketIndex === -1) return;
      
      const market = { ...updatedMatch.markets[marketIndex] };
      
      // Update market status
      if (marketData.st) {
        market.status = marketData.st;
      }
      
      // Update runners
      if (marketData.runners && Array.isArray(marketData.runners)) {
        marketData.runners.forEach(runnerUpdate => {
          const runnerIndex = market.runners.findIndex(r => r.sid === runnerUpdate.sid);
          if (runnerIndex === -1) return;
          
          market.runners[runnerIndex] = {
            ...market.runners[runnerIndex],
            ex: runnerUpdate.ex || market.runners[runnerIndex].ex
          };
        });
      }
      
      updatedMatch.markets[marketIndex] = market;
    });
    
    setCurrentMatch(updatedMatch);
  };

  // Handle bookmaker updates
  const handleBookmakerUpdate = (data) => {
    if (!currentMatch || !data || !Array.isArray(data)) return;
    
    const updatedMatch = { ...currentMatch };
    
    data.forEach(bookmakerData => {
      if (!bookmakerData.eid || !bookmakerData.ml?.updated) return;
      
      bookmakerData.ml.updated.forEach(bookmaker => {
        if (!bookmaker.mi) return;
        
        const bookmakerIndex = updatedMatch.bookmakers.findIndex(b => b.marketId === bookmaker.mi);
        if (bookmakerIndex === -1) return;
        
        const updatedBookmaker = { ...updatedMatch.bookmakers[bookmakerIndex] };
        
        // Update status
        if (bookmaker.sn) {
          updatedBookmaker.status = bookmaker.sn;
        }
        
        // Update selections
        if (bookmaker.sl && Array.isArray(bookmaker.sl)) {
          bookmaker.sl.forEach(selUpdate => {
            const selIndex = updatedBookmaker.selections.findIndex(s => s.id === selUpdate.si);
            if (selIndex === -1) return;
            
            updatedBookmaker.selections[selIndex] = {
              ...updatedBookmaker.selections[selIndex],
              status: selUpdate.ss || updatedBookmaker.selections[selIndex].status,
              backOdds: selUpdate.b ?? updatedBookmaker.selections[selIndex].backOdds,
              layOdds: selUpdate.l ?? updatedBookmaker.selections[selIndex].layOdds
            };
          });
        }
        
        updatedMatch.bookmakers[bookmakerIndex] = updatedBookmaker;
      });
    });
    
    setCurrentMatch(updatedMatch);
  };

  // Handle fancy market updates
  const handleFancyUpdate = (data) => {
    if (!currentMatch || !data || !Array.isArray(data)) return;
    
    const updatedMatch = { ...currentMatch };
    
    data.forEach(fancyData => {
      if (!fancyData.eid || !fancyData.ml?.updated) return;
      
      fancyData.ml.updated.forEach(fancy => {
        if (!fancy.mi) return;
        
        const fancyIndex = updatedMatch.fancyMarkets.findIndex(f => f.marketId === fancy.mi);
        if (fancyIndex === -1) return;
        
        const updatedFancy = { ...updatedMatch.fancyMarkets[fancyIndex] };
        
        // Update odds
        if (fancy.on !== undefined) {
          updatedFancy.odds = {
            ...updatedFancy.odds,
            no: fancy.on
          };
        }
        if (fancy.oy !== undefined) {
          updatedFancy.odds = {
            ...updatedFancy.odds,
            yes: fancy.oy
          };
        }
        
        // Update run values
        if (fancy.rn !== undefined) {
          updatedFancy.runValue = {
            ...updatedFancy.runValue,
            no: fancy.rn
          };
        }
        if (fancy.ry !== undefined) {
          updatedFancy.runValue = {
            ...updatedFancy.runValue,
            yes: fancy.ry
          };
        }
        
        updatedMatch.fancyMarkets[fancyIndex] = updatedFancy;
      });
    });
    
    setCurrentMatch(updatedMatch);
  };

  // Fetch all sports - use predefined data instead of API call
  const fetchSports = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Use predefined sports data instead of API call
      const sportsData = [
        { id: '4', name: 'Cricket' },
        { id: '1', name: 'Football' },
        { id: '2', name: 'Tennis' },
        { id: '7522', name: 'Basketball' },
        { id: '7511', name: 'Baseball' },
        { id: '27454574', name: 'Table Tennis' }
      ];
      
      setSports(sportsData);
      console.log('Sports data loaded from predefined list:', sportsData);
    } catch (err) {
      setError('Failed to load sports data');
      console.error('Error setting sports data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch matches for a specific sport
  const fetchMatches = async (sportId) => {
    setLoading(true);
    setError(null);
    
    try {
      const matchesData = await getMatches(sportId);
      console.log(`API response for sport ${sportId}:`, matchesData);
      console.log(`Matches data structure:`, matchesData.data || []);
      setMatches(matchesData.data || []);
      return matchesData.data || [];
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch matches');
      console.error('Error fetching matches:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get mock matches for a sport - keep as fallback
  const getMockMatchesForSport = (sportId) => {
    switch(sportId) {
      case '1': // Football
        return [
          {
            id: 'football1',
            matchId: 'football1',
            name: 'Arsenal v Chelsea',
            event_date: new Date(Date.now() + 86400000).toISOString(), // tomorrow
            league: { name: 'Premier League' },
            status: 'upcoming'
          },
          {
            id: 'football2',
            matchId: 'football2',
            name: 'PSG v Lyon',
            event_date: new Date(Date.now() + 172800000).toISOString(), // day after tomorrow
            league: { name: 'Ligue 1' },
            status: 'upcoming'
          }
        ];
      case '2': // Tennis
        return [
          {
            id: 'tennis1',
            matchId: 'tennis1',
            name: 'Djokovic v Nadal',
            event_date: new Date(Date.now() + 86400000).toISOString(),
            league: { name: 'Wimbledon' },
            status: 'upcoming'
          }
        ];
      case '4': // Cricket
        return [
          {
            id: 'cricket1',
            matchId: 'cricket1',
            name: 'India v Australia',
            event_date: new Date(Date.now() + 86400000).toISOString(),
            league: { name: 'T20 World Cup' },
            status: 'upcoming'
          }
        ];
      case '7522': // Basketball
        return [
          {
            id: 'basketball1',
            matchId: 'basketball1',
            name: 'Lakers v Celtics',
            event_date: new Date(Date.now() + 86400000).toISOString(),
            league: { name: 'NBA' },
            status: 'upcoming'
          }
        ];
      case '7511': // Baseball
        return [
          {
            id: 'baseball1',
            matchId: 'baseball1',
            name: 'Yankees v Red Sox',
            event_date: new Date(Date.now() + 86400000).toISOString(),
            league: { name: 'MLB' },
            status: 'upcoming'
          }
        ];
      case '27454574': // Table Tennis
        return [
          {
            id: 'tabletennis1',
            matchId: 'tabletennis1',
            name: 'Ma Long v Fan Zhendong',
            event_date: new Date(Date.now() + 86400000).toISOString(),
            league: { name: 'World Championship' },
            status: 'upcoming'
          }
        ];
      default:
        return [];
    }
  };

  // Fetch match details
  const fetchMatchDetails = async (eventId) => {
    setLoading(true);
    setError(null);
    
    try {
      const matchData = await getMatchDetails(eventId);
      
      console.log('Raw match data:', matchData);
      
      // Check if match data exists
      if (!matchData || !matchData.match) {
        console.error('Invalid match data structure:', matchData);
        setError('Invalid match data received from server');
        setLoading(false);
        return;
      }
      
      // Structure the match data properly with null checks
      const structuredMatch = {
        match: matchData.match,
        markets: [],
        fancyMarkets: [],
        bookmakers: [],
        upcoming: []
      };
      
      // Add match odds market if marketId exists
      if (matchData.match.marketId) {
        structuredMatch.markets.push({
          marketId: matchData.match.marketId,
          marketName: "Match Odds",
          question: "Who Will Win The Match?",
          status: matchData.match.status || "OPEN",
          minStake: matchData.match.minStake || 100,
          maxStake: matchData.match.maxStake || 10000,
          betDelay: matchData.match.betDelay || 0,
          runners: matchData.match.runners || []
        });
      }
      
      // Add additional markets if they exist
      if (matchData.markets && Array.isArray(matchData.markets)) {
        structuredMatch.markets = [...structuredMatch.markets, ...matchData.markets];
      }
      
      // Add fancy markets if they exist
      if (matchData.fancyMarkets && Array.isArray(matchData.fancyMarkets)) {
        structuredMatch.fancyMarkets = matchData.fancyMarkets;
      }
      
      // Add bookmakers if they exist
      if (matchData.bookmakers && Array.isArray(matchData.bookmakers)) {
        structuredMatch.bookmakers = matchData.bookmakers;
      }
      
      // Add upcoming matches if they exist
      if (matchData.upcoming && Array.isArray(matchData.upcoming)) {
        structuredMatch.upcoming = matchData.upcoming;
      }
      
      console.log('Structured match data:', structuredMatch);
      setCurrentMatch(structuredMatch);
      
      // Subscribe to the match using WebSocket
      if (socket && socket.readyState === WebSocket.OPEN) {
        // Unsubscribe from previous match if any
        if (activeSubscription && activeSubscription !== eventId) {
          socket.send(`42["leave",["${activeSubscription}"]]`);
          console.log(`Unsubscribed from: ${activeSubscription}`);
        }
        
        // Subscribe to the match
        socket.send(`42["sub","${eventId}"]`);
        console.log(`Subscribed to: ${eventId}`);
        setActiveSubscription(eventId);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch match details');
      console.error('Error fetching match details:', err);
    } finally {
      setLoading(false);
    }
  };

  // Clear current match
  const clearCurrentMatch = () => {
    // Unsubscribe from current match
    if (socket && activeSubscription) {
      // Use the correct format for unsubscribing
      socket.send(`42["leave",["${activeSubscription}"]]`);
      
      // Remove event listener
      socket.onmessage = null;
      
      setActiveSubscription(null);
    }
    
    setCurrentMatch(null);
  };

  // Format odds for display
  const formatOdds = (odds) => {
    return parseFloat(odds).toFixed(2);
  };

  // Format stake size for display
  const formatStakeSize = (size) => {
    if (!size) return '-';
    const num = parseFloat(size);
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toFixed(0);
  };

  // Add a function to format matches for the MatchList component
  const formatMatchesForUI = (matches) => {
    if (!matches || !Array.isArray(matches)) {
      console.log('No matches data or not an array:', matches);
      return [];
    }
    
    console.log('Formatting matches, count:', matches.length);
    
    return matches.map(match => {
      // Initialize with default values
      const defaultMatch = {
        id: match?.id || match?.matchId || match?.event_id || 'unknown',
        title: match?.name || match?.event_name || 'Unknown Match',
        competition: match?.competition || match?.league_name || match?.league?.name || match?.competition_name || '',
        date: 'TBD',
        time: 'TBD',
        isLive: match?.inplay || match?.isMatchLive || match?.is_live || false,
        hasStream: match?.has_stream || false,
        odds: {
          '1': '-',
          'X': '-',
          '2': '-'
        },
        backOdds: {
          '1': '-',
          'X': '-',
          '2': '-'
        }
      };

      // If match is undefined, return default
      if (!match) {
        console.log('Match is undefined');
        return defaultMatch;
      }

      console.log('Processing match ID:', match.id || match.matchId || match.event_id);
      
      // Format date and time
      const dateField = match.event_date || match.date || match.time;
      if (dateField) {
        try {
          const matchDate = new Date(dateField);
          defaultMatch.date = matchDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
          defaultMatch.time = matchDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        } catch (e) {
          console.warn('Error formatting date:', e);
        }
      }
      
      // Try to extract odds from runners (cricket API structure)
      if (match.runners && Array.isArray(match.runners) && match.runners.length > 0) {
        console.log('Match has runners, count:', match.runners.length);
        
        // Cricket API structure - extract from runners
        if (match.runners.length >= 2) {
          try {
            // First runner (home team)
            const runner1 = match.runners[0];
            if (runner1 && runner1.ex && runner1.ex.b && runner1.ex.b.length > 0) {
              const price = parseFloat(runner1.ex.b[0].p);
              console.log('Runner 1 price:', price);
              if (!isNaN(price)) {
                defaultMatch.odds['1'] = price.toFixed(2);
                defaultMatch.backOdds['1'] = (price * 1.05).toFixed(2);
              }
            }
            
            // Second runner (away team)
            const runner2 = match.runners[1];
            if (runner2 && runner2.ex && runner2.ex.b && runner2.ex.b.length > 0) {
              const price = parseFloat(runner2.ex.b[0].p);
              console.log('Runner 2 price:', price);
              if (!isNaN(price)) {
                defaultMatch.odds['2'] = price.toFixed(2);
                defaultMatch.backOdds['2'] = (price * 1.05).toFixed(2);
              }
            }
            
            // For cricket, there's no draw (X) option typically
            defaultMatch.odds['X'] = '-';
            defaultMatch.backOdds['X'] = '-';
          } catch (e) {
            console.warn('Error extracting odds from runners:', e);
          }
        }
      } 
      // Try to extract odds from markets
      else if (match.markets && match.markets.length > 0) {
        console.log('Match has markets:', match.markets);
        const matchOddsMarket = match.markets.find(m => 
          m.name === 'Match Odds' || m.name === '1X2' || m.name.includes('Winner')
        );
        
        if (matchOddsMarket && matchOddsMarket.runners) {
          matchOddsMarket.runners.forEach((runner, index) => {
            if (index === 0 && runner.price) defaultMatch.odds['1'] = runner.price.toFixed(2);
            if (index === 1 && runner.price) defaultMatch.odds['X'] = runner.price.toFixed(2);
            if (index === 2 && runner.price) defaultMatch.odds['2'] = runner.price.toFixed(2);
            
            // Back odds (slightly higher)
            if (index === 0 && runner.price) defaultMatch.backOdds['1'] = (runner.price * 1.05).toFixed(2);
            if (index === 1 && runner.price) defaultMatch.backOdds['X'] = (runner.price * 1.05).toFixed(2);
            if (index === 2 && runner.price) defaultMatch.backOdds['2'] = (runner.price * 1.05).toFixed(2);
          });
        }
      } else if (match.odds) {
        // Direct odds structure
        console.log('Match has direct odds:', match.odds);
        if (match.odds['1']) defaultMatch.odds['1'] = match.odds['1'].toFixed(2);
        if (match.odds['X']) defaultMatch.odds['X'] = match.odds['X'].toFixed(2);
        if (match.odds['2']) defaultMatch.odds['2'] = match.odds['2'].toFixed(2);
        
        // Back odds
        if (match.odds['1']) defaultMatch.backOdds['1'] = (match.odds['1'] * 1.05).toFixed(2);
        if (match.odds['X']) defaultMatch.backOdds['X'] = (match.odds['X'] * 1.05).toFixed(2);
        if (match.odds['2']) defaultMatch.backOdds['2'] = (match.odds['2'] * 1.05).toFixed(2);
      }
      
      console.log('Formatted match:', defaultMatch);
      return defaultMatch;
    });
  };

  // Add a function to fetch inplay matches
  const fetchInplayMatches = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/api/matches/inplay');
      const inplayMatches = response.data.data || [];
      console.log('API response for inplay matches:', response.data);
      console.log('Inplay matches data structure:', inplayMatches);
      return inplayMatches;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch in-play matches');
      console.error('Error fetching in-play matches:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value = {
    sports,
    matches,
    currentMatch,
    loading,
    error,
    fetchSports,
    fetchMatches,
    fetchMatchDetails,
    clearCurrentMatch,
    formatOdds,
    formatStakeSize,
    formatMatchesForUI,
    fetchInplayMatches, 
    
  };

  return (
    <BettingContext.Provider value={value}>
      {children}
    </BettingContext.Provider>
  );
};

export default BettingContext; 

