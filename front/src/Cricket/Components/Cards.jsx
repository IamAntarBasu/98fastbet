import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useProfile } from "../../context/ProfileContext";
import { useParams } from "react-router-dom";
import DashboardNavbar from '../../AllGamesNavbar/AllNavbar'


const ChoosePlayerCards = () => {
  const { Livematch } = useParams()
  const [cards, setCards] = useState([]); // Stores 3 cards
  const [allPlayers, setAllPlayers] = useState([]); // Stores player options
  const [allMatchData, setAllMatchData] = useState([])
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [modalPlayers, setModalPlayers] = useState({ player1: "", player2: "" });
  const { profile, fetchNameWallet } = useProfile();
  const [winner, setWinner] = useState({})
  const [betModal, setBetModal] = useState({ isOpen: false, cardId: null });
  const [betAmount, setBetAmount] = useState(10); // Default bet amount
  const [betCard, setBetCard] = useState([{ cardId: null, betAmount: 0 }]);
  const [price, setPrice] = useState(null); // New Feature: Selected Price
  const [points, setPoints] = useState(null);
  const [profit, setProfit] = useState(null);
const [playerByMatch, setPlayersByMatch] = useState([])
  const [matchUser, setMatchUser] = useState(0)
  // const matchData = ["Match1", "Match2", "Match3", "Match4", "Match5"];
  const [match, setMatch] = useState();
  const [playedCard, setPlayedCard] = useState([])
  const [selectedPlayers, setSelectedPlayers] = useState(new Set());

  // const handleMatchChange = (e) => {
  //   setMatch(e.target.value);
  //   fetchMatchByMatchName()
  // };
  const betArray = [{
    pointsTobebet: 100,
    profit: 100
  },
  {
    pointsTobebet: 200,
    profit: 200
  },
  {
    pointsTobebet: 500,
    profit: 500
  },
  {
    pointsTobebet: 1000,
    profit: 1000
  },
  {
    pointsTobebet: 2000,
    profit: 2000
  },
  {
    pointsTobebet: 5000,
    profit: 5000
  },
  {
    pointsTobebet: 10000,
    profit: 10000
  },
  ]
  const openBetModal = (cardId) => {
    setBetModal({ isOpen: true, cardId });
  };

    useEffect(() => {
      fetchNameWallet();
    }, [points, fetchNameWallet]);

  const fetchPlayersByMatch = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/match/get-players-by-matchname/${Livematch}`);
      setPlayersByMatch(response.data.players);
    } catch (error) {
      console.error("Error fetching players:", error);
    }
  };


  useEffect(() => {
    fetchPlayersByMatch();
  }, [Livematch])
 console.log(playerByMatch, "playerByMatch")
  const fetchMatchByMatchName = async (match) => {
    try {
      console.log("Fetching match data...");
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/match/get-by-matchname/${Livematch}`);
      setAllMatchData(response.data);
      setMatchUser(response.data[0].CardData.cardUser.length);

      setPlayedCard((prev) => {
        const newCardId = response.data[0].CardData._id;
        return prev.includes(newCardId) ? prev : [...prev, newCardId];
      });
    } catch (error) {
      console.error("Error fetching match data:", error);
    }
  };

  useEffect(() => {
    console.log("Match value:", Livematch); // Check if match has a valid value
    if (match) {
      console.log("new")
      fetchMatchByMatchName(Livematch);
    }
  }, [Livematch]);

  // console.log(allMatchData)
  // console.log(matchUser, "usr")
  // const getSelectedPlayers = () => selectedPlayers;
  const fetchCards = () => {
    // if(Livematch){
    axios.get(`${process.env.REACT_APP_BASE_URL}/api/cards/${Livematch}`)
      .then(response => setCards(response.data.slice(0, 3))) // Ensure only 3 cards
      .catch(error => console.error("Error fetching cards:", error));

  }
  // console.log(cards, "cardss")


  useEffect(() => {
    fetchCards();
    axios.get(`${process.env.REACT_APP_BASE_URL}/api/players`)
      .then(response => setAllPlayers(response.data))
      .catch(error => console.error("Error fetching players:", error));
  }, []);

  const openModal = (index) => {
    setSelectedCardIndex(index);
    setModalPlayers({ player1: cards[index]?.cards[0]?.player1 || "", player2: cards[index]?.cards[0]?.player2 || "" });

  };

  const closeModal = () => {
    setSelectedCardIndex(null);
  };
  // console.log(winner)


  // console.log(cards)

  const handleSubmit = async () => {
    if (!modalPlayers.player1 || !modalPlayers.player2) {
      toast.error("Please select both players before submitting.");
      return;
    }

    const player1Data = playerByMatch.find(player => player === modalPlayers.player1);
    const player2Data = playerByMatch.find(player => player === modalPlayers.player2);

    if (!player1Data || !player2Data) {
      toast.error("Error: Player data not found.");
      return;
    }

    const totalRuns = player1Data.score + player2Data.score;

    if (selectedCardIndex === null || selectedCardIndex >= cards.length || !cards[selectedCardIndex]) {
      toast.error("No valid card selected.");
      return;
    }
    const cardId = cards[selectedCardIndex]?._id;
    if (!cardId) {
      console.error("❌ Invalid cardId:", cardId);
      toast.error("Error: Invalid card selection.");
      return;
    }
    // Subtract bet points from wallet
    const newWalletBalance = profile.wallet - points;
    if (newWalletBalance < 0) {
      toast.error("Insufficient balance!");
      return;
    }

    axios.put(`${process.env.REACT_APP_BASE_URL}/api/cards/select/${cardId}`, {
      player1: modalPlayers.player1,
      player2: modalPlayers.player2,
      user: profile,
      totalRuns: totalRuns,
      profit: profit,
      points: points,
      newWalletBalance
    })
      .then(() => {
        // Update the wallet balance in frontend state
        profile.wallet = newWalletBalance;
        toast.success("Players selected and bet placed successfully!");

        // ✅ API Call to Update Wallet Balance in Database
        axios.put(`${process.env.REACT_APP_BASE_URL}/api/users/updateWallet`, {
          email: profile.email,
          wallet: newWalletBalance
        })
          .catch(error => console.error("Error updating wallet:", error));

        fetchCards();
        closeModal();
      })
      .catch(error => {
        console.error(error);
        toast.error("You Already Selected This Card");
      });
  };

  // console.log(match)
  const handleSubmit1 = async () => {
    if (profile.walletBalance < points) {
      toast.error("Insufficient Balance");

    }
    if (!Livematch) {
      toast.error("Please select Match");
      return;
    }

    if (!modalPlayers.player1 || !modalPlayers.player2) {
      toast.error("Please select both players before submitting.");
      return;
    }

    const player1Data = playerByMatch.find(player => player.playername === modalPlayers.player1);
    const player2Data = playerByMatch.find(player => player.playername === modalPlayers.player2);

    if (!player1Data || !player2Data) {
      toast.error("Error: Player data not found.");
      return;
    }

    const totalRuns = player1Data.score + player2Data.score;

    if (selectedCardIndex === null || selectedCardIndex >= cards.length || !cards[selectedCardIndex]) {
      toast.error("No valid card selected.");
      return;
    }
    const cardId = cards[selectedCardIndex]?._id;
    if (!cardId) {
      console.error("❌ Invalid cardId:", cardId);
      toast.error("Error: Invalid card selection.");
      return;
    }
    // Subtract bet points from wallet
    const newWalletBalance = profile.wallet - points;
    if (newWalletBalance < 0) {
      toast.error("Insufficient balance!");
      return;
    }

    axios.put(`${process.env.REACT_APP_BASE_URL}/api/match/select/${Livematch}`, {
      // match: match,
      player1: modalPlayers.player1,
      player2: modalPlayers.player2,
      user: profile,
      totalRuns: totalRuns,
      profit: profit,
      betpoints: points,
      newWalletBalance,
      cardId
    })
      .then(() => {
        // Update the wallet balance in frontend state
        profile.wallet = newWalletBalance;
        toast.success("Players selected and bet placed successfully!");

        // ✅ API Call to Update Wallet Balance in Database
        axios.put(`${process.env.REACT_APP_BASE_URL}/api/users/updateWallet`, {
          email: profile.email,
          wallet: newWalletBalance
        })
          .catch(error => console.error("Error updating wallet:", error));

        fetchCards();
        closeModal();
      })
      .catch(error => {
        console.error(error);
        toast.error(error.response.data.message);
      });
  };


  const handleBetSelection = (e) => {
    const selectedPoints = Number(e.target.value);
    setBetAmount(selectedPoints);

    // ✅ Find the selected bet in betArray
    const selectedBet = betArray.find(bet => bet.pointsTobebet === selectedPoints);
    if (selectedBet) {
      setPoints(selectedBet.pointsTobebet);
      setProfit(selectedBet.profit);
    }
  };

  // console.log(profit, points)
  useEffect(() => {
    if (cards.length === 3) {
      const allCardsFilled = cards.every(card => card.cards[0]?.totalRuns);
      if (allCardsFilled) {
        handlePlay();
      }
    }
  }, []);



  const handlePlay = async () => {
    if (cards.length === 0) {
      toast.error("No cards available to play.");
      return;
    }
    let winningCard = cards.reduce((maxCard, card) => {
      let currentCardTotal = card.cards[0]?.totalRuns || 0;
      return currentCardTotal > (maxCard.cards[0]?.totalRuns || 0) ? card : maxCard;
    }, cards[0]);

    if (!winningCard || !winningCard._id) {
      toast.error("No valid winning card found.");
      return;
    }

    console.log(winningCard, "win");

    if (winningCard.cards[0]?.totalRuns > 0) {
      toast.success(
        `🏆 Winning Card!\n 
        Player 1: ${winningCard.cards[0]?.player1 || "N/A"}\n 
        Player 2: ${winningCard.cards[0]?.player2 || "N/A"}\n 
        Total Runs: ${winningCard.cards[0]?.totalRuns}`,
        {
          autoClose: 60000,
        }
      );

      // ✅ API call to update isWinner
      axios.put(`${process.env.REACT_APP_BASE_URL}/api/cards/winner/${winningCard.cards[0]._id}`)
        .then(() => {
          toast.success("🏆 Winning card updated in the database!");

          // ✅ If the user placed a bet, add their winnings to their wallet
          const winnings = profit; // The selected profit value
          const newWalletBalance = profile.wallet + winnings;

          axios.put(`${process.env.REACT_APP_BASE_URL}/api/users/updateWallet`, {
            email: profile.email,
            wallet: newWalletBalance
          })
            .then(() => {
              profile.wallet = newWalletBalance;
              toast.success(`🎉 You won ${winnings} points!`);
            })
            .catch(error => console.error("Error updating wallet:", error));

          fetchCards();
        })
        .catch(error => {
          console.error("❌ Error updating winning card:", error);
          toast.error("Failed to update the winning card.");
        });
    } else {
      toast.info("No card has a valid total runs score yet.");
    }
  };



  const getSelectedPlayers1 = () => {
    const selected = new Set();
    cards.forEach(card => {
      card.cards.forEach(subCard => {
        if (subCard.player1) selected.add(subCard.player1);
        if (subCard.player2) selected.add(subCard.player2);
      });
    });
    return selected;
  };


  const getSelectedPlayers = () => {
    const selected = new Set();
    cards.forEach(card => {
      card.cards.forEach(subCard => {
        // Add players from all played cards
        if (subCard.player1) selected.add(subCard.player1);
        if (subCard.player2) selected.add(subCard.player2);
      });
    });
    return selected;
  };


  useEffect(() => {
    const updatedSelectedPlayers = getSelectedPlayers();
    setSelectedPlayers(updatedSelectedPlayers);
  }, [playedCard, cards]);

  return (
    <SectionWrapper>
      {/* <DashboardNavbar/> */}
      {/*<p>
        <strong style={{ fontSize: "30px" }}>🏆</strong>{" "}
        {cards.length > 0 && cards.some(card => card.cards[0]?.isWinner) ? (
          <span style={{ fontSize: "20px" }}>
            {cards
              .filter(card => card.cards[0]?.isWinner)
              .map(winner => (
                <span key={winner._id}>
                  {winner.cards[0].player1} + {winner.cards[0].player2} ={" "}
                  <strong>{winner.cards[0].totalRuns}</strong>
                </span>
              ))}
          </span>
        ) : (
          <span>No Winner Yet!</span>
        )}
      </p>*/}

      {/* <Title>Aar Par Parchi</Title> */}
      <Title>{Livematch}</Title>

      <CardsWrapper>
        {cards.map((card, index) => {
          const isWinner = card.cards[0]?.isWinner;
          return (
            <MainCardContainer>
              <PlayerCard
                key={card._id}
                selected={card.cards[0]?.player1 && card.cards[0]?.player2}
                isWinner={isWinner}
                onClick={() => openModal(index)}
              >
                <p style={{ fontWeight: "bold", fontSize: "20px", margin: "10px 0" }}>Card {index + 1}</p>
                <p>Player 1: {card.cards[0]?.player1 || "Not Selected"}</p>
                <p>Player 2: {card.cards[0]?.player2 || "Not Selected"}</p>
                <div style={{ display: "flex", justifyContent: "space-around", gap: "20px" }}>
                  <p>Total Runs: {card.cards[0]?.totalRuns !== undefined ? card.cards[0]?.totalRuns : "0"}</p>
                  <p>People Played: {card.user ? card.user.length : "0"}</p>
                </div>

              </PlayerCard>
              <Button onClick={() => openModal(index)} style={{ display: window.innerWidth < 408 ? "none" : "block" }}>Play</Button>
            </MainCardContainer>


          );
        })}
      </CardsWrapper>
      {/* <Button onClick={() => handlePlay()} >Play All</Button> */}

      {/* {betModal.isOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "white", padding: "20px", borderRadius: "10px", textAlign: "center" }}>
            <h3>Place Your Bet</h3>
            <Select value={betAmount} onChange={(e) => setBetAmount(Number(e.target.value))}>
              <option value={10}>10 Points</option>
              <option value={20}>20 Points</option>
              <option value={40}>40 Points</option>
              <option value={50}>50 Points</option>
            </Select>
            <div style={{ marginTop: "20px" }}>
              <Button onClick={handlePlaceBet}>Submit Bet</Button>
              <Button onClick={() => setBetModal({ isOpen: false, cardId: null })} color="gray">Cancel</Button>
            </div>
          </div>
        </div>
      )} */}
      {selectedCardIndex !== null && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "white", padding: "20px", borderRadius: "10px", textAlign: "center", color: "black" }}>
            <h3 style={{ marginBottom: "2px" }}>Place Your Bet</h3>
            <Select value={betAmount} onChange={handleBetSelection}>
              {betArray.map(point => (
                <option key={point.pointsTobebet} value={point.pointsTobebet}>
                  {point.pointsTobebet} Points
                </option>
              ))}
            </Select>
            <h3 style={{ marginBottom: "2px" }}>Select Players</h3>
            <Select
              value={modalPlayers.player1}
              onChange={(e) => setModalPlayers({ ...modalPlayers, player1: e.target.value })}
              disabled={!!modalPlayers.player1 || getSelectedPlayers().has(modalPlayers.player2)} // Disable if player1 is already set
            >
              <option value="">Select Player</option>
              {playerByMatch.map(player => (
                <option
                  key={player.playername}
                  value={player.playername}
                  disabled={getSelectedPlayers().has(player.playername) || modalPlayers.player2 === player.playername}
                >
                  {player.playername}
                </option>
              ))}
            </Select>

            <Select
              value={modalPlayers.player2}
              onChange={(e) => setModalPlayers({ ...modalPlayers, player2: e.target.value })}
              disabled={!!modalPlayers.player2 || getSelectedPlayers().has(modalPlayers.player1)}
            >
              <option value="">Select Player</option>
              {playerByMatch.map(player => (
                <option
                  key={player.playername}
                  value={player.playername}
                  disabled={getSelectedPlayers().has(player.playername) || modalPlayers.player1 === player.playername}
                >
                  {player.playername}
                </option>
              ))}
            </Select>
            <div style={{ marginTop: "10px", display: "flex", placeItems: "center" }}>
              <Button onClick={handleSubmit1}>Submit</Button>
              <Button onClick={closeModal} color="gray" hoverColor="lightgray">Cancel</Button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={2000} />
    </SectionWrapper>
  );
};

export default ChoosePlayerCards;

const SectionWrapper = styled.section`
  color: #fff;
  text-align: center;
  padding: 0rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 95vh;
  @media (max-width: 768px) {
    height: 100vh;
  }
`;
const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 2rem;
  background: linear-gradient(to right,rgb(225, 165, 104),rgb(203, 42, 123));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  // filter: drop-shadow(0px 0px 10px rgba(255,255,255,0.5));
   @media (max-width: 768px) {
     font-size: 0.8rem;
     width:100%;
  }
`;

const CardsWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
`;
const MainCardContainer = styled.div`
  width: auto;
  height: auto;
  // display: flex;
  // flex-wrap: wrap;
  // gap: 20px;
  // justify-content: center;
`;

const PlayerCard = styled.div`
  background-color: ${({ selected }) => (selected ? "#4caf50" : "#dbd2c7")};
  width: 250px;
  height: 200px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  font-size: 0.8rem;
  font-weight: 600;
  color: #333;
  padding: 7px;
  text-align: left;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
  border: 2px solid transparent;

  @media (max-width: 768px) {
    width: 300px;
    height: auto;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }

  ${({ isWinner }) =>
    isWinner &&
    `
    border-color: #ffeb3b;
    box-shadow: 0 0 20px #ffeb3b;
  `}
`;

const Button = styled.button`
  margin: 10px auto;
  padding: 8px 16px;
  background-color:rgb(23, 149, 120);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: bold;
  transition: background-color 0.3s;
  // width:60%;
  // margin:auto;

  &:hover {
    background-color: #0056b3;
  }
  //   @media (max-width: 768px) {
  //       display:none;
  // }
`;


const Select = styled.select`
  margin-top: 6px;
  padding: 10px;
  font-size: 1rem;
  border-radius: 5px;
  border: 1px solid #333;
  cursor: pointer;
  width: 90%;
`;

// const BetPoint = styled.div`
//   // background-color: #4caf50;
//   width: 260px;
//   height: 30px;
//   border-radius: 10px;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
//   font-size: 1rem;
//   font-weight: bold;
//   color: black;
//   // padding: 15px;
//   text-align: center;
//   cursor: pointer;
//   transition: 0.3s;
// `;