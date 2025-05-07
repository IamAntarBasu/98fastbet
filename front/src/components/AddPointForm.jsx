import React, { useState, useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { useProfile } from "../context/ProfileContext";
import Swal from 'sweetalert2';
import axios from "axios";
import { FaTimes, FaCopy } from "react-icons/fa";

// Add global styles for SweetAlert
const GlobalStyle = createGlobalStyle`
  .swal2-container {
    z-index: 9999 !important; /* Ensure SweetAlert is above other elements */
  }

  .swal2-popup {
    width: 300px !important; /* Adjust the width to make the popup smaller */
    font-size: 14px !important; /* Adjust font size for better fit */
    border-radius: 20px !important; /* Rounded corners */
  }
`;

const VirtualAccountDetails = ({ onClose }) => {
  
  const [copied, setCopied] = useState({ upiId: false, phone: false });
  const { profile } = useProfile();
  const [depositAmount, setDepositAmount] = useState("");
  const [phoneNo, setPhoneNo] = useState('');
  const [userName, setUserName] = useState("");
  const [Utr, setUtr] = useState("");
  const [upiId, setUpiId] = useState("");
  const [phone, setPhone] = useState("");
  const [qrCode, setQrCode] = useState("");

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/api/getupiqr`)
      .then((response) => {
        setUpiId(response.data.upi_id);
        setPhone(response.data.phone);
        // setQrCode(`${process.env.REACT_APP_BASE_URL}/${response.data.qrCode}`);
        setQrCode(response.data.qrCode);
      })
      .catch((error) => {
        console.error("Error fetching payment details:", error);
      });
  }, []);

  const copyValueToClipboard = (key, value) => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied((prev) => ({ ...prev, [key]: true }));
      setTimeout(() => setCopied((prev) => ({ ...prev, [key]: false })), 2000);
    });
  };

  const handleSubmit = async () => {
    if (!profile) {
      Swal.fire({
        icon: "error",
        title: "Profile Error",
        text: "User profile is missing. Please refresh and try again!",
      });
      return;
    }

    const formData = {
      Utr,
      userName,
      user: profile?.userId,
      phoneNumber: phoneNo || "N/A",
      deposite: depositAmount
    };

    try {
      await axios.post(`${process.env.REACT_APP_BASE_URL}/api/add-more-points`, formData);
      Swal.fire("Submitted!", "Your payment proof has been sent successfully.", "success");

      const message = `Payment Submission Details:
      - Name: ${userName}
      - Phone No: ${phoneNo || "N/A"}
      - Deposit: ₹${depositAmount}
      - UTR No: ${Utr}`;

      const whatsappUrl = `https://wa.me/91${2269334732}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "There was an error submitting the payment. Please try again.",
      });
    }
  };

  return (
    <>
      <GlobalStyle /> {/* Apply global styles */}
      <Card>
        <CloseButton onClick={onClose}><FaTimes /></CloseButton>
        <Title>Deposit Request</Title>
        
        <Label>UPI Handle:</Label>
        <Value>
          {upiId}
          {copied.upiId ? (
            <span style={{ color: "#ff8e53", marginLeft: "8px" }}>Copied!</span>
          ) : (
            <CopyIcon onClick={() => copyValueToClipboard("upiId", upiId)}><FaCopy /></CopyIcon>
          )}
        </Value>
        

        <Label>PhonePay/Paytm:</Label>
        <Value>
          {phone}
          {copied.phone ? (
            <span style={{ color: "#ff8e53", marginLeft: "8px" }}>Copied!</span>
          ) : (
            <CopyIcon onClick={() => copyValueToClipboard("phone", phone)}><FaCopy /></CopyIcon>
          )}
        </Value>


        <Label>QR Code:</Label>
        <QRCode src={qrCode} alt="QR Code" />

        <Label>UserName:</Label>
        <StyledInput 
          type="text" 
          placeholder="Enter Username" 
          onChange={(e) => setUserName(e.target.value)} 
        />

        <Label>Mobile No:</Label>
        <StyledInput 
          type="number" 
          placeholder="Enter Mobile Number" 
          onChange={(e) => setPhoneNo(e.target.value)} 
        />

        <Label>Deposit:</Label>
        <StyledInput 
          type="number" 
          value={depositAmount} 
          onChange={(e) => setDepositAmount(e.target.value)} 
          placeholder="Enter deposit amount" 
        />

        <Label>UTR NO:</Label>
        <StyledInput 
          type="number" 
          placeholder="Enter UTR No." 
          onChange={(e) => setUtr(e.target.value)} 
        />

        <Note>A screenshot must be sent on WhatsApp to verify the payment.</Note>
        <SubmitButton onClick={handleSubmit}>Proceed To Deposit</SubmitButton>
      </Card>
    </>
  );
};

const Card = styled.div`
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  max-width: 900px;
  width: 100%;
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 12px;
  align-items: center;
  font-family: 'Poppins', sans-serif;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: #e94560;
  font-size: 20px;
  cursor: pointer;
  grid-column: 2 / 3;
  justify-self: end;

  &:hover {
    transform: rotate(90deg);
  }
`;

const Title = styled.h2`
  color: #fff;
  font-size: 22px;
  font-weight: 600;
  margin: 0;
  grid-column: 1 / 3;
`;

const CopyIcon = styled.span`
  color: #ff8e53;
  font-size: 16px;
  cursor: pointer;
  margin-left: 8px;

  &:hover {
    transform: scale(1.2);
  }
`;

const Label = styled.span`
  color: #fff;
  font-weight: 500;
  font-size: 14px;
`;

const Value = styled.span`
  color: #e0e0e0;
  font-size: 14px;
`;

const QRCode = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 8px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  padding: 4px;
  background: white;
`;

const StyledInput = styled.input`
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 14px;
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  outline: none;

  &:focus {
    border-color: #ff8e53;
    background: rgba(255, 255, 255, 0.15);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
`;

const Note = styled.p`
  text-align: center;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  margin: 8px 0;
  grid-column: 1 / 3;
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #ff6b6b, #ff8e53);
  color: white;
  padding: 12px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  grid-column: 1 / 3;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 107, 107, 0.4);
  }
`;

export default VirtualAccountDetails;
