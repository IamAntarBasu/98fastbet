// import React , { useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import styled from 'styled-components';
// import io from "socket.io-client";
// import AllNavabar from '../../AllGamesNavbar/AllNavbar'

// const socket = io(`${process.env.REACT_APP_BASE_URL}`);
// const LiveCricketMarket = () => {
//   // const matches = [
//   //   'Royal Challengers Bengaluru W VS Up Warriorz W',
//   //   'West Indies Masters VS Australia Masters',
//   //   'Bangladesh VS New Zealand',
//   //   'New match',
//   // ];
//   const [matches, setLeagues] = useState([]);
//     useEffect(() => {
//       socket.on("updateMatches", (data) => {
//         console.log("Received data:", data); // Debugging step
//         if (Array.isArray(data)) {
//           setLeagues(data);
//         } else {
//           console.error("Data is not an array:", data);
//         }
//       });
  
//       return () => socket.off("updateMatches");
//     }, []);
  
//     const handleClick = (match,iframeUrl,name) => {
//       navigate(`/cricket2/games/${match}`, {
//         state: {iframeUrl:iframeUrl,name:name}
//       });
   
//     };  
//   const navigate = useNavigate()
//   return (
//     <>
//     <AllNavabar/>
//     <Container>
//       <Title>Aar Par Parchi</Title>
//       <MatchList>
//         {matches.map((match, index) => (
//           <MatchCard key={index}  onClick={() => handleClick(match.matchName,match.scoreIframe,match.matchName)}>
//             <span>{match.matchName}-{match.matchDate}</span> 
//             {/* <Link> */} 
//             <LiveBadge >LIVE</LiveBadge>         
//             {/* </Link> */}
//           </MatchCard>
//         ))}
//       </MatchList>
//     </Container>
//     </>
//   );
// };

// export default LiveCricketMarket;



// const Container = styled.div`
//   background-color: #0a3d62;
//   height: 100vh;
//   display: flex;
// //   justify-content: center;
//   align-items: center;
//   flex-direction: column;
// `;

// const Title = styled.h1`
//   color: white;
//   margin-bottom: 20px;
// `;

// const MatchList = styled.div`
//   width: 50%;
//   @media (max-width: 768px) {
//     width: 90%;
//   }
// `;

// const MatchCard = styled.div`
//   background-color: white;
//   padding: 15px 20px;
//   margin: 10px 0;
//   border-radius: 10px;
//   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
// `;

// const LiveBadge = styled.div`
//   background-color: red;
//   color: white;
//   padding: 5px 10px;
//   border-radius: 5px;
//   font-weight: bold;
// `;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import io from "socket.io-client";
import AllNavabar from "../../AllGamesNavbar/AllNavbar";

const socket = io(`${process.env.REACT_APP_BASE_URL}`);

const LiveCricketMarket = () => {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchMatches = () => {
      socket.emit("getMatches"); // Request updated match data
    };

    const updateMatches = (data) => {
      if (Array.isArray(data)) {
        setMatches((prevMatches) => {
          return JSON.stringify(prevMatches) !== JSON.stringify(data) ? data : prevMatches;
        });
      }
    };

    // Listen for new match data
    socket.on("updateMatches", updateMatches);

    // Fetch matches every second
    const interval = setInterval(fetchMatches, 1000);

    return () => {
      clearInterval(interval);
      socket.off("updateMatches", updateMatches);
    };
  }, []);

  const navigate = useNavigate();

  const handleClick = (match, iframeUrl, name) => {
    navigate(`/cricket2/games/${match}`, {
      state: { iframeUrl: iframeUrl, name: name },
    });
  };

  return (
    <>
      <AllNavabar />
      <Container>
        <Header>98FASTBET CRICKET</Header>
        <MatchList>
          {matches.map((match, index) => (
            <MatchCard
              key={index}
              onClick={() =>
                handleClick(match.matchName, match.scoreIframe, match.matchName)
              }
            >
              <LiveBadge>LIVE</LiveBadge>
              <MatchName>{match.matchName}-{match.matchDate}</MatchName>
            </MatchCard>
          ))}
        </MatchList>
      </Container>
    </>
  );
};

export default LiveCricketMarket;

const Container = styled.div`
  background-color: #ffffff;
  min-height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 20px;
  margin-left: -15px;
`;

const Header = styled.div`
  background-color: #ffcc00;
  width: 100%;
  padding: 15px;
  text-align: left;
  font-size: 18px;
  font-weight: bold;
  color: black;
  margin-top: 63px;
`;

const MatchList = styled.div`
  width: 100%;
  max-width: 600px;
  margin-top: 10px;
`;

const MatchCard = styled.div`
  background-color: white;
  padding: 12px 15px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const LiveBadge = styled.div`
  background-color: #28a745;
  color: white;
  padding: 3px 8px;
  border-radius: 3px;
  font-size: 12px;
  font-weight: bold;
`;

const MatchName = styled.span`
  font-size: 14px;
  color: black;
`;
