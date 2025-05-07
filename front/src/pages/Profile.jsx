import React, { useState } from "react";
import styled from "styled-components";
import { useProfile } from '../context/ProfileContext';
import DashboardNavbar from '../AllGamesNavbar/AllNavbar';
const ProfileContainer = styled.div`
  width: 100%;
  padding: 20px;
  margin: 40px auto 5px auto;
  box-sizing: border-box;
  border-radius: 10px;
  margin-top: 0px;
    
  @media (max-width: 768px) {
    width: 100%;
    padding: 10px;
    margin: 20px auto;
    margin-top: 0px;
  }
`;

const ProfileWrapper = styled.div`
  background-color: white;
  width: 100%;
  padding: 30px;
  text-align: start;
  border-radius: 10px;
  box-sizing:border-box;
      padding-top: 60px;
  @media (max-width: 768px) {
        padding-top: 70px;
  }
`;

const Title = styled.h1`
  font-size: 40px;
  font-weight: bold;
  color: black;

  @media (max-width: 768px) {
    font-size: 28px;
    text-align: center;
  }
`;

const ProfileContent = styled.div`
  background-color: #e0e0e5;
  padding: 30px;
  border-radius: 10px;
  margin-top: 20px;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const ProfileField = styled.div`
  background-color: white;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  flex-direction: column;

  span {
    color: #0b3c68;
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 5px;
  }

  @media (max-width: 768px) {
    padding: 10px;
    font-size: 16px;
  }
`;

const InputField = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  outline: none;
  width: 100%;

  &:focus {
    border-color: #0b3c68;
  }

  @media (max-width: 768px) {
    padding: 8px;
    font-size: 14px;
  }
`;

const UserForm = () => {
  const { profile } = useProfile();
  const [formData, setFormData] = useState({
    name: profile.username,
    email: profile.email,
    mobile: "NA",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
   < DashboardNavbar/>

    <ProfileContainer>
      <ProfileWrapper>
        <Title>Profile</Title>
        <ProfileContent>
          <ProfileField>
            <span>Name</span>
            <InputField
              type="text"
              name="name"
              value={profile.username}
              onChange={handleChange}
              placeholder="Enter your name"
            />
          </ProfileField>
          <ProfileField>
            <span>Email</span>
            <InputField
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </ProfileField>
          <ProfileField>
            <span>Mobile</span>
            <InputField
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter your mobile number"
            />
          </ProfileField>
        </ProfileContent>
      </ProfileWrapper>
    </ProfileContainer>
    </>
  );
};

export default UserForm;
