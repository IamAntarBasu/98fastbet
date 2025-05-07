import React from 'react'
import AllNavabar from '../AllGamesNavbar/AllNavbar'
import ChoosePlayerCards from './Components/Cards'
// import { useNavigate } from 'react-router-dom'
// import { useProfile } from '../../../context/ProfileContext'
import styled from "styled-components";
import { useLocation } from "react-router-dom";
const Cricket = () => {
  // const navigate = useNavigate();
  // const { profile } = useProfile();
   const location = useLocation();
  const {iframeUrl,name} = location.state || {};
  return (
      <div>
        <AllNavabar />
        <div className="scorecard" style={{ paddingTop: "75px" }}>
        <LiveScoreContainer>
          {iframeUrl ? (
            <iframe
              src={iframeUrl}
              width="100%"
              height="100%"
              title="Live Score"
              style={{ border: "none" }}
            ></iframe>
          ) : (
            <PlaceholderText>Live Score Not Available</PlaceholderText>
          )}
        </LiveScoreContainer >
      </div>
        <ChoosePlayerCards name={name}/>
      </div>

  )
}

const LiveScoreContainer = styled.div`
  background: linear-gradient(135deg, #1e1e2f, #2a2a40);
  width: 100%;
  height: 218px;
  margin-bottom: 20px;
  border-radius: 15px;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  position: relative;
`;

const PlaceholderText = styled.p`
  color: #fff;
  text-align: center;
  font-size: 18px;
  margin: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export default Cricket