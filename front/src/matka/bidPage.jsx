
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import { useProfile } from "../context/ProfileContext";
import { toast } from "react-toastify";
import axios from 'axios';
// import { MainContainer } from "./Wallet";
import { BackButton } from "./Play";
import { FaArrowLeft } from "react-icons/fa";

const BidPage = () => {
  const { gameName, pointsToplay, profit, bitType, bitStatus } = useParams();
  const [showPopup, setShowPopup] = useState(false);
  const [session, setSession] = useState("");
  const { profile } = useProfile();
  // const [bidPointsData, setBidPointsData] = useState(Array(10).fill(""));
  const [totalBidPoints, setTotalBidPoints] = useState(0);
  const profitRate = parseFloat(profit) || 0;
  const pointsToPlay = parseFloat(pointsToplay) || 0;
  const [totalProfit, setTotalProfit] = useState(0);
  const [betData, setBetData] = useState({ betPoint: "", betAmt: "" });
  // const [betPoint, setBetPoint] = useState(0);
  // const [betAmt, setBetAmt] = useState(0);


  const { fetchNameWallet } = useProfile();
  const data = [
    { bidType: "Single Digit", bidPoints: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"] },
    {
      bidType: "Single Panna", bidPoints: [
        "120", "123", "124", "125", "126", "127", "128", "129",
        "130", "134", "135", "136", "137", "138", "139", "140",
        "145", "146", "147", "148", "149", "150", "156", "158",
        "159", "160", "167", "168", "169", "170", "178", "179",
        "180", "189", "190", "230", "234", "235", "236", "237",
        "238", "239", "240", "245", "246", "247", "248", "249",
        "250", "256", "257", "258", "259", "260", "267", "268",
        "269", "270", "278", "279", "280", "289", "290", "234",
        "345", "346", "347", "348", "349", "350", "356", "357",
        "358", "359", "360", "367", "368", "369", "370", "378",
        "379", "380", "389", "390", "456", "457", "458", "459",
        "460", "467", "468", "469", "470", "478", "479", "480",
        "489", "490", "560", "567", "568", "569", "570", "578",
        "579", "580", "589", "590", "670", "678", "679", "680",
        "689", "690", "780", "789", "790", "890"
      ]
    },
    {
      bidType: "Double Panna", bidPoints: [
        "100", "110", "112", "113", "114", "115", "116", "117", "118",
        "122", "133", "144", "155", "166", "177", "188", "199", "200",
        "220", "223", "224", "225", "226", "227", "228", "229", "233",
        "244", "255", "266", "277", "288", "300", "330", "334", "335",
        "336", "337", "338", "339", "344", "355", "366", "377", "388",
        "400", "440", "445", "446", "447", "448", "449", "455", "466",
        "477", "488", "499", "500", "550", "555", "556", "557", "558",
        "559", "566", "577", "588", "599", "660", "667", "668", "669",
        "677", "700", "770", "779", "788", "799", "800", "880", "889",
        "900", "990"]
    },
    { bidType: "Tripple Panna", bidPoints: ["000", "111", "222", "333", "444", "555", "666", "777", "888", "999"] },
    {
      bidType: "Jodi Digit", bidPoints: [
        "00", "01", "02", "03", "04", "05", "06", "07", "08", "09",
        "10", "11", "12", "13", "14", "15", "16", "17", "18", "19",
        "20", "21", "22", "23", "24", "25", "26", "27", "28", "29",
        "30", "31", "32", "33", "34", "35", "36", "37", "38", "39",
        "40", "41", "42", "43", "44", "45", "46", "47", "48", "49",
        "50", "51", "52", "53", "54", "55", "56", "57", "58", "59",
        "60", "61", "62", "63", "64", "65", "66", "67", "68", "69",
        "70", "71", "72", "73", "74", "75", "76", "77", "78", "79",
        "80", "81", "82", "83", "84", "85", "86", "87", "88", "89",
        "90", "91", "92", "93", "94", "95", "96", "97", "98", "99"
      ]
    },
  ];

  const selectedBidType = data.find((item) => item.bidType.toLowerCase() === bitType.toLowerCase());

  const handleInputChange = (point, value) => {
  
    setBetData((prevData) => ({
      ...prevData,
      betPoint: point,
      betAmt: value
    }));
    const totalPoints = value ? parseFloat(value) : 0;
    setTotalBidPoints(totalPoints);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowPopup(true);
    
    if (totalBidPoints <= 0) {
      toast.error("Please enter at least 1 valid bid.");
      return;
    }
  
    if (totalBidPoints > profile.walletBalance) {
      toast.error("Insufficient balance. Please add more funds.");
      return;
    }
  
    setTotalProfit(((totalBidPoints / pointsToPlay) * profitRate) || 0);
    
    const userData = localStorage.getItem("user");
    if (!userData) {
      toast.error("User is not logged in. Please log in to place a bid.");
      return;
    }
  
    const objectId = JSON.parse(userData);
    const userId = objectId.id;
  
    // Constructing bid data to include all necessary details
    const bidData = {
      userId,
      gameName,
      bidType: bitType,  // send bidType
      session,           // send session
      bids: [{ 
        number: betData.betPoint, 
        points: parseFloat(betData.betAmt) 
      }],
      totalBidPoints,    // send totalBidPoints
      estimatedProfit: totalProfit,  // send estimatedProfit
    };
 
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/bids`, bidData);
      if (response.data.success) {
        toast.success("Bid placed successfully!");
        fetchNameWallet();
      } else {
        toast.error(response.data.message || "Failed to place bid.");
      }
    } catch (err) {
      console.error("Error placing bid:", err);
      toast.error("There was an error placing your bid. Please try again.");
    }
  }
  



  return (
    <MainContainer>
      <Container>
        <Wrapper>
          <Header>
            <Link to={`/casino/play/${gameName}/${bitStatus}`}>
              <BackButton>
                <FaArrowLeft />
              </BackButton>
            </Link>
            <Title>{gameName}</Title>
          </Header>
          <Banner>For Better Experience <br /> Download 98Fastbet App</Banner>

          <BidForm>
            <Label>Bid Type</Label>
            <div>
              <Label>
                <InputField type="text" name="bidType" defaultValue={bitType} />
              </Label>
            </div>


            {bitStatus === "Close" ? (

              <SessionSelection>
                <Label>Choose Session</Label>
                <label>
                  <input
                    type="radio"
                    name="session"
                    checked
                    onChange={() => setSession(bitStatus)}
                  />{" "}
                  Close
                </label>
              </SessionSelection>
            ) : (
              bitType && bitType !== "JODI DIGIT" && (
                <SessionSelection>
                  <Label>Choose Session</Label>
                  <label>
                    <input
                      type="radio"
                      name="session"
                      checked={session === "Open"}
                      value={"Open"}
                      onChange={(e) => setSession(e.target.value)}
                    />{" "}
                    Open
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="session"
                      value={"Close"}
                      checked={session === "Close"}
                      onChange={(e) => setSession(e.target.value)}
                    />{" "}
                    Close
                  </label>
                </SessionSelection>
              )
            )}
            <Label>Enter Your Bid</Label>
            {selectedBidType && selectedBidType.bidPoints.map((point, index) => (
              <NumberRow key={index}>
                <NumberButton>{point}</NumberButton>
                <InputField
                  type="number"
                  value={betData.betPoint === point ? betData.betAmt : ""}
                  onChange={(e) => handleInputChange(point, e.target.value)}
                  placeholder="Enter Points"
                // disabled={betData.betPoint && betData.betPoint !== point}
                />
              </NumberRow>
            ))}
          </BidForm>

          <BottomContainer>
            <Footer>
              <div><strong>{totalBidPoints}</strong> Bid Points</div>
              <div><strong>{profile.walletBalance}</strong> Balance Points</div>
              <SubmitButton onClick={handleSubmit}>Submit</SubmitButton>
            </Footer>
          </BottomContainer>
        </Wrapper>
      </Container>

      {showPopup && (
        <>
          <Overlay onClick={() => setShowPopup(false)} />
          <Popup>
            <h2>Bid Summary</h2>
            <p><strong>Game: {gameName}</strong></p>
            <p><strong>Bid Type: {bitType}</strong></p>
            <p><strong>Session: {session}</strong></p>
            <p><strong>Bet Points: {betData.betPoint} {betData.betAmt}</strong></p>
            <p><strong>Total Points: {totalBidPoints}</strong></p>
            <p><strong>Estimated Profit: {totalProfit}</strong></p>
            <CloseButton onClick={() => setShowPopup(false)}>Close</CloseButton>
          </Popup>
        </>
      )}
    </MainContainer>
  );
}

// Styled Components
const Container = styled.div`
  background-color: #0b3c68;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 10px;
  box-sizing: border-box;
`;

const Wrapper = styled.div`
  background-color: white;
  width: 100%;
  padding: 20px 20px 90px 20px;
  border-radius: 10px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #0b3c68;
  border-radius: 20px;
  padding: 10px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  color: #6fdc6f;
  text-transform: uppercase;
  text-align: center;
  flex: 1;
`;

const Banner = styled.div`
  background-color: red;
  color: white;
  text-align: center;
  padding: 10px;
  font-weight: bold;
  font-size: 16px;
  border-radius: 10px;
  margin: 20px auto 0 auto;
  width: 100%;
  animation: backgroundChange 1s infinite;

  @keyframes backgroundChange {
    0% { background-color: red; }
    50% { background-color: #0b3c68; }
  }
`;

const BidForm = styled.div`
  background-color: #e0e0e5;
  padding: 20px;
  border-radius: 10px;
  margin-top: 20px;
  text-align: left;
  width: 40%;
  padding-bottom: 60px;
  box-sizing:border-box;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Label = styled.label`
  font-weight: bold;
  color: black;
  // margin-bottom: 40px;
`;

const NumberRow = styled.div`
  display: flex;
  align-items: center;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 10px;
`;

const NumberButton = styled.button`
  background: #0b3c68;
  color: white;
  border: none;
  padding: 10px;
  width: 40%;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  border-radius: 8px;
`;

const InputField = styled.input`
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  margin: 10px  0;
  width: 50%;
`;

const BottomContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
  padding: 10px;
  background: white;
  border-radius: 10px;
`;

const SubmitButton = styled.button`
  background: #0b3c68;
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`;

const CloseButton = styled.button`
  background: gray;
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const Popup = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  width: 80%;
  max-width: 400px;
  text-align: center;
`;

const SessionSelection = styled.div`
  display: flex;
  gap: 10px;
  margin: 10px 0;
`;

export const MainContainer = styled.div`
//   background: #002b4e;
  // padding: 20px 0;
  min-height: 100vh;
  box-sizing:border-box;
  @media (max-width: 768px) {
    width: 100%;
    // padding: 10px;
  }
`;

export default BidPage;