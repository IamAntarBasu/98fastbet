// import React, { useState, useEffect } from "react";
// import styled from "styled-components";
// import axios from "axios";
// import { useProfile } from "../context/ProfileContext";
// import Swal from "sweetalert2";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { IoClose } from "react-icons/io5";

// const WithdrawalForm = ({ onClose }) => {
//   const [formData, setFormData] = useState({
//     userName: "",
//     upi_id: "",
//     phoneNumber: "",
//     withdrawAmount: "",
//   });

//   const { profile } = useProfile();
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [withdrawal, setWithdrawal] = useState([]);
//   const [userData, setUserData] = useState(null);
//   const [isFormVisible, setIsFormVisible] = useState(true);

//   // Handle input change
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage("");

//     try {
//       if (!profile || !profile.walletBalance || !profile.userId) {
//         toast.error("Profile data is missing!");
//         setLoading(false);
//         return;
//       }

//       if (parseFloat(formData.withdrawAmount) > profile.walletBalance) {
//         toast.error("Insufficient wallet balance!");
//       } else {
//         const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/withdraw`, {
//           user: profile.userId,
//           ...formData,
//         });

//         if (response.data.success) {
//           Swal.fire({
//             icon: "success",
//             title: "Request Successful!",
//             html: `You have successfully initiated a request for <strong>₹${formData.withdrawAmount}</strong>! Wait for approval.`,
//             confirmButtonText: "Okay",
//           });

//           setMessage("Withdrawal request submitted successfully!");
//           setFormData({
//             userName: "",
//             upi_id: "",
//             phoneNumber: "",
//             withdrawAmount: "",
//           });
//           getPaymentDetails(); // Refresh withdrawal list
//         } else {
//           Swal.fire({
//             icon: "error",
//             title: "Oops!",
//             text: "Withdrawal request failed.",
//           });
//           setMessage("Withdrawal request failed.");
//         }
//       }
//     } catch (error) {
//       console.error("Withdrawal Error:", error);
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "Please fill all fields correctly.",
//       });
//       setMessage("An error occurred during withdrawal.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch user data from localStorage
//   useEffect(() => {
//     const user = localStorage.getItem('user');
//     if (user) {
//       setUserData(JSON.parse(user));
//     } else {
//       toast.error("User is not logged in. Please log in to view your withdrawals.");
//     }
//   }, []);

//   // Fetch withdrawal details
//   const getPaymentDetails = async () => {
//     if (!userData) return;

//     try {
//       const userId = userData.id;
//       const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/getwithdrawal/${userId}`);

//       if (response.data.success) {
//         setWithdrawal(response.data.withdrawals || []);
//       } else {
//         console.log("Failed to fetch withdrawal details");
//       }
//     } catch (err) {
//       console.error("Error fetching withdrawals:", err);
//       toast.error("Error fetching withdrawal details.");
//     }
//   };

//   useEffect(() => {
//     if (userData) {
//       getPaymentDetails();
//     }
//   }, [userData]);

//   return (
//     <Container>
//       <ToastContainer position="top-center" autoClose={2000} />
//       {isFormVisible && (
//         <>
//           <CloseButton onClick={() => {onClose(); setIsFormVisible(false)}}>
//             <IoClose size={28} />
//           </CloseButton>
//           <Title>Withdrawl Request</Title>
//           <FormContainer onSubmit={handleSubmit}>
//             <InputField>
//               <Label>Username</Label>
//               <Input
//                 type="text"
//                 name="userName"
//                 value={formData.userName}
//                 onChange={handleChange}
//                 placeholder="Enter your username"
//                 required
//               />
//             </InputField>
//             <InputField>
//               <Label>UPI ID</Label>
//               <Input
//                 type="text"
//                 name="upi_id"
//                 value={formData.upi_id}
//                 onChange={handleChange}
//                 placeholder="Enter UPI ID"
//                 required
//               />
//             </InputField>
//             <InputField>
//               <Label>Phone Number</Label>
//               <Input
//                 type="tel"
//                 name="phoneNumber"
//                 value={formData.phoneNumber}
//                 onChange={handleChange}
//                 placeholder="Enter phone number"
//                 required
//               />
//             </InputField>
//             <InputField>
//               <Label>Amount (₹)</Label>
//               <Input
//                 type="number"
//                 name="withdrawAmount"
//                 value={formData.withdrawAmount}
//                 onChange={handleChange}
//                 placeholder="Enter amount"
//                 required
//               />
//             </InputField>
//             <WithdrawButton type="submit" disabled={loading}>
//               {loading ? "Processing..." : "Proceed To Withdraw"}
//             </WithdrawButton>
//             {message && <Message>{message}</Message>}
//           </FormContainer>
//         </>
//       )}
//       {/* <TableSection>
//         <TableTitle>Withdrawal History</TableTitle>
//         <Table>
//           <thead>
//             <tr>
//               <Th>Username</Th>
//               <Th>UPI ID</Th>
//               <Th>Phone</Th>
//               <Th>Amount</Th>
//               <Th>Date</Th>
//               <Th>Status</Th>
//             </tr>
//           </thead>
//           <tbody>
//             {withdrawal.length > 0 ? (
//               withdrawal.map((bid) => (
//                 <Tr key={bid._id}>
//                   <Td>{bid.userName || "N/A"}</Td>
//                   <Td>{bid.upi_id || "N/A"}</Td>
//                   <Td>{bid.phoneNumber || "N/A"}</Td>
//                   <Td>₹{bid.withdrawAmount || "N/A"}</Td>
//                   <Td>{new Date(bid.createdAt).toLocaleDateString()}</Td>
//                   <Td>
//                     <Status status={bid.status}>
//                       {bid.status || "Pending"}
//                     </Status>
//                   </Td>
//                 </Tr>
//               ))
//             ) : (
//               <Tr>
//                 <Td colSpan="6">No withdrawal history</Td>
//               </Tr>
//             )}
//           </tbody>
//         </Table>
//       </TableSection> */}
//     </Container>
//   );
// };

// const Container = styled.div`
//   background: linear-gradient(145deg, #2a2a4a, #1e1e2f);
//   border-radius: 20px;
//   padding: 2rem;
//   width: 35%;
//   max-width: 900px;
//   margin: 0 auto;
//   box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
//   border: 1px solid rgba(255, 255, 255, 0.1);
//   position: fixed;
//   top: 50%;
//   left: 50%;
//   transform: translate(-50%, -50%);
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   height: auto;
//   overflow: hidden;
//   @media screen and (max-width: 1024px) {
//     width: 50%;
//   }
//   @media screen and (max-width: 768px) {
//     width: 90%;
//   }
// `;

// const Title = styled.h1`
//   font-size: 2rem;
//   font-weight: 600;
//   color: #ffffff;
//   text-align: center;
//   margin-bottom: 2rem;
//   background: linear-gradient(90deg, #ff6b6b, #ff8e53);
//   -webkit-background-clip: text;
//   -webkit-text-fill-color: transparent;
//   @media screen and (max-width: 768px) {
//     font-size: 1.8rem;
//   }
// `;

// const FormContainer = styled.form`
//   display: flex;
//   flex-direction: column;
//   gap: 1.5rem;
//   width: 100%;
//   max-width: 500px;
//   margin-bottom: 3rem;
// `;

// const InputField = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 0.5rem;
// `;

// const Label = styled.label`
//   color: #ffffff;
//   font-size: 0.9rem;
//   font-weight: 500;
//   opacity: 0.9;
// `;

// const Input = styled.input`
//   padding: 0.75rem;
//   border-radius: 8px;
//   border: 1px solid rgba(255, 255, 255, 0.1);
//   background: rgba(255, 255, 255, 0.05);
//   color: #ffffff;
//   font-size: 1rem;
//   outline: none;
//   transition: all 0.3s ease;

//   &:focus {
//     border-color: #ff6b6b;
//     box-shadow: 0 0 8px rgba(255, 107, 107, 0.2);
//   }

//   &::placeholder {
//     color: rgba(255, 255, 255, 0.4);
//   }
// `;

// const WithdrawButton = styled.button`
//   background: linear-gradient(90deg, #ff6b6b, #ff8e53);
//   color: white;
//   padding: 0.9rem;
//   border: none;
//   border-radius: 8px;
//   font-weight: 600;
//   font-size: 1rem;
//   cursor: pointer;
//   transition: all 0.3s ease;

//   &:hover:not(:disabled) {
//     transform: translateY(-2px);
//     box-shadow: 0 5px 15px rgba(255, 107, 107, 0.4);
//   }

//   &:disabled {
//     opacity: 0.6;
//     cursor: not-allowed;
//   }
// `;

// const Message = styled.p`
//   color: #ff8e53;
//   font-size: 0.9rem;
//   text-align: center;
//   margin-top: 0.5rem;
// `;

// const TableSection = styled.div`
//   width: 100%;
// `;

// const TableTitle = styled.h2`
//   font-size: 1.5rem;
//   color: #ffffff;
//   margin-bottom: 1.5rem;
//   text-align: center;
//   background: linear-gradient(90deg, #ff6b6b, #ff8e53);
//   -webkit-background-clip: text;
//   -webkit-text-fill-color: transparent;
// `;

// const Table = styled.table`
//   width: 100%;
//   border-collapse: separate;
//   border-spacing: 0;
//   color: #ffffff;
// `;

// const Th = styled.th`
//   background: rgba(255, 255, 255, 0.05);
//   padding: 0.75rem;
//   text-align: center;
//   font-weight: 600;
//   font-size: 0.9rem;
//   border-bottom: 1px solid rgba(255, 255, 255, 0.1);
// `;

// const Tr = styled.tr`
//   transition: all 0.3s ease;
//   &:hover {
//     background: rgba(255, 255, 255, 0.03);
//   }
// `;

// const Td = styled.td`
//   padding: 0.75rem;
//   font-size: 0.9rem;
//   text-align: center;
//   border-bottom: 1px solid rgba(255, 255, 255, 0.05);
// `;

// const Status = styled.span`
//   padding: 0.3rem 0.6rem;
//   border-radius: 12px;
//   font-size: 0.8rem;
//   background: ${props => 
//     props.status === 'Approved' ? 'rgba(46, 204, 113, 0.1)' :
//     props.status === 'Rejected' ? 'rgba(231, 76, 60, 0.1)' :
//     'rgba(241, 196, 15, 0.1)'};
//   color: ${props => 
//     props.status === 'Approved' ? '#2ecc71' :
//     props.status === 'Rejected' ? '#e74c3c' :
//     '#f1c40f'};
// `;

// const CloseButton = styled.button`
//   position: absolute;
//   top: 1rem;
//   right: 1rem;
//   background: none;
//   border: none;
//   color: #ff6b6b;
//   cursor: pointer;
//   padding: 0.2rem;
//   transition: all 0.3s ease;

//   &:hover {
//     color: #ff8e53;
//     transform: scale(1.1);
//   }
// `;


// export default WithdrawalForm;



import React, { useState, useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";
import axios from "axios";
import { useProfile } from "../context/ProfileContext";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoClose } from "react-icons/io5";

const GlobalStyle = createGlobalStyle`
  .swal2-container {
    z-index: 5000 !important;
  }
`;

const WithdrawalForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    userName: "",
    upi_id: "",
    phoneNumber: "",
    withdrawAmount: "",
  });

  const { profile } = useProfile();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [withdrawal, setWithdrawal] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(true);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (!profile || !profile.walletBalance || !profile.userId) {
        toast.error("Profile data is missing!");
        setLoading(false);
        return;
      }

      if (parseFloat(formData.withdrawAmount) > profile.walletBalance) {
        toast.error("Insufficient wallet balance!");
      } else {
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/withdraw`, {
          user: profile.userId,
          ...formData,
        });

        if (response.data.success) {
          Swal.fire({
            icon: "success",
            title: "Request Successful!",
            html: `You have successfully initiated a request for <strong>₹${formData.withdrawAmount}</strong>! Wait for approval.`,
            confirmButtonText: "Okay",
          });

          setMessage("Withdrawal request submitted successfully!");
          setFormData({
            userName: "",
            upi_id: "",
            phoneNumber: "",
            withdrawAmount: "",
          });
          getPaymentDetails(); // Refresh withdrawal list
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops!",
            text: "Withdrawal request failed.",
          });
          setMessage("Withdrawal request failed.");
        }
      }
    } catch (error) {
      console.error("Withdrawal Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please fill all fields correctly.",
      });
      setMessage("An error occurred during withdrawal.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch user data from localStorage
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setUserData(JSON.parse(user));
    } else {
      toast.error("User is not logged in. Please log in to view your withdrawals.");
    }
  }, []);

  // Fetch withdrawal details
  const getPaymentDetails = async () => {
    if (!userData) return;

    try {
      const userId = userData.id;
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/getwithdrawal/${userId}`);

      if (response.data.success) {
        setWithdrawal(response.data.withdrawals || []);
      } else {
        console.log("Failed to fetch withdrawal details");
      }
    } catch (err) {
      console.log("Error fetching withdrawals:", err);
      // toast.error("Error fetching withdrawal details.");
    }
  };

  useEffect(() => {
    if (userData) {
      getPaymentDetails();
    }
  }, [userData]);

  return (
    <>
      <GlobalStyle />
      <Container>
        <ToastContainer position="top-center" autoClose={2000} />
        {isFormVisible && (
          <>
            <CloseButton onClick={() => {onClose(); setIsFormVisible(false)}}>
              <IoClose size={28} />
            </CloseButton>
            <Title>Withdrawl Request</Title>
            <FormContainer onSubmit={handleSubmit}>
              <InputField>
                <Label>Username</Label>
                <Input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  required
                />
              </InputField>
              <InputField>
                <Label>UPI ID</Label>
                <Input
                  type="text"
                  name="upi_id"
                  value={formData.upi_id}
                  onChange={handleChange}
                  placeholder="Enter UPI ID"
                  required
                />
              </InputField>
              <InputField>
                <Label>Phone Number</Label>
                <Input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  required
                />
              </InputField>
              <InputField>
                <Label>Amount (₹)</Label>
                <Input
                  type="number"
                  name="withdrawAmount"
                  value={formData.withdrawAmount}
                  onChange={handleChange}
                  placeholder="Enter amount"
                  required
                />
              </InputField>
              <WithdrawButton type="submit" disabled={loading}>
                {loading ? "Processing..." : "Proceed To Withdraw"}
              </WithdrawButton>
              {message && <Message>{message}</Message>}
            </FormContainer>
          </>
        )}
      </Container>
    </>
  );
};

const Container = styled.div`
  background: linear-gradient(145deg, #2a2a4a, #1e1e2f);
  border-radius: 20px;
  padding: 2rem;
  width: 35%;
  max-width: 900px;
  margin: 0 auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  height: auto;
  overflow: hidden;
  @media screen and (max-width: 1024px) {
    width: 50%;
  }
  @media screen and (max-width: 768px) {
    width: 90%;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  color: #ffffff;
  text-align: center;
  margin-bottom: 2rem;
  background: linear-gradient(90deg, #ff6b6b, #ff8e53);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  @media screen and (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  max-width: 500px;
  margin-bottom: 3rem;
`;

const InputField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #ffffff;
  font-size: 0.9rem;
  font-weight: 500;
  opacity: 0.9;
`;

const Input = styled.input`
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: #ff6b6b;
    box-shadow: 0 0 8px rgba(255, 107, 107, 0.2);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`;

const WithdrawButton = styled.button`
  background: linear-gradient(90deg, #ff6b6b, #ff8e53);
  color: white;
  padding: 0.9rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 107, 107, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Message = styled.p`
  color: #ff8e53;
  font-size: 0.9rem;
  text-align: center;
  margin-top: 0.5rem;
`;

const TableSection = styled.div`
  width: 100%;
`;

const TableTitle = styled.h2`
  font-size: 1.5rem;
  color: #ffffff;
  margin-bottom: 1.5rem;
  text-align: center;
  background: linear-gradient(90deg, #ff6b6b, #ff8e53);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  color: #ffffff;
`;

const Th = styled.th`
  background: rgba(255, 255, 255, 0.05);
  padding: 0.75rem;
  text-align: center;
  font-weight: 600;
  font-size: 0.9rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Tr = styled.tr`
  transition: all 0.3s ease;
  &:hover {
    background: rgba(255, 255, 255, 0.03);
  }
`;

const Td = styled.td`
  padding: 0.75rem;
  font-size: 0.9rem;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`;

const Status = styled.span`
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8rem;
  background: ${props => 
    props.status === 'Approved' ? 'rgba(46, 204, 113, 0.1)' :
    props.status === 'Rejected' ? 'rgba(231, 76, 60, 0.1)' :
    'rgba(241, 196, 15, 0.1)'};
  color: ${props => 
    props.status === 'Approved' ? '#2ecc71' :
    props.status === 'Rejected' ? '#e74c3c' :
    '#f1c40f'};
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: #ff6b6b;
  cursor: pointer;
  padding: 0.2rem;
  transition: all 0.3s ease;

  &:hover {
    color: #ff8e53;
    transform: scale(1.1);
  }
`;


export default WithdrawalForm;
