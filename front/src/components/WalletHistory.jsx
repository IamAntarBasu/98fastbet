import React, { useState } from 'react';
import './WalletHistory.css';

function WalletHistory() {
    const [activeContent, setActiveContent] = useState(null);

    const handleWithdrawClick = () => {
        setActiveContent('withdraw');
    };

    const handleDepositClick = () => {
        setActiveContent('deposit');
    };

    const handleClose = () => {
        setActiveContent(null);
    };

    return (
        <div className="w-container">
            <div className="slider-container">
                <div className="slider">
                    <div 
                        className="slide" 
                        onClick={handleWithdrawClick}
                    >
                        <h2>Withdraw</h2>
                    </div>
                    <div 
                        className="slide" 
                        onClick={handleDepositClick}
                    >
                        <h2>Deposit</h2>
                    </div>
                </div>

                <div className="card-container">
                    <div className={`content-wrapper ${activeContent === 'withdraw' ? 'withdraw' : activeContent === 'deposit' ? 'deposit' : ''}`}>
                        <div className="content withdraw-content">
                            <h3>Withdraw Details</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>UserName</th>
                                        <th>UPI ID</th>
                                        <th>Phone</th>
                                        <th>Withdraw</th>
                                        <th>Date & Time</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center' }}>
                                            No withdrawals found
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            {/* <button onClick={handleClose}>Close</button> */}
                        </div>
                        <div className="content deposit-content">
                            <h3>Deposit Details</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>UserName</th>
                                        <th>Mobile No</th>
                                        <th>Deposit</th>
                                        <th>UTR NO</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center' }}>
                                            No deposits found
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            {/* <button onClick={handleClose}>Close</button> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WalletHistory;