
import React from "react";
import styled from "styled-components";
import { FaArrowLeft } from "react-icons/fa";
import matkaImage from '../assets/matkaImag.png';
import { Link, useParams } from "react-router-dom";


const Container = styled.div`
  background-color: #0b3c68;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 40px;
  box-sizing: border-box;
  @media (max-width: 1024px) {
padding:20px;
  }
`;
 const MainContainer = styled.div`
//   background: #002b4e;
  // padding: 20px 0;
  min-height: 100vh;
  box-sizing:border-box;
  @media (max-width: 768px) {
    width: 100%;
    // padding: 10px;
  }
`;

const Wrapper = styled.div`
  background-color: white;
  width: 100%;
  max-width: 1400px;
  padding: 30px;
  border-radius: 10px;
  box-sizing:border-box;
`;

export const BackButton = styled.button`
  background-color: #0b3c68;
  color: white;
  border: none;
  padding: 5px 15px;
  border-radius: 50%;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  background: #0b3c68;
  border-radius: 20px;
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
  background-color: ${props => props.color};
  color: white;
  text-align: center;
  padding: 10px;
  font-weight: bold;
  width:fit-content;
  font-size: 16px;
  border-radius: 10px;
  margin: auto;
  animation: colorChange 0.5s infinite alternate;
  @keyframes colorChange {
    0% {
      background-color: red;
    }
    100% {
      background-color: #0b3c68;
    }
  }
`;
const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 20px;

`;

const Card = styled.div`
  text-align: center;

  padding: 20px;
  border-radius: 10px;
  transition: background-color 0.3s ease;
box-sizing:border-box;
  @media (max-width: 768px) {

    padding: 15px;
    box-sizing:border-box;
  }
`;

const PotImage = styled.img`
  width: 100%;
  max-width: 200px;
  height: auto;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    max-width: 150px;
  }
`;

const Label = styled.h2`
  font-size: 18px;
  font-weight: bold;
  color: black;
  margin: 0;
`;

const SubLabel = styled.p`
  font-size: 16px;
  font-weight: bold;
  color: gray;
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: 2px solid #ccc; /* Added bottom border */
`;

const Play = () => {
  const { gameName, bidStatus } = useParams()
  const items = [
    { id: 1, pointsToplay: 10, profit: 95, subtitle: "SINGLE DIGIT", image: matkaImage },
    { id: 2, pointsToplay: 10, profit: 950, subtitle: "JODI DIGIT", image: matkaImage },
    { id: 3, pointsToplay: 10, profit: 95, subtitle: "SINGLE PANNA", image: matkaImage },
    { id: 4, pointsToplay: 10, profit: 95, subtitle: "DOUBLE PANNA", image: matkaImage },
    { id: 5, pointsToplay: 10, profit: 950, subtitle: "TRIPPLE PANNA", image: matkaImage },
  ];

  return (

    <MainContainer>
      {/* <DashboardNavbar /> */}
      <Container>
        <Wrapper>
          <Header>
            <Link to="/casino/matka">
              <BackButton>
                <FaArrowLeft />
              </BackButton>
            </Link>
            <Title>{gameName}</Title>
          </Header>

          <Banner>For Better Experience <br /> Download 98Fastbet App</Banner>

          <GridContainer>
            {items.map((item) => {
              const isDisabled =
                bidStatus === "Close" &&
                !["SINGLE PANNA", "TRIPPLE PANNA", "SINGLE DIGIT", "DOUBLE PANNA"].includes(item.subtitle);

              return isDisabled ? (
                <div key={item.id} style={{ opacity: 0.5, cursor: "not-allowed" }}>
                  <Card>
                    <PotImage src={item.image} alt={item.subtitle} />
                    <SubLabel>{item.pointsToplay} Ka {item.profit}</SubLabel>
                    <Label>{item.subtitle}</Label>
                  </Card>
                </div>
              ) : (
                <Link
                  to={`/casino/bidpage/${gameName}/${item.subtitle}/${item.pointsToplay}/${item.profit}/${bidStatus}`}
                  key={item.id}
                >
                  <Card>
                    <PotImage src={item.image} alt={item.subtitle} />
                    <SubLabel>{item.pointsToplay} Ka {item.profit}</SubLabel>
                    <Label>{item.subtitle}</Label>
                  </Card>
                </Link>
              );
            })}
          </GridContainer>

        </Wrapper>
      </Container>
    </MainContainer>
  );
};

export default Play;