import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaHome } from 'react-icons/fa';

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 20px;
  text-align: center;
`;

const ErrorCode = styled.h1`
  font-size: 120px;
  color: #1a2b45;
  margin: 0;
  line-height: 1;
`;

const ErrorMessage = styled.h2`
  font-size: 24px;
  color: #333;
  margin: 20px 0;
`;

const ErrorDescription = styled.p`
  font-size: 16px;
  color: #666;
  margin-bottom: 30px;
  max-width: 500px;
`;

const HomeLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  background-color: #1a2b45;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  font-weight: 500;
  transition: background-color 0.2s;
  
  svg {
    margin-right: 8px;
  }
  
  &:hover {
    background-color: #0d1b2a;
  }
`;

const NotFoundPage = () => {
  return (
    <NotFoundContainer>
      <ErrorCode>404</ErrorCode>
      <ErrorMessage>Page Not Found</ErrorMessage>
      <ErrorDescription>
        The page you are looking for might have been removed, had its name changed,
        or is temporarily unavailable.
      </ErrorDescription>
      <HomeLink to="/">
        <FaHome />
        Return to Home
      </HomeLink>
    </NotFoundContainer>
  );
};

export default NotFoundPage; 