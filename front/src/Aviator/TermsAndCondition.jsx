import { useState } from "react";
import styled from "styled-components";

const TermsAndConditions = ({setIsOpen}) => {
//   const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* <TermsButton onClick={() => setIsOpen(true)}>T&C</TermsButton> */}

      {/* {isOpen && ( */}
        <Overlay>
          <ModalContent>
            <CloseButton onClick={() => setIsOpen(false)}>✖</CloseButton>
            <Title>HOW TO PLAY</Title>
            <Content>
              <ol>
                <li>Place a bet. The initial stake is determined before the start of a game.</li>
                <li>The maximum stake is 50910.45 INR, and the minimum stake is 20 INR.</li>
                <li>As soon as each round begins, the odds start to increase until a crash occurs.</li>
                <li>
                  If you manage to press <strong>"Take winnings"</strong> before the crash, then your stake will be multiplied by the stated odds.
                </li>
                <li>The crash occurs at random, but the longer you stay in the game, the higher the odds and the more you win.</li>
                <li>
                  If you have not taken your winnings by the time the crash happens, the game will end, and your stake will be lost.
                </li>
                <li>All you need to succeed is a stable internet connection (wired, Wi-Fi, or LTE).</li>
              </ol>

              <SubTitle>AUTOBET</SubTitle>
              <ol>
                <li>In "Autobet" mode, you need to fill in the required fields: "Base bet", "Maximum stake amount", and "Auto cashout".</li>
                <li>The "Base bet" is the amount you want to bet.</li>
                <li>The "Maximum stake amount" is the highest amount that can be wagered while using autobet.</li>
              </ol>
            </Content>
          </ModalContent>
        </Overlay>
      {/* )} */}
    </>
  );
};

// Styled Components
const TermsButton = styled.button`
  padding: 10px 15px;
  background: linear-gradient(90deg, rgb(34, 193, 195), rgb(253, 187, 45));
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index:2000;
  box-sizing:border-box;
`;

const ModalContent = styled.div`
  background: #1B1D36;
  color: white;
  padding: 25px;
  border-radius: 10px;
  width: 30%;
//   max-height: 80vh;
  overflow-y: auto;
  font-size: 4px;
  position: relative;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.5);
  @media (max-width: 768px) {
    width: 90%;
      box-sizing:border-box;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: transparent;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 24px;
`;

const Title = styled.h2`
  font-size: 16px;
  text-align: center;
  font-weight: bold;
  margin-bottom: 15px;
`;

const SubTitle = styled.h3`
  font-size: 12px;
  font-weight: bold;
  margin-top: 20px;
  text-align: center;

`;

const Content = styled.div`
  font-size:10px;
  line-height: 1.6;
    text-align:left;

  ol {
    padding-left: 20px;
  }

  li {
    margin-bottom: 10px;
  }
`;

export default TermsAndConditions;