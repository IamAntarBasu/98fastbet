const User = require('../models/UserSignUp');
const Wallet = require('../models/Wallet');
const Bid = require('../models/betModel');
const PapuModel = require('../models/papuModel');
const AvaitorModel = require('../models/avaitorModel');
const MinesModel = require('../models/mines');
const CrickbetModel = require('../models/crickbetModel');
const AarParParchiModel = require('../models/aarParparchiModel');

// Get all admin users
exports.getAllAdminUser = async (req, res) => {
  try {
    // Find all users and populate their wallet information
    const users = await User.find().populate('wallet');
    
    // Format the response data
    const formattedUsers = users.map(user => ({
      _id: user._id,
      username: user.username,
      email: user.email,
      userNo: user.userNo || user._id.substring(0, 8),
      wallet: {
        balance: user.wallet ? user.wallet.balance : 0,
        exposureBalance: user.wallet ? user.wallet.exposureBalance : 0
      },
      createdAt: user.createdAt
    }));
    
    res.status(200).json(formattedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// Update user details
exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { username, balance } = req.body;
    
    // Find the user to update
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Update username if provided
    if (username) {
      user.username = username;
      await user.save();
    }
    
    // Update wallet balance if provided
    if (balance !== undefined) {
      const wallet = await Wallet.findOne({ user: userId });
      if (wallet) {
        wallet.balance = balance;
        await wallet.save();
      } else {
        // Create wallet if it doesn't exist
        const newWallet = new Wallet({
          user: userId,
          balance: balance
        });
        await newWallet.save();
        
        // Link wallet to user
        user.wallet = newWallet._id;
        await user.save();
      }
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'User updated successfully',
      user: {
        _id: user._id,
        username: user.username,
        balance: balance || (await Wallet.findOne({ user: userId }))?.balance || 0
      }
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ success: false, message: 'Error updating user', error: error.message });
  }
};

// Helper function to safely convert mongoose document to plain object
const safeToObject = (doc) => {
  try {
    if (!doc) return {};
    if (typeof doc.toObject === 'function') {
      return doc.toObject();
    } else if (doc._doc) {
      // Mongoose documents often have a _doc property with the raw data
      return { ...doc._doc };
    } else if (doc instanceof Object) {
      // If it's already an object, create a shallow copy
      return { ...doc };
    } else {
      // Return empty object as fallback
      return {};
    }
  } catch (error) {
    console.error('Error in safeToObject:', error);
    // Return a new object with all enumerable properties copied
    if (doc && typeof doc === 'object') {
      try {
        return JSON.parse(JSON.stringify(doc));
      } catch (e) {
        return {};
      }
    }
    return {};
  }
};

// Get user's bet history
exports.getUserBets = async (req, res) => {
  try {
    const { userId } = req.params;
    const { gameType } = req.query;
    
    console.log(`Fetching bet history for user ${userId}, game type: ${gameType || 'all'}`);
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      console.log(`User not found with ID: ${userId}`);
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log(`User found: ${user.username}`);
    let bets = [];
    
    // Helper to safely convert MongoDB documents to plain objects
    const safeParse = (doc) => {
      try {
        if (!doc) return null;
        // Try toObject first if it's a mongoose document
        if (typeof doc.toObject === 'function') {
          return doc.toObject();
        }
        // If it has _doc property (mongoose internals)
        else if (doc._doc) {
          return { ...doc._doc };
        }
        // If it's already an object
        else if (doc instanceof Object) {
          return { ...doc };
        }
        return null;
      } catch (e) {
        console.error('Error parsing document:', e);
        return null;
      }
    };
    
    // Process a specific bet model
    const processBets = async (query, gameType) => {
      console.log(`Fetching ${gameType} bets for user ${userId}`);
      try {
        const result = await query;
        
        console.log(`Found ${result.length} ${gameType} bets`);
        
        // Sample the first bet for debugging
        if (result.length > 0) {
          console.log(`Sample ${gameType} bet fields:`, Object.keys(result[0]._doc || result[0]).join(', '));
        }
        
        // Process each bet
        return result.map(bet => {
          const parsed = safeParse(bet);
          if (!parsed) return null;
          
          // Add gameType to each record 
          return {
            ...parsed,
            gameType // This ensures every record has a consistent gameType field
          };
        }).filter(bet => bet !== null);
      } catch (err) {
        console.error(`Error processing ${gameType} bets:`, err);
        return [];
      }
    };
    
    // Fetch bets based on game type
    if (gameType) {
      console.log(`Fetching specific game type: ${gameType}`);
      
      switch(gameType.toLowerCase()) {
        case 'matka':
          bets = await processBets(
            Bid.find({ user: userId }).sort({ createdAt: -1 }), 
            'Matka'
          );
          break;
          
        case 'titli':
          bets = await processBets(
            PapuModel.find({ user: userId }).sort({ createdAt: -1 }), 
            'Titli'
          );
          break;
          
        case 'aviator':
          bets = await processBets(
            AvaitorModel.find({ user: userId }).sort({ createdAt: -1 }), 
            'Aviator'
          );
          break;
          
        case 'mines':
          bets = await processBets(
            MinesModel.find({ user: userId }).sort({ createdAt: -1 }), 
            'Mines'
          );
          break;
          
        case 'cricket':
          bets = await processBets(
            CrickbetModel.find({ user: userId }).sort({ createdAt: -1 }), 
            'Cricket'
          );
          break;
          
        case 'aarpaarparchi':
          bets = await processBets(
            AarParParchiModel.find({ user: userId }).sort({ createdAt: -1 }), 
            'Aar Paar Parchi'
          );
          break;
          
        default:
          return res.status(400).json({ message: 'Invalid game type' });
      }
    } else {
      // Fetch all game types
      console.log(`Fetching all game types for user ${userId}`);
      
      try {
        // Process all bet types in parallel for better performance
        const [matkaBets, titliBets, aviatorBets, minesBets, cricketBets, aarPaarParchiBets] = await Promise.all([
          processBets(Bid.find({ user: userId }).sort({ createdAt: -1 }).limit(50), 'Matka'),
          processBets(PapuModel.find({ user: userId }).sort({ createdAt: -1 }).limit(50), 'Titli'),
          processBets(AvaitorModel.find({ user: userId }).sort({ createdAt: -1 }).limit(50), 'Aviator'),
          processBets(MinesModel.find({ user: userId }).sort({ createdAt: -1 }).limit(50), 'Mines'),
          processBets(CrickbetModel.find({ user: userId }).sort({ createdAt: -1 }).limit(50), 'Cricket'),
          processBets(AarParParchiModel.find({ user: userId }).sort({ createdAt: -1 }).limit(50), 'Aar Paar Parchi')
        ]);
        
        // Log counts for debugging
        console.log({
          matkaBetsCount: matkaBets.length,
          titliBetsCount: titliBets.length,
          aviatorBetsCount: aviatorBets.length,
          minesBetsCount: minesBets.length,
          cricketBetsCount: cricketBets.length,
          aarPaarParchiBetsCount: aarPaarParchiBets.length
        });
        
        // Combine all bets
        bets = [
          ...matkaBets,
          ...titliBets,
          ...aviatorBets,
          ...minesBets,
          ...cricketBets,
          ...aarPaarParchiBets
        ];
        
        // Sort by date
        bets.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB - dateA; // Descending order (newest first)
        });
        
        console.log(`Total bets: ${bets.length}`);
      } catch (err) {
        console.error('Error fetching combined bets:', err);
      }
    }
    
    res.status(200).json({ bets });
  } catch (error) {
    console.error('Error in getUserBets:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.version = '1.0.0'; 