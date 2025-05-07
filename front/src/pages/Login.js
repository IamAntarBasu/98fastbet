import React, { useState,useEffect } from 'react'; // Ensure useState is imported
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaLock, FaUser, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios'
// Ensure these styled-components are defined in your file
const ErrorMessage = styled.p`
  color: #dc2626;
  text-align: center;
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

const LinkWrapper = styled.div`
  text-align: center;
  margin-top: 1rem;
  color: #fff;
`;

const StyledLink = styled(Link)`
  color: #ffc107;
  text-decoration: none;
  margin-left: 0.5rem;
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: clamp(1rem, 3vw, 2rem);
`;


const LoginPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [isResetFormValid, setIsResetFormValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [userNo, setUserNo] = useState('');
  useEffect(() => {
    const storedUsername = localStorage.getItem('UserNo'); // Retrieve from LocalStorage
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);
  console.log("USErnameNo",username)

  useEffect(() => {
    const fetchUserNo = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/userLoginUserNo/${username}`);
        const data = await response.json();

        if (data.success) {
          setUserNo(data.userNo);
        } else {
          console.error('User not found');
        }
      } catch (error) {
        console.error('Error fetching userNo:', error);
      }
    };

    if (username) {
      fetchUserNo();
    }
  }, [username]);
  const validateForm = () => {
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isPasswordValid = password.length >= 6;
    setIsFormValid(isEmailValid && isPasswordValid);
  };

  const validateResetForm = () => {
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isNewPasswordValid = newPassword.length >= 6;
    setIsResetFormValid(isEmailValid && isNewPasswordValid);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("okkkk")
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/login`, (
        // method: 'POST',
        // headers: { 'Content-Type': 'application/json' },
         {userNo:userNo , password:password} )
      );

      console.log(response);
      if (response.status == 200) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('wallet', JSON.stringify(response.data.wallet));
        localStorage.setItem('history', JSON.stringify(response.data.history));
        navigate('/');
        window.location.reload();
      } else {
        setError(response.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      setError(error.response.data.message);
      console.log(error);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        setResetMessage('Password reset successful! You can now log in with the new password.');
        setShowForgotPassword(false);
        setNewPassword('');
      } else {
        setResetMessage(data.message || 'Password reset failed. Try again.');
      }
    } catch (error) {
      setResetMessage('Error connecting to server. Try again later.');
    }
  };

  return (
    <LoginPageContainer>
      <LoginFormContainer>
        <Logo>
          <BrandHeading>98FASTBET</BrandHeading>
        </Logo>

        {!showForgotPassword ? (
          <>
            <FormTitle>Login with User ID</FormTitle>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <InputGroup>
                  <IconWrapper>
                   <FaUser />
                  </IconWrapper>
                  <Input
                    type="text"
                    placeholder="UserNo"
                    value={userNo}
                    onChange={(e) => setUserNo(e.target.value)}
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
                    onChange={(e) => {
                      setPassword(e.target.value);
                     
                    }}
                    required
                  />
                  <PasswordToggle onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </PasswordToggle>
                </InputGroup>
              </FormGroup>

              <ForgotPasswordLink onClick={() => setShowForgotPassword(true)}>
                Forgot Password?
              </ForgotPasswordLink>

              <Button type="submit">
                Sign In
              </Button>
            </form>

            <LinkWrapper>
              <p>
                Don't have an account?
                <StyledLink to="/signup"> Sign Up</StyledLink>
              </p>
            </LinkWrapper>
          </>
        ) : (
          <>
            <FormTitle>Reset Password</FormTitle>
            {resetMessage && <SuccessMessage>{resetMessage}</SuccessMessage>}
            <form onSubmit={handleForgotPassword}>
              <FormGroup>
                <InputGroup>
                  <IconWrapper>
                    <FaUser />
                  </IconWrapper>
                  <Input
                    type="email"
                    placeholder="Your Email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      validateResetForm();
                    }}
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
                    type={showNewPassword ? "text" : "password"}
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      validateResetForm();
                    }}
                    required
                  />
                  <PasswordToggle onClick={() => setShowNewPassword(!showNewPassword)}>
                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                  </PasswordToggle>
                </InputGroup>
              </FormGroup>

              <Button type="submit" disabled={!isResetFormValid}>Reset Password</Button>
              <BackToLoginLink onClick={() => setShowForgotPassword(false)}>
                Back to Login
              </BackToLoginLink>
            </form>
          </>
        )}

  
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
  padding: clamp(1.5rem, 4vw, 2.5rem);
  background: #1a1a1a;
  color: #fff;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
`;

const BrandHeading = styled.h2`
  font-size: clamp(1.8rem, 5vw, 2.8rem);
  background: linear-gradient(90deg, #ffeb3b, #ffc107);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin: 0;
  font-weight: 800;
  text-align: center;
`;

const FormTitle = styled.h2`
  text-align: center;
  margin-bottom: 1.5rem;
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
`;

const IconWrapper = styled.div`
  padding: 0.5rem;
  color: #ffc107;
  font-size: 1.2rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: none;
  background: transparent;
  outline: none;
`;

const Button = styled.button`
  width: 100%;
  padding: 0.9rem;
  background: #3182ce;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(49, 130, 206, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ForgotPasswordLink = styled.p`
  text-align: right;
  cursor: pointer;
  color: #ffc107;
`;

const BackToLoginLink = styled.p`
  text-align: center;
  cursor: pointer;
  color: #ffc107;
  margin-top: 1rem;
`;

const SuccessMessage = styled.p`
  color: #22c55e;
  text-align: center;
  margin-bottom: 1rem;
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

export default LoginPage;

