// import React, { useEffect, useState } from "react";
// import styled from "styled-components";
// import axios from "axios";

// const TitliAdmin = () => {
//   const [images, setImages] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchImages(); // Fetch immediately on mount

//     // const interval = setInterval(fetchImages, 3000); // Fetch every 5 seconds

//     // return () => clearInterval(interval); // Cleanup interval on unmount
//   }, []);

//   // useEffect(() => {
//   //   const intervalId = setInterval(() => {
//   //     window.location.reload();
//   //   }, 6000);

//   //   return () => clearInterval(intervalId);
//   // }, []);


//   const fetchImages = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/titli/get-all-random-images`);
//       setImages(response.data.randomImages[0].Images);
//       console.log(response.data.randomImages[0].Images);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching images:", error);
//       setLoading(false);
//     }
//   };

//   const toggleIsAllowed = async (image) => {
//     try {
//       const updatedStatus = !image.isAllowed;
//       console.log(updatedStatus)
//       await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/titli/update-is-allowed`, {
//         image: image.image,
//         isAllowed: updatedStatus,
//       });
//       setImages((prev) =>
//         prev.map((img) =>
//           img.image === image.image ? { ...img, isAllowed: updatedStatus } : img
//         )
//       );
//     } catch (error) {
//       console.error("Error updating isAllowed status:", error);
//     }
//   };

//   return (
//     <Container>
//       <h1>Admin Panel - Manage Images</h1>
//       {loading ? (
//         <p>Loading images...</p>
//       ) : (
//         <Table>
//           <thead>
//             <tr>
//               <th>Image</th>
//               <th>Amount</th>
//               <th>Allowed</th>
//             </tr>
//           </thead>
//           <tbody>
//             {images.map((image) => (
//               <tr key={image.image}>
//                 <td>
//                   {/* <img src={`/images/${image.image}`} alt={image.image} /> */}
//                   {image.image}
//                 </td>
//                 <td>{image.amount}</td>
//                 <td>
//                   <ToggleSwitch
//                     isAllowed={image.isAllowed}
//                     onClick={() => toggleIsAllowed(image)}
//                   >
//                     {image.isAllowed ? "✅" : "❌"}
//                   </ToggleSwitch>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       )}
//     </Container>
//   );
// };

// export default TitliAdmin;

// const Container = styled.div`
//   background: #121212;
//   color: white;
//   padding: 20px;
//   text-align: center;
//   min-height: 100vh;
// `;

// const Table = styled.table`
//   width: 100%;
//   border-collapse: collapse;
//   margin-top: 20px;

//   th, td {
//     border: 1px solid #444;
//     padding: 10px;
//     text-align: center;
//   }

//   th {
//     background: #1e1e1e;
//   }

//   img {
//     width: 50px;
//     height: 50px;
//     border-radius: 5px;
//   }
// `;

// const ToggleSwitch = styled.button`
//   background: ${(props) => (props.isAllowed ? "#4caf50" : "#d32f2f")};
//   color: white;
//   border: none;
//   padding: 8px 15px;
//   border-radius: 5px;
//   cursor: pointer;
//   font-size: 16px;

//   &:hover {
//     opacity: 0.8;
//   }
// `;


import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import axios from "axios";

const TitliAdmin = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentBets, setRecentBets] = useState([]);
  const [gameState, setGameState] = useState({
    roundId: null,
    timeRemaining: 0,
    gamePhase: null,
    bettingOpen: false,
    status: 'Unknown',
    lastUpdate: Date.now()
  });
  const [lastUpdatedImage, setLastUpdatedImage] = useState(null);
  const [selectedWinner, setSelectedWinner] = useState(null);
  const pendingUpdates = useRef({});
  const lastRoundId = useRef(null);
  const healthCheckRetries = useRef(3);

  // Function to update image status with debounce
  const updateImageStatus = async (image, newStatus) => {
    try {
      setLastUpdatedImage({ image: image.image, status: newStatus });
      
      // Update local state immediately for responsive UI
      setImages(prevImages => prevImages.map(img => 
        img.image === image.image ? { ...img, isAllowed: newStatus } : img
      ));
      
      // Track this update in our pending updates
      pendingUpdates.current[image.image] = newStatus;
      
      // Make the API call
      const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/titli/update-is-allowed`, {
        image: image.image,
        isAllowed: newStatus
      });
      
      console.log(`Successfully updated ${image.image} to ${newStatus ? 'allowed' : 'not allowed'}`);
      
      // Remove from pending updates
      delete pendingUpdates.current[image.image];
    } catch (error) {
      console.error(`Failed to update ${image.image}:`, error);
      // Revert local state on error
      setImages(prevImages => prevImages.map(img => 
        img.image === image.image ? { ...img, isAllowed: !newStatus } : img
      ));
      delete pendingUpdates.current[image.image];
      alert(`Failed to update ${image.image}. Please try again.`);
    }
  };

  // Function to get the current round ID directly from the server - used when we need it for critical operations
  const getCurrentRoundId = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/titli/game-state`);
      if (response.data.gameState && response.data.gameState.roundId) {
        // Update the game state with the server data
        setGameState(prev => ({
          ...prev,
          ...response.data.gameState
        }));
        return response.data.gameState.roundId;
      } else {
        throw new Error("No valid round ID found in server response");
      }
    } catch (error) {
      console.error("Failed to get current round ID:", error);
      return null;
    }
  };

  // Function to set an image as winner for the current round
  const setAsWinner = async (image) => {
    try {
      setLoading(true);
      
      // Get the current round ID from our state
      const currentRoundId = gameState.roundId;
      
      if (!currentRoundId) {
        setLoading(false);
        alert("Could not determine the current round ID. The game may not be active.");
        return;
      }
      
      console.log('Setting winner with current round ID:', {
        image: image.image,
        imageNumber: image.imageNumber,
        roundId: currentRoundId
      });
      
      setSelectedWinner(image.image);
      
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/titli/set-winner`, {
        image: image.image,
        imageNumber: image.imageNumber,
        roundId: currentRoundId
      });
      
      console.log('Winner set response:', response.data);
      
      // Update game state if it's included in the response
      if (response.data.gameState) {
        setGameState(prev => ({
          ...prev,
          ...response.data.gameState,
          lastUpdate: Date.now(),
          status: response.data.gameState.gamePhase === 'betting' ? 
            (response.data.gameState.timeRemaining > 15 ? 'Betting Open' : 'Final Betting Phase') : 
            (response.data.gamePhase === 'result' ? 'Results Phase' : 'Unknown')
        }));
      }
      
      alert(`${image.image} has been set as the winner for round ${currentRoundId}`);
      setLoading(false);
    } catch (error) {
      console.error('Error setting winner:', error);
      console.error('Error details:', error.response?.data || 'No response data');
      alert(`Failed to set winner: ${error.response?.data?.message || error.message}`);
      setSelectedWinner(null);
      setLoading(false);
    }
  };

  // First check game health and force start if needed
  const checkGameHealth = async () => {
    try {
      console.log("Checking Titli game health...");
      const healthResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/titli/health`);
      
      // Store the response for debugging
      const responseData = healthResponse.data;
      console.log("Health check response:", responseData);
      
      if (responseData.status === 'Game initialized') {
        console.log("Game was just initialized by health check");
        // Wait a moment for the game to fully start
        setTimeout(() => {
          fetchGameState();
          fetchImages(false);
          fetchRecentBets();
        }, 1000);
      } else if (responseData.status === 'Game running') {
        console.log("Game health check passed, game is running");
      } else {
        console.warn("Unexpected health status:", responseData.status);
      }
      
      // Update game state from health check if available
      if (responseData.gameState && responseData.gameState.roundId) {
        console.log("Updating game state from health check");
        
        // Save the round ID to our ref for persistence
        lastRoundId.current = responseData.gameState.roundId;
        
        // Update the state
        setGameState(prev => ({
          ...prev,
          ...responseData.gameState
        }));
        
        // Refresh related data
        fetchImages(false);
        fetchRecentBets();
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Game health check failed:", error);
      
      // If we have retries left, try again after a short delay
      if (healthCheckRetries.current > 0) {
        console.log(`Retrying health check (${healthCheckRetries.current} retries left)...`);
        healthCheckRetries.current--;
        setTimeout(checkGameHealth, 2000);
        return false;
      }
      
      alert("Could not connect to game server. Please check your connection and refresh the page.");
      setLoading(false);
      return false;
    }
  };

  // Update the useEffect for game state management
  useEffect(() => {
    // Start with health check
    checkGameHealth();
    
    // More frequent updates for game state to ensure timer accuracy
    const gameStateInterval = setInterval(() => {
      if (gameState.roundId && gameState.timeRemaining > 0) {
        // Only update time remaining if we have a valid round
        setGameState(prev => ({
          ...prev,
          timeRemaining: Math.max(0, prev.timeRemaining - 1),
          lastUpdate: Date.now(),
          status: prev.gamePhase === 'betting' ? 
            (prev.timeRemaining > 15 ? 'Betting Open' : 'Final Betting Phase') : 
            (prev.gamePhase === 'result' ? 'Results Phase' : 'Unknown')
        }));
      } else if (!gameState.roundId || gameState.timeRemaining <= 0) {
        // If no valid round or timer expired, fetch fresh state
        fetchGameState();
      }
    }, 1000);
    
    // Fetch images more frequently
    const imagesInterval = setInterval(() => {
      if (gameState.roundId) {
        fetchImages(false);
      }
    }, 2000);
    
    // Fetch bets regularly
    const betsInterval = setInterval(() => {
      if (gameState.roundId) {
        fetchRecentBets();
      }
    }, 3000);
    
    // Health check interval
    const healthInterval = setInterval(() => {
      if (!gameState.roundId || gameState.timeRemaining <= 0) {
        checkGameHealth();
      }
    }, 5000);
    
    return () => {
      clearInterval(gameStateInterval);
      clearInterval(imagesInterval);
      clearInterval(betsInterval);
      clearInterval(healthInterval);
    };
  }, [gameState.roundId, gameState.timeRemaining]);

  // Add a new useEffect to handle round ID changes
  useEffect(() => {
    if (gameState.roundId && gameState.roundId !== lastRoundId.current) {
      console.log(`New round detected: ${gameState.roundId}`);
      lastRoundId.current = gameState.roundId;
      setSelectedWinner(null);
      
      // Update status based on new round
      setGameState(prev => ({
        ...prev,
        status: prev.gamePhase === 'betting' ? 
          (prev.timeRemaining > 15 ? 'Betting Open' : 'Final Betting Phase') : 
          (prev.gamePhase === 'result' ? 'Results Phase' : 'Unknown')
      }));
    }
  }, [gameState.roundId, gameState.gamePhase, gameState.timeRemaining]);

  // Add a new useEffect to handle game phase changes
  useEffect(() => {
    if (gameState.gamePhase) {
      setGameState(prev => ({
        ...prev,
        status: prev.gamePhase === 'betting' ? 
          (prev.timeRemaining > 15 ? 'Betting Open' : 'Final Betting Phase') : 
          (prev.gamePhase === 'result' ? 'Results Phase' : 'Unknown')
      }));
    }
  }, [gameState.gamePhase, gameState.timeRemaining]);

  const fetchGameState = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/titli/game-state`);
      
      if (response.data.gameState) {
        const newState = response.data.gameState;
        
        if (newState.roundId) {
          console.log(`Game state updated: Round ${newState.roundId}, Phase: ${newState.gamePhase}, Time: ${newState.timeRemaining}s`);
          
          // Only update if we have a new round or no current round
          if (!gameState.roundId || newState.roundId !== gameState.roundId) {
            setGameState(prev => ({
              ...prev,
              ...newState,
              lastUpdate: Date.now(),
              status: newState.gamePhase === 'betting' ? 
                (newState.timeRemaining > 15 ? 'Betting Open' : 'Final Betting Phase') : 
                (newState.gamePhase === 'result' ? 'Results Phase' : 'Unknown')
            }));
            
            // Store the round ID for persistence
            lastRoundId.current = newState.roundId;
          }
        }
      }
    } catch (error) {
      console.error("Error fetching game state:", error);
    }
  };

  const fetchImages = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/titli/get-all-random-images`);
      
      if (response.data.randomImages && response.data.randomImages.length > 0) {
        // Preserve any pending updates we're currently making
        const newImages = response.data.randomImages[0].Images.map(img => {
          if (pendingUpdates.current[img.image] !== undefined) {
            return { ...img, isAllowed: pendingUpdates.current[img.image] };
          }
          return img;
        });
        
        setImages(newImages);
      }
      
      // Update game state if available
      if (response.data.gameState) {
        setGameState(state => ({
          ...state,
          ...response.data.gameState
        }));
      }
      
      if (showLoading) setLoading(false);
    } catch (error) {
      console.error("Error fetching images:", error);
      if (showLoading) setLoading(false);
    }
  };

  const fetchRecentBets = async () => {
    try {
      // Get recent bets for current round
      if (gameState.roundId) {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/titli/bets/${gameState.roundId}`);
        if (response.data.bets) {
          setRecentBets(response.data.bets);
        }
      }
    } catch (error) {
      console.error("Error fetching recent bets:", error);
    }
  };

  const toggleIsAllowed = (image) => {
    // Only allow changes when game phase is appropriate
    if (gameState.timeRemaining > 15) {
      alert("You can only change image status during the last 15 seconds of a round");
      return;
    }
    
    // Prevent duplicate updates
    if (pendingUpdates.current[image.image] !== undefined) {
      alert("An update for this image is already in progress");
      return;
    }
    
    const newStatus = !image.isAllowed;
    updateImageStatus(image, newStatus);
  };

  const resetAllImagesToAllowed = async () => {
    try {
      setLoading(true);
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/titli/reset-all-images`);
      // Clear all pending updates
      pendingUpdates.current = {};
      // Fetch images again to update the UI
      await fetchImages();
      setLoading(false);
      alert("All images have been reset to allowed (✅)");
    } catch (error) {
      console.error("Error resetting images:", error);
      setLoading(false);
      alert("Failed to reset images. Please try again.");
    }
  };

  // Calculate total bets per image
  const calculateTotalBetsPerImage = () => {
    const totalBets = {};
    
    // Initialize with 0 for all images
    images.forEach(img => {
      totalBets[img.image] = 0;
    });
    
    // Sum up bets
    recentBets.forEach(bet => {
      if (bet.selectedCard && Array.isArray(bet.selectedCard)) {
        bet.selectedCard.forEach(card => {
          if (totalBets[card.image] !== undefined) {
            totalBets[card.image] += card.betAmount || 0;
          }
        });
      }
    });
    
    return totalBets;
  };
  
  const imageBets = calculateTotalBetsPerImage();

  // Add a manual refresh button
  const handleManualRefresh = async () => {
    setLoading(true);
    
    try {
      // First try the health check to ensure game is running
      const healthResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/titli/health`);
      console.log("Health check on manual refresh:", healthResponse.data);
      
      // Update game state from health data
      if (healthResponse.data.gameState) {
        setGameState(prev => ({
          ...prev,
          ...healthResponse.data.gameState
        }));
      }
      
      // Then refresh all data
      await fetchGameState();
      await fetchImages(true);
      await fetchRecentBets();
      
      setLoading(false);
    } catch (error) {
      console.error("Manual refresh failed:", error);
      setLoading(false);
      alert("Failed to refresh data. Please check your connection.");
    }
  };

  // Force start a new game round
  const forceStartNewRound = async () => {
    if (!window.confirm("Are you sure you want to force start a new game round? This will end the current round if one is in progress.")) {
      return;
    }
    
    setLoading(true);
    try {
      // Call special endpoint to force start a new round
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/titli/force-new-round`);
      
      if (response.data.success) {
        alert("New game round started successfully!");
        
        // Refresh all data
        await handleManualRefresh();
      } else {
        alert("Failed to start new round: " + (response.data.message || "Unknown error"));
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Force start new round failed:", error);
      setLoading(false);
      alert("Failed to start new round. Please check your connection.");
    }
  };

  // Format time remaining with warning colors
  const formatTimeRemaining = () => {
    const time = gameState.timeRemaining || 0;
    let color = '#4caf50'; // Green
    
    if (time <= 10) {
      color = '#ff5722'; // Red/orange
    } else if (time <= 20) {
      color = '#ff9800'; // Orange/yellow
    }
    
    return (
      <TimeDisplay color={color}>
        {time} seconds
      </TimeDisplay>
    );
  };

  // Check if we can set a winner based on current game state
  const canSetWinner = (image) => {
    // Basic validation to avoid unnecessary API calls
    if (!gameState.roundId || gameState.roundId === "Loading...") {
      return { valid: false, reason: "No active round detected" };
    }
    
    if (gameState.timeRemaining > 15) {
      return { valid: false, reason: "You can only set a winner during the last 15 seconds of a round" };
    }
    
    if (!image.isAllowed) {
      return { valid: false, reason: "Cannot set a disallowed image as winner" };
    }
    
    if (loading) {
      return { valid: false, reason: "Operation in progress" };
    }
    
    if (selectedWinner === image.image) {
      return { valid: false, reason: "This image is already selected as winner" };
    }
    
    return { valid: true };
  };

  // Game status indicator component
  const GameStatusIndicator = ({ gameState }) => {
    return (
      <StatusIndicator>
        <StatusDot color={gameState.status === 'Betting Open' ? '#4caf50' : 
                         gameState.status === 'Final Betting Phase' ? '#ff9800' : 
                         gameState.status === 'Results Phase' ? '#9c27b0' : '#ff5722'} />
        <StatusLabel>{gameState.status || 'Unknown'}</StatusLabel>
      </StatusIndicator>
    );
  };

  return (
    <Container>
      <Header>
        <div>
          <h1>Titli Par Admin Panel</h1>
          <GameStatusIndicator gameState={gameState} />
        </div>
        <GameStateInfo>
          <div>Round ID: {gameState.roundId || "Loading..."}</div>
          <div>Time Remaining: {formatTimeRemaining()}</div>
          <div>Phase: {gameState.gamePhase || "Loading..."}</div>
          <div>Betting: {gameState.bettingOpen ? "Open" : "Closed"}</div>
        </GameStateInfo>
        <ButtonGroup>
          <RefreshButton onClick={handleManualRefresh} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh Data"}
          </RefreshButton>
          <ResetButton onClick={resetAllImagesToAllowed} disabled={loading}>
            Reset All to Allowed (✅)
          </ResetButton>
          <ForceStartButton onClick={forceStartNewRound} disabled={loading}>
            Force Start New Round
          </ForceStartButton>
        </ButtonGroup>
      </Header>
      
      {loading ? (
        <LoadingMessage>Loading images...</LoadingMessage>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Amount</th>
              <th>Current Bets</th>
              <th>Status</th>
              <th>Make Winner</th>
            </tr>
          </thead>
          <tbody>
            {images.map((image) => (
              <tr key={image.image} className={lastUpdatedImage?.image === image.image ? "highlighted-row" : ""}>
                <td>
                  <ImageName>{image.image}</ImageName>
                  <ImageNumber>#{image.imageNumber}</ImageNumber>
                </td>
                <td>
                  <LiveAmount 
                    className={image.amount > 0 ? "has-bets" : ""}
                  >
                    {image.amount}
                  </LiveAmount>
                </td>
                <td>
                  <LiveAmount 
                    className={imageBets[image.image] > 0 ? "has-bets" : ""}
                  >
                    {imageBets[image.image] || 0}
                  </LiveAmount>
                </td>
                <td>
                  <ToggleSwitch
                    isAllowed={image.isAllowed}
                    onClick={() => toggleIsAllowed(image)}
                    disabled={gameState.timeRemaining > 15 || pendingUpdates.current[image.image] !== undefined}
                  >
                    {pendingUpdates.current[image.image] !== undefined ? 
                      "..." : 
                      (image.isAllowed ? "✅" : "❌")}
                  </ToggleSwitch>
                  {gameState.timeRemaining > 15 && (
                    <DisabledNote>
                      (Wait until 15 sec left to change)
                    </DisabledNote>
                  )}
                </td>
                <td>
                  {selectedWinner === image.image ? (
                    <WinnerButton 
                      onClick={() => alert("This image is already selected as winner")}
                      disabled={false}
                      isSelected={true}
                    >
                      Selected ✓
                    </WinnerButton>
                  ) : (
                    <WinnerButton 
                      onClick={() => {
                        const check = canSetWinner(image);
                        if (check.valid) {
                          setAsWinner(image);
                        } else {
                          alert(check.reason);
                        }
                      }}
                      disabled={!canSetWinner(image).valid}
                      isSelected={false}
                    >
                      Set as Winner (#{image.imageNumber})
                    </WinnerButton>
                  )}
                  {!image.isAllowed && (
                    <DisabledNote>
                      (Must be allowed to win)
                    </DisabledNote>
                  )}
                  {selectedWinner === image.image && (
                    <WinnerNote>
                      This image will be the winner!
                    </WinnerNote>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      
      <BetsSection>
        <SectionHeader>
          <h2>Recent Bets for Current Round</h2>
          <BetCount>Total bets: {recentBets.length}</BetCount>
        </SectionHeader>
        
        {recentBets.length > 0 ? (
          <BetsTable>
            <thead>
              <tr>
                <th>User</th>
                <th>Total Bet</th>
                <th>Images</th>
              </tr>
            </thead>
            <tbody>
              {recentBets.map((bet, index) => (
                <tr key={bet._id || index}>
                  <td>{bet.user}</td>
                  <td>{bet.totalBets}</td>
                  <td>
                    {bet.selectedCard && bet.selectedCard.map((card, i) => (
                      <BetImage key={i}>
                        {card.image} (₹{card.betAmount})
                      </BetImage>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </BetsTable>
        ) : (
          <NoBetsMessage>No bets placed for current round yet.</NoBetsMessage>
        )}
      </BetsSection>
    </Container>
  );
};

export default TitliAdmin;

const Container = styled.div`
  background: #121212;
  color: white;
  padding: 20px;
  text-align: center;
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  
  h1 {
    margin: 0;
  }
`;

const GameStateInfo = styled.div`
  display: flex;
  gap: 15px;
  background: #1e1e1e;
  padding: 10px;
  border-radius: 5px;
  flex-wrap: wrap;
`;

const TimeDisplay = styled.span`
  color: ${props => props.color};
  font-weight: bold;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const ResetButton = styled.button`
  background: #2196f3;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.7 : 1};
  font-weight: bold;
  
  &:hover {
    background: ${props => props.disabled ? '#2196f3' : '#0d8bf2'};
  }
`;

const RefreshButton = styled(ResetButton)`
  background: #4caf50;
  
  &:hover {
    background: ${props => props.disabled ? '#4caf50' : '#388e3c'};
  }
`;

const ForceStartButton = styled(ResetButton)`
  background: #ff9800;
  
  &:hover {
    background: ${props => props.disabled ? '#ff9800' : '#f57c00'};
  }
`;

const WinnerButton = styled.button`
  background: ${props => props.isSelected ? '#8e24aa' : '#ff9800'};
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  font-weight: bold;
  transition: background 0.3s;
  
  &:hover {
    background: ${props => props.disabled ? (props.isSelected ? '#8e24aa' : '#ff9800') : (props.isSelected ? '#7b1fa2' : '#f57c00')};
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;

  th, td {
    border: 1px solid #444;
    padding: 10px;
    text-align: center;
  }

  th {
    background: #1e1e1e;
  }
  
  .highlighted-row {
    animation: highlight 2s ease-in-out;
  }
  
  @keyframes highlight {
    0% { background-color: rgba(33, 150, 243, 0.3); }
    100% { background-color: transparent; }
  }
`;

const LiveAmount = styled.div`
  font-weight: bold;
  transition: background-color 0.3s;
  padding: 5px;
  border-radius: 4px;
  
  &.has-bets {
    background-color: rgba(76, 175, 80, 0.2);
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0% { background-color: rgba(76, 175, 80, 0.1); }
    50% { background-color: rgba(76, 175, 80, 0.3); }
    100% { background-color: rgba(76, 175, 80, 0.1); }
  }
`;

const LoadingMessage = styled.div`
  padding: 20px;
  background: #1e1e1e;
  border-radius: 5px;
  margin: 20px 0;
`;

const ImageName = styled.div`
  font-family: monospace;
  font-size: 14px;
`;

const ImageNumber = styled.div`
  font-size: 12px;
  color: #999;
`;

const ToggleSwitch = styled.button`
  background: ${(props) => (props.isAllowed ? "#4caf50" : "#d32f2f")};
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  font-size: 16px;
  opacity: ${(props) => (props.disabled ? "0.5" : "1")};
  min-width: 60px;

  &:hover {
    opacity: ${(props) => (props.disabled ? "0.5" : "0.8")};
  }
`;

const DisabledNote = styled.div`
  font-size: 12px;
  color: #ff9800;
  margin-top: 5px;
`;

const BetsSection = styled.div`
  margin-top: 40px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  
  h2 {
    margin: 0;
  }
`;

const BetCount = styled.div`
  background: #1e1e1e;
  padding: 5px 10px;
  border-radius: 5px;
  font-weight: bold;
`;

const BetsTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    border: 1px solid #444;
    padding: 10px;
    text-align: left;
  }

  th {
    background: #1e1e1e;
  }
`;

const BetImage = styled.div`
  display: inline-block;
  background: #333;
  padding: 5px;
  margin: 3px;
  border-radius: 4px;
  font-size: 12px;
`;

const NoBetsMessage = styled.div`
  padding: 20px;
  background: #1e1e1e;
  border-radius: 5px;
`;

const WinnerNote = styled.div`
  font-size: 12px;
  color: #4caf50;
  margin-top: 5px;
  font-weight: bold;
  animation: pulse 1.5s infinite;
  
  @keyframes pulse {
    0% { opacity: 0.7; }
    50% { opacity: 1; }
    100% { opacity: 0.7; }
  }
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  margin-top: 5px;
  font-size: 12px;
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.color};
  margin-right: 5px;
  animation: pulse 1.5s infinite;
`;

const StatusLabel = styled.span`
  font-weight: bold;
`;

