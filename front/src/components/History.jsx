import React, { useState, useEffect, useRef } from "react";
import styled from 'styled-components';
import axios from 'axios'
import DashboardNavbar from '../AllGamesNavbar/AllNavbar';
const TableContainer = styled.div`
  border-radius: 0px;
  overflow-x: auto;
  margin: 0;
  width: 100vw; /* Full Width */
  background: linear-gradient(135deg, #1e293b, #0f172a);
  padding: 20px;
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.2);

  /* Desktop and Tablet: 50% height */
  height: 100vh; 
padding-top:75px;
  /* Mobile: Adjust height to 70% */
  @media (max-width: 768px) {
    height: 100vh;
    padding: 10px; /* Smaller padding for mobile */
            padding-top: 75px;
  }
`;


const Heading = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: #f8fafc;
  font-size: 1.8rem;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
`;

const StyledThead = styled.thead`
  background: #334155;
`;

const StyledTh = styled.th`
  color: #ffffff;
  padding: 14px;
  font-weight: 600;
  text-transform: uppercase;
  white-space: nowrap;
`;

const StyledTd = styled.td`
  padding: 12px;
  text-align: center;
  color: #f8fafc;
  font-size: 0.9rem;
  border-bottom: 1px solid #475569;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

// Dynamic row color based on type
const StyledTr = styled.tr`
  background-color: ${(props) =>
    props.type === 'Lgaai' ? '#dc2626' : props.type === 'Khaai' ? '#16a34a' : '#16a34a'};
`;

// Responsive Styling
const ResponsiveWrapper = styled.div`
  overflow-x: auto;

  @media (max-width: 768px) {
    ${StyledTh}, ${StyledTd} {
      font-size: 0.8rem;
      padding: 10px;
    }
    ${Heading} {
      font-size: 1.5rem;
    }
  }
`;

const History = () => {

    const [userData, setUserData] = useState(null);
    const [data, setData] = useState([]);
   
   //fatch all user bets 
   useEffect(() => {
     const user = localStorage.getItem('user');
     if (user) {
         setUserData(JSON.parse(user));
     } else {
         // alert("User is not logged in. Please log in to view your bets.");
         alert("User is not logged in. Please log in to view your bets.")
     }
   }, []);
   
   // Fetch user's bets from the backend based on userId
   const fetchBets = async () => {
     if (userData) {
         try {
             const userId = userData.id;
             console.log(userId);
             const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/laggai_khai_getuserbet/${userId}`);
             if (response.data.success) {
            setData(response.data.bets)
             } else {
   
                 alert("Failed to fetch bets")
             }
         } catch (err) {
             console.error('Error fetching bets:', err);
             // // alert("There was an error fetching bets.");
             // toast.error("There was an error fetching bets.")
         }
     }
   };
   useEffect(() => {
     if (userData) {
         fetchBets();
     }
   }, [userData]);
   

  return (
    <>
    <DashboardNavbar/>
    <TableContainer>
      <Heading>Cricket History</Heading>
      <ResponsiveWrapper>
        <StyledTable>
          <StyledThead>
            <tr>
              {['Label', 'Match', 'Odds', 'Stake', 'Profit', 'Balance', 'Exposure', 'Time', 'Type', 'Status'].map((head, index) => (
                <StyledTh key={index}>{head}</StyledTh>
              ))}
            </tr>
          </StyledThead>
          <tbody>
            {data.map((bet, index) => (
              <StyledTr key={index} type={bet.type}>
                <StyledTd>{bet.label}</StyledTd>
                <StyledTd>{bet.match}</StyledTd>
                <StyledTd>{bet.odds}</StyledTd>
                <StyledTd>{bet.stake}</StyledTd>
                <StyledTd>{bet.profit}</StyledTd>
                <StyledTd>{bet.balance}</StyledTd>
                <StyledTd>{bet.exposure}</StyledTd>
                <StyledTd>{bet.time}</StyledTd>
                <StyledTd>{bet.type}</StyledTd>
                <StyledTd>{bet.status}</StyledTd>
              </StyledTr>
            ))}
          </tbody>
        </StyledTable>
      </ResponsiveWrapper>
    </TableContainer>
    </>
  );
};

export default History;
