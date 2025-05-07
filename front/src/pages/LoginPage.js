import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaUser, FaLock, FaPhone , FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const SignupPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const isEmailValid = /^[A-Za-z\s]{4,}$/.test(email);
    const isPasswordValid = password.length >= 5;
    const isUsernameValid = username.trim().length > 0;
    setIsFormValid(isEmailValid && isPasswordValid && isUsernameValid);
  }, [username, email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = { username, email, password };
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('UserNo', username);
        setSuccess('User registered successfully!');
        setError('');
        navigate('/login');
      } else {
        setError(data.message || 'Failed to register user');
        setSuccess('');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setSuccess('');
    }
  };

  return (
    <LoginPageContainer>
      <LoginFormContainer>
        <Logo>
          <BrandHeading>98FASTBET</BrandHeading>
        </Logo>
        <FormTitle>Create an Account</FormTitle>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <InputGroup>
              <IconWrapper>
              <FaPhone />
              </IconWrapper>
              <Input 
                type="text" 
                placeholder="Enter your phone No" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
              />
            </InputGroup>
          </FormGroup>

          <FormGroup>
            <InputGroup>
              <IconWrapper>
              <FaUser />
              </IconWrapper>
              <Input 
               type="text"
                name="email"
                placeholder="Enter your name." 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </InputGroup>
          </FormGroup>

          <FormGroup>
            <InputGroup>
              <IconWrapper>
                <FaLock />
              </IconWrapper>
              <Input 
                type={showPassword ? "text" : "password"}
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
              <PasswordToggle onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </PasswordToggle>
            </InputGroup>
          </FormGroup>

          <Button type="submit" disabled={!isFormValid}>Sign Up</Button>
        </form>
        <LinkWrapper>
          <p>
            Have an account? 
            <StyledLink to="/login">Login</StyledLink>
          </p>
        </LinkWrapper>
      </LoginFormContainer>
    </LoginPageContainer>
  );
};

// Styled Components
const LoginPageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a2236 0%, #2d3748 100%);
  padding: clamp(1rem, 3vw, 2rem);
  justify-content: center;
  align-items: center;
`;

const LoginFormContainer = styled.div`
  width: 100%;
  max-width: 480px;
  margin: auto;
  padding: clamp(1.5rem, 4vw, 2.5rem);
  background: linear-gradient(90deg, #2f2f2f, #1a1a1a); /* Blackish gradient */
  color: #fff;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: clamp(1rem, 3vw, 2rem);
`;

const BrandHeading = styled.h2`
  font-size: clamp(1.8rem, 5vw, 2.8rem);
  background: linear-gradient(90deg, #ffeb3b, #ffc107);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin: 0;
  font-weight: 800;
  letter-spacing: 1px;
`;

const FormTitle = styled.h2`
  color: #fff; /* Changed to white */
  font-size: clamp(1.2rem, 3vw, 1.5rem);
  text-align: center;
  margin-bottom: 1.5rem;
  font-weight: 600;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.5rem;
  background: #f8fafc;
  transition: all 0.3s ease;

  &:focus-within {
    border-color: #ffc107;
    box-shadow: 0 0 8px rgba(255, 193, 7, 0.3);
  }
`;

const IconWrapper = styled.div`
  padding: 0.5rem;
  color: #ffc107;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 0.5rem;
  border: none;
  background: transparent;
  font-size: clamp(0.9rem, 2vw, 1rem);
  outline: none;
  color: #333; /* Darker text for contrast on light input bg */

  &::placeholder {
    color: #a0aec0;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.9rem;
  background: linear-gradient(90deg, #3182ce, #2563eb);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: clamp(0.9rem, 2.5vw, 1rem);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(49, 130, 206, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: #dc2626;
  text-align: center;
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

const SuccessMessage = styled.p`
  color: #16a34a;
  text-align: center;
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

const LinkWrapper = styled.div`
  text-align: center;
  margin-top: 1rem;
  color: #fff; /* Changed to white */
`;

const StyledLink = styled(Link)`
  color: #ffc107; /* Yellow to stand out on blackish bg */
  text-decoration: none;
  margin-left: 0.5rem;
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
`;

const PasswordToggle = styled.div`
  padding: 0.5rem;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;

  &:hover {
    color: #ffc107;
  }
`;

export default SignupPage;
