import React, { useState, useEffect } from "react";
import "./payment.css";
import axios from 'axios'
const Payment = () => {
  const [currentDepositPage, setCurrentDepositPage] = useState(1); // Independent page state for deposit
  const [currentWithdrawPage, setCurrentWithdrawPage] = useState(1); // Independent page state for withdraw
  const [upiId, setUpiId] = useState(""); // state to store the updated UPI ID
  const [phone, setPhone] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [qrCode, setQrCode] = useState('');
  // On component mount, check for stored UPI ID and reset the state if necessary
  useEffect(() => {
    const storedUpiId = localStorage.getItem("upiId");
    const storedFile = localStorage.getItem("selectedFile");
    const storedImagePreview = localStorage.getItem("imagePreview");

    if (storedUpiId) {
      setUpiId(storedUpiId);
    }

    if (storedFile && storedImagePreview) {
      setSelectedFile(storedFile);
      setImagePreview(storedImagePreview);
    }
  }, []);


  // Fetch the existing UPI ID from the backend when the component loads
  useEffect(() => {
    const fetchUpiId = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/getbankdetails`);
        if (response.data && response.data.upi_id) {
          setUpiId(response.data.upi_id);
          setPhone(response.data.phone)
        }
      } catch (error) {
        console.error('Error fetching UPI ID:', error);
      }
    };
    fetchUpiId();
  }, []);

  // Handle Update UPI ID
  const handleUpiUpdate = async () => {
    const newUpiId = document.getElementById('upi-input').value;
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/admin/updatebankapi, { upi_id: newUpiId }`);
      alert(response.data.message);
      setUpiId(newUpiId); // Update state to reflect the new UPI ID
    } catch (error) {
      console.error('Error updating UPI ID:', error);
      alert('Failed to update UPI ID.');
    }
  };

  const handlePhoneUpdate = async () => {
    const newPhone = document.getElementById('phone-input').value;

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/admin/updatebankphone, { phone: newPhone }`);
      alert(response.data.message);
      setPhone(newPhone); // Update state to reflect the new UPI ID
    } catch (error) {
      console.error('Error updating UPI ID:', error);
      alert('Failed to update UPI ID.');
    }
  };





  useEffect(() => {
    const fetchQrCode = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/getQrcode`);
        console.log(response.data)
        if (response.data && response.data.qrCode) {
          setQrCode(response.data.qrCode);
        }
      } catch (error) {
        console.error('Error fetching QR Code:', error);
      }
    };
    fetchQrCode();
  }, []);

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file)); // Show preview
    }
  };

  // Upload file to backend
  const uploadFile = async () => {
    if (!selectedFile) {
      alert('Please select a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('qrCode', selectedFile);
    console.log(selectedFile, "selectedFile")
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/updatebankQr`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (response.data && response.data.qrCode) {
        const qrCodeUrl = `${process.env.REACT_APP_BACKEND_URL}/${response.data.qrCode}`;
        setQrCode(qrCodeUrl);
        alert(response.data.message);
      } else {
        console.error('Invalid response format:', response);
        alert('Unexpected response from server.');
      }
    } catch (error) {
      console.error('Error uploading QR Code:', error);
      alert(error.response?.data?.message || 'Failed to upload QR Code.');
    }
  };

  const [depositData, setDepositData] = useState([]);

  const getDepositDate = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/getuserDepositData`);

      if (response.data.success) {
        console.log("Withdrawals Data:", response.data.withdrawals);
        setDepositData(response.data.withdrawals); // ✅ Correct key
      } else {
        alert("Failed to fetch withdrawal details");
      }
    } catch (err) {
      console.error("Error fetching withdrawals:", err);
      alert("There was an error fetching withdrawals.");
    }
  };

  useEffect(() => {
    getDepositDate();
  }, []);

  const approveDepositDate = async (id, amount, userId) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/admin/approveDepositPayment`, {
        withdrawalId: id,
        amount,
        userId
      });

      if (response.data.success) {
        alert("Withdrawal approved successfully!");
        // Update state to reflect the change in UI
        setDepositData((prevData) =>
          prevData.map((item) =>
            item._id === id ? { ...item, status: "Approved" } : item
          )
        );
      } else {
        alert("Failed to approve withdrawal.");
      }
    } catch (error) {
      console.error("Error approving withdrawal:", error);
      alert("An error occurred while approving the withdrawal.");
    }
  };

  // Sample Data for Deposit and Withdraw sections

  const [withdrawData, setWithdrawData] = useState([]);

  const getPaymentDetails = async () => {

    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/getuserpayemt`);

      if (response.data.success) {
        // console.log("Withdrawals Data:", response.data.withdrawals);
        setWithdrawData(response.data.withdrawals); // ✅ Correct key
      } else {
        alert("Failed to fetch withdrawal details");
      }
    } catch (err) {
      console.error("Error fetching withdrawals:", err);
      alert("There was an error fetching withdrawals.");
    }
  };

  useEffect(() => {
    getPaymentDetails();
  }, []);

  const approveWithdrawal = async (id, amount, userId) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/admin/approveWithdrawal`, {
        withdrawalId: id,
        amount,
        userId
      });

      if (response.data.success) {
        alert("Withdrawal approved successfully!");
        // Update state to reflect the change in UI
        setWithdrawData((prevData) =>
          prevData.map((item) =>
            item._id === id ? { ...item, status: "Approved" } : item
          )
        );
      } else {
        alert("Failed to approve withdrawal.");
      }
    } catch (error) {
      console.error("Error approving withdrawal:", error);
      alert("An error occurred while approving the withdrawal.");
    }
  };


  console.log(withdrawData)
  // Pagination logic
  const recordsPerPage = 20;

  const currentDepositData = depositData.slice((currentDepositPage - 1) * recordsPerPage, currentDepositPage * recordsPerPage);
  const currentWithdrawData = withdrawData.slice((currentWithdrawPage - 1) * recordsPerPage, currentWithdrawPage * recordsPerPage);

  const goToNextDepositPage = () => {
    if (currentDepositPage * recordsPerPage < depositData.length) {
      setCurrentDepositPage(currentDepositPage + 1);
    }
  };

  const goToPreviousDepositPage = () => {
    if (currentDepositPage > 1) {
      setCurrentDepositPage(currentDepositPage - 1);
    }
  };

  const goToNextWithdrawPage = () => {
    if (currentWithdrawPage * recordsPerPage < withdrawData.length) {
      setCurrentWithdrawPage(currentWithdrawPage + 1);
    }
  };

  const goToPreviousWithdrawPage = () => {
    if (currentWithdrawPage > 1) {
      setCurrentWithdrawPage(currentWithdrawPage - 1);
    }
  };

  console.log(qrCode)
  const [content, setContent] = useState("");

  const handleNewsUpdate = async () => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/admin/updatenews`, { content });

      alert("News updated successfully!");
      console.log("Updated news:", response.data);
    } catch (error) {
      console.error("Error updating news:", error);
      alert("Failed to update news");
    }
  };


  return (
    <div className="component-space">
      {/* Deposit Section */}
      <div className="card">
        <div className="card-header">
          <h3>Deposit</h3>
        </div>
        <div className="card-body">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Deposit</th>
                  <th>UTR No.</th>
                  <th>Deposit At</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {[...currentDepositData].reverse().map((item, index) => (
                  <tr key={index}>
                    <td>{item.userName}</td>
                    <td>{item.phoneNumber}</td>
                    <td>{item.deposite}</td>
                    <td>{item.Utr}</td>
                    <td>{item.createdAt}</td>
                    <td>{item.status}</td>
                    <td>
                      {item.status === "Pending" ? (
                        <button
                          className="btn btn-success"
                          onClick={() => approveDepositDate(item._id, item.deposite, item.user._id)}
                        >
                          Approve
                        </button>
                      ) : (
                        <span className="btn btn-success mt-2 mb-2">Approved</span>

                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Withdraw Pagination */}
          <div className="pagination">
            <button className="btn" onClick={goToPreviousWithdrawPage} disabled={currentWithdrawPage === 1}>
              Previous
            </button>
            <span>{currentWithdrawPage}</span>
            <button className="btn" onClick={goToNextWithdrawPage} disabled={currentWithdrawPage * recordsPerPage >= withdrawData.length}>
              Next
            </button>
          </div>
        </div>
      </div>


      {/* Withdraw Section */}
      <div className="card">
        <div className="card-header">
          <h3>Withdraw</h3>
        </div>
        <div className="card-body">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Withrawal</th>
                  <th>UPI ID</th>
                  <th>Created At</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {[...currentWithdrawData].reverse().map((item, index) => (
                  <tr key={index}>
                    <td>{item.userName}</td>
                    <td>{item.phoneNumber}</td>
                    <td>{item.wthdrawAmount}</td>
                    <td>{item.upi_id}</td>
                    <td>{item.createdAt}</td>
                    <td>{item.status}</td>
                    <td>
                      {item.status === "Pending" ? (
                        <button
                          className="btn btn-success"
                          onClick={() => approveWithdrawal(item._id, item.wthdrawAmount, item.user._id)}
                        >
                          Approve
                        </button>
                      ) : (
                        <span className="btn btn-success mt-2 mb-2">Approved</span>

                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Withdraw Pagination */}
          <div className="pagination">
            <button className="btn" onClick={goToPreviousWithdrawPage} disabled={currentWithdrawPage === 1}>
              Previous
            </button>
            <span>{currentWithdrawPage}</span>
            <button className="btn" onClick={goToNextWithdrawPage} disabled={currentWithdrawPage * recordsPerPage >= withdrawData.length}>
              Next
            </button>
          </div>
        </div>
      </div>


      <div className="card">
        <div className="card-header">
          <h3>Update UPI ID</h3>
        </div>
        <div className="card-body">
          <label style={{ color: "white" }}>Update UPI ID</label>
          <input id="upi-input" type="text" className="input" placeholder="Enter UPI ID" />
          <button onClick={handleUpiUpdate} className="btn btn-success">
            Update
          </button>
          <div id="showid" className="mt-3">
            <p style={{ color: "white" }}>Current UPI ID: {upiId}</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Update Payment No.</h3>
        </div>
        <div className="card-body">
          <label style={{ color: "white" }}>Update Phone Pay</label>
          <input id="phone-input" type="text" className="input" placeholder="Enter new phonepay" />
          <button onClick={handlePhoneUpdate} className="btn btn-success">
            Update
          </button>
          <div id="showid" className="mt-3">
            <p style={{ color: "white" }}>Current Phone Pay: {phone}</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Update News</h3>
        </div>
        <div className="card-body">
          <label style={{ color: "white" }}>Update News</label>
          <input
            type="text"
            className="input"
            placeholder="Enter news"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button onClick={handleNewsUpdate} className="btn btn-success">
            Update
          </button>
        </div>
      </div>

      {/* Update QR Code Section */}
      <div className="card">
        <div className="card-header">
          <h3>Update QR Code</h3>
        </div>
        <div className="card-body">
          <label className="upload-label">
            <input type="file" onChange={handleFileSelect} />
            {selectedFile ? selectedFile.name : "No file chosen"}
          </label>
          <button onClick={uploadFile} className="btn btn-primary">
            Upload
          </button>

          {/* Display QR code preview */}
          {imagePreview && (
            <div className="image-preview-container">
              <img src={imagePreview} alt="QR Code Preview" className="image-preview" />
            </div>
          )}

          {/* Display stored QR code from backend */}
          {qrCode ? (
            <img src={qrCode} alt="QR Code" style={{ width: "200px", height: "200px" }} />
          ) : (
            <p>No QR Code Available</p>
          )}

        </div>
      </div>






    </div>
  );
};

export default Payment;
