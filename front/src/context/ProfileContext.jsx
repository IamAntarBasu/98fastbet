import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
    const [profile, setProfile] = useState({ 
        username: 'Demo', 
        walletBalance: 0, 
        email: "", 
        userId: "", 
        userNo: "",
        exposureBalance: 0 // Added exposure balance
    });

    const fetchNameWallet = async (retryCount = 0) => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            console.error('User data not found in localStorage');
            return;
        }
        
        try {
            const objectId = JSON.parse(userData);
            const id = objectId.id || objectId._id || objectId.userNo; // Try multiple ID fields
            
            if (!id) {
                console.error('No valid ID found in user data:', objectId);
                return;
            }
            
            console.log(`Fetching profile for user ID: ${id}`);
            
            const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/name/${id}`);
            
            if (res.data) {
                // Ensure we have a valid userNo, falling back to other IDs if needed
                const userNo = res.data.userNo || id;
                
                // Update profile with all available data
                setProfile({
                    username: res.data.username || 'User',
                    walletBalance: res.data.walletBalance || 0,
                    email: res.data.email || '',
                    _id: id, // Set _id explicitly for compatibility
                    userId: id, // Set userId explicitly for compatibility
                    userNo: userNo,
                    exposureBalance: res.data.exposureBalance || 0
                });
                
                console.log('Profile updated successfully:', {
                    username: res.data.username,
                    _id: id,
                    userId: id,
                    userNo: userNo
                });
            } else {
                console.error('Empty response data from profile API');
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
            
            // Retry logic for network errors (max 3 retries)
            if (err.message && (err.message.includes('Network Error') || err.response?.status >= 500) && retryCount < 3) {
                console.log(`Retrying profile fetch (attempt ${retryCount + 1})...`);
                // Wait for a short time before retrying (exponential backoff)
                const delay = Math.pow(2, retryCount) * 1000;
                setTimeout(() => {
                    fetchNameWallet(retryCount + 1);
                }, delay);
            } else if (err.response?.status === 404) {
                // User not found - try to extract ID from localStorage as fallback
                try {
                    const objectId = JSON.parse(userData);
                    const id = objectId.id || objectId._id || objectId.userNo;
                    
                    if (id) {
                        console.log('User not found in API, using localStorage data as fallback');
                        setProfile({
                            username: objectId.username || 'User',
                            walletBalance: objectId.walletBalance || 0,
                            email: objectId.email || '',
                            _id: id,
                            userId: id,
                            userNo: id,
                            exposureBalance: objectId.exposureBalance || 0
                        });
                    }
                } catch (parseError) {
                    console.error('Error parsing user data from localStorage:', parseError);
                }
            }
        }
    };

    // Function to update exposure balance
    const updateExposure = (amount) => {
        // Only update if the amount has actually changed
        if (Math.abs(profile.exposureBalance - amount) > 0.01) {
            setProfile(prevProfile => ({
                ...prevProfile,
                exposureBalance: amount
            }));
        }
    };

    // Function to transfer funds between wallet and exposure
    const transferToExposure = (amount) => {
        if (amount <= 0) return;
        
        setProfile(prevProfile => {
            const newWalletBalance = prevProfile.walletBalance - amount;
            const newExposureBalance = prevProfile.exposureBalance + amount;
            
            return {
                ...prevProfile,
                walletBalance: newWalletBalance,
                exposureBalance: newExposureBalance
            };
        });
    };

    // Function to release funds from exposure back to wallet
    const releaseFromExposure = (amount) => {
        if (amount <= 0) return;
        
        setProfile(prevProfile => {
            const newExposureBalance = Math.max(0, prevProfile.exposureBalance - amount);
            const amountReleased = prevProfile.exposureBalance - newExposureBalance;
            const newWalletBalance = prevProfile.walletBalance + amountReleased;
            
            return {
                ...prevProfile,
                walletBalance: newWalletBalance,
                exposureBalance: newExposureBalance
            };
        });
    };

    useEffect(() => {
        fetchNameWallet();
    }, []); // Automatically fetch profile data on mount

    return (
        <ProfileContext.Provider value={{ 
            profile, 
            fetchNameWallet, 
            updateExposure,
            transferToExposure,
            releaseFromExposure
        }}>
            {children}
        </ProfileContext.Provider>
    );
};

// Custom hook for using profile context
export const useProfile = () => useContext(ProfileContext);
