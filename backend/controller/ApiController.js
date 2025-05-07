  
    //   const User = require('../models/UserSignUp');  
    //   const User_Wallet = require('../models/Wallet');
    //   exports.getAllAdminUser = async (req, res) => {
    //     try {
    //       // Fetch users and populate the wallet field to get the balance
    //       const users = await User.find({}, "_id username email wallet") // Fetching specific user fields
    //         .populate("wallet", "balance"); // Populating 'wallet' and only getting 'balance' field
      
    //       // Respond with the users data including balance
    //       res.json(users);
    //     } catch (error) {
    //       console.error("Error fetching users:", error.message);
    //       res.status(500).json({ error: "Failed to fetch user data" });
    //     }
    //   };

     
  
      
    //   exports.updateUser = async (req, res) => {
    //     const { userId } = req.params;
    //     const { username, balance } = req.body;
      
    //     try {
    //       // Step 1: Update the user's username
    //       const updatedUser = await User.findByIdAndUpdate(
    //         userId,
    //         { username },
    //         { new: true } // Return updated user
    //       );
      
    //       if (!updatedUser) {
    //         return res.status(404).json({ success: false, message: 'User not found' });
    //       }
    
    //       // Step 2: Check if the user has a wallet
    //       let userWallet = await User_Wallet.findOne({ user: userId });
      
    //       if (!userWallet) {
    //         console.log("Wallet not found, creating a new one...");
    //         userWallet = new User_Wallet({
    //           user: userId,
    //           balance: balance || 15000, // Default balance if not provided
    //         });
      
    //         await userWallet.save();
      
    //         // Update user with new wallet ID if it's missing
    //         if (!updatedUser.wallet) {
    //           updatedUser.wallet = userWallet._id;
    //           await updatedUser.save();
    //         }
      
    
    //       } else {
    //         // Step 3: Update wallet balance
        
    //         userWallet.balance = Number(balance);
    //         await userWallet.save();
         
    //       }
      
    //       return res.status(200).json({
    //         success: true,
    //         message: 'User and wallet updated successfully',
    //         user: updatedUser,
    //         wallet: userWallet,
    //       });
      
    //     } catch (err) {
    //       console.error('Error updating user and wallet:', err);
    //       return res.status(500).json({ success: false, message: 'Server error' });
    //     }
    //   };