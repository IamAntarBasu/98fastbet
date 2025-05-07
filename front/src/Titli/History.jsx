import axios from 'axios';
import React, { useEffect, useState } from 'react'
import styled from 'styled-components';

const History = ({ titlibets }) => {

  return (
    <Container>
      <Wrapper>
        {titlibets.length > 0 ? (
          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <Th>Bet Amout</Th>
                  {/* <Th>Total Bet</Th> */}
                  <Th>Is Win</Th>
                  <Th>Profit</Th>
                  <Th>Date & Time</Th>
                </tr>
              </thead>
              <tbody>
                {titlibets.map((bet) => (
                  <tr key={bet._id}>
                    {/* <Td>{bet.betAmount}</Td> */}
                    <Td>{bet.totalBets}</Td>
                    <Td>{bet.isWin ? "Win" : "Loss"}</Td>
                    <Td>
                      {bet.profit}
                    </Td>
                    <Td>{new Date(bet.createdAt).toLocaleString()}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableContainer>
        ) : (
          <MessageBox>You do not have any bet.</MessageBox>
        )}
      </Wrapper>
    </Container>
  )
}

export default History

const Container = styled.div`
   width: 100%;
  background-color: #2b2f3e;
  border-radius: 16px;
  display: flex;
  box-sizing: border-box;
  height: 90vh;
 margin-top: 20px;
  flex-direction: column;
  box-sizing: border-box;
  @media (max-width: 768px) {
    width: 100%;
    margin-top: 10px;
    height: auto;
    // margin:auto;
  }
`;




const Wrapper = styled.div`
  // background-color: black;
  width: 100%;

  border-radius: 10px;
    box-sizing: border-box;
  color:white;
    @media (max-width: 768px) {
    width:100%;
    // margin-top:0px
    width:100%;
    padding:0
  }
`;


const MessageBox = styled.div`
  background-color: #e0e0e5;
  padding: 15px;
  border-radius: 10px;
  text-align: center;
  font-size: 16px;
  color: black;
  font-weight: bold;
  margin-top: 15px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 10px;
  }
`;

const TableContainer = styled.div`
  // max-height: 600px; /* Adjust height to fit 7 rows */
  overflow-y: auto;
  // border: 1px solid #ddd;
  scrollbar-width: thin;
  width:100%;
  @media (max-width: 768px) {
    height: auto;
    // background-color:rgb(217, 221, 235);
    width:100%;
      overflow-y:hidden;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  // background-color:rgb(6, 36, 66);
  color: white;
  box-sizing:border-box;
  padding: 10px;
  text-align: center;
//   @media (min-width: 769px) {
    position: sticky;
    top: 0px;
    z-index: 1;
//   }

`;

const Td = styled.td`
  // border: 1px solid #ddd;
  padding: 10px;
  box-sizing:border-box;
  text-align: center;
  font-size:13px;
`;