import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const Prediction = () => {
  const [prediction, setPrediction] = useState(localStorage.getItem("fetchLastMultiplierValue") || "3");
  const [manualPrediction, setManualPrediction] = useState("");

  const fetchCrashPoint = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/avaitor/get/latest/crashpoint`);
      console.log(response.data.data.crashMultiplier)
      localStorage.setItem("fetchLastMultiplierValue", response.data.data.crashMultiplier)
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };
  useEffect(()=>{
    fetchCrashPoint()
  },[])

  const createCrashPoint = async (prediction) => {
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/avaitor/update/crashpoint`, {
        crashPoint: prediction
      });
    } catch (error) {
      console.error("Error updating crash point:", error);
    }
  };

  const predictOutcome = () => {
    const targetMultiplier = parseFloat((Math.random() * 30 + 1).toFixed(2));
    localStorage.setItem("fetchLastMultiplierValue", targetMultiplier);
    setPrediction(targetMultiplier);
    createCrashPoint(targetMultiplier);
  };

  const handleManualPrediction = () => {
    if (manualPrediction && !isNaN(manualPrediction)) {
      const value = parseFloat(manualPrediction);
      localStorage.setItem("fetchLastMultiplierValue", value);
      setPrediction(value);
      createCrashPoint(value);
      setManualPrediction("");
    }
  };

  return (
    <Container>
      <h2>Admin Crash Control</h2>
      <p>Next Multiplier:</p>
      <PredictionBox>{prediction}</PredictionBox>
      <Button onClick={predictOutcome}>Set Random Multiplier</Button>
      <InputContainer>
        <NumberInput
          type="number"
          value={manualPrediction}
          onChange={(e) => setManualPrediction(e.target.value)}
          placeholder="Enter multiplier value"
          min="1"
          step="0.01"
        />
        <Button onClick={handleManualPrediction}>Set Manual Multiplier</Button>
      </InputContainer>
      
    </Container>
  );
};

export default Prediction;

// Styled Components (Minimal Design)
const Container = styled.div`
    background: #222;
    color: white;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
`;

const PredictionBox = styled.div`
    font-size: 2rem;
    font-weight: bold;
    color: #ffcc00;
    background: #333;
    padding: 15px 30px;
    border-radius: 8px;
    margin: 15px 0;
`;

const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 15px;
`;

const NumberInput = styled.input`
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #444;
    background: #333;
    color: white;
    font-size: 1rem;
    width: 200px;
    height: 40px;

    &:focus {
        outline: none;
        border-color: #ffcc00;
    }
`;

const Button = styled.button`
    background: #ffcc00;
    color: black;
    font-weight: bold;
    padding: 10px 20px;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    transition: 0.3s ease;
    
    &:hover {
        background: #e6b800;
    }
`;
