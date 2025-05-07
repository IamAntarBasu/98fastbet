const bcrypt = require("bcryptjs"); 
const User_Wallet = require('../models/Wallet'); 
const MatkaPage = require('../models/pagematkaModel');
const AarParModel = require('../models/AarParPageModel');
const Avaitorpagemodel = require('../models/AvaitaorPageModel');
const CricketPageModel=require('../models/CricketPageModel')
const matkapagelogin = async (req, res) => {
 
  try {
    const { username, email, password, balance } = req.body;

    if (!username || !email || !password || balance === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await MatkaPage.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new MatkaPage({
      username,
      email,
      password: hashedPassword,
    });

    // Save user first
    const savedUser = await newUser.save();

    // Create wallet for the user
    const wallet = new User_Wallet({
      user: savedUser._id,
      balance: balance, // Store initial balance
    });

    const savedWallet = await wallet.save();

    // Link wallet to user
    savedUser.wallet = savedWallet._id;
    await savedUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        balance: savedWallet.balance,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


const avaitorpagesignup = async (req, res) => {
 
  try {
    const { username, email, password, balance } = req.body;

    if (!username || !email || !password || balance === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await Avaitorpagemodel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new Avaitorpagemodel({
      username,
      email,
      password: hashedPassword,
    });

    // Save user first
    const savedUser = await newUser.save();

    // Create wallet for the user
    const wallet = new User_Wallet({
      user: savedUser._id,
      balance: balance, // Store initial balance
    });

    const savedWallet = await wallet.save();

    // Link wallet to user
    savedUser.wallet = savedWallet._id;
    await savedUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        balance: savedWallet.balance,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const aarpaarparchpagelogin = async (req, res) => {
 
  try {
    const { username, email, password, balance } = req.body;

    if (!username || !email || !password || balance === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await AarParModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new AarParModel({
      username,
      email,
      password: hashedPassword,
    });

    // Save user first
    const savedUser = await newUser.save();

    // Create wallet for the user
    const wallet = new User_Wallet({
      user: savedUser._id,
      balance: balance, // Store initial balance
    });

    const savedWallet = await wallet.save();

    // Link wallet to user
    savedUser.wallet = savedWallet._id;
    await savedUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        balance: savedWallet.balance,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


const cricketpagesignup = async (req, res) => {
 
  try {
    const { username, email, password, balance } = req.body;

    if (!username || !email || !password || balance === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await CricketPageModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new CricketPageModel({
      username,
      email,
      password: hashedPassword,
    });

    // Save user first
    const savedUser = await newUser.save();

    // Create wallet for the user
    const wallet = new User_Wallet({
      user: savedUser._id,
      balance: balance, // Store initial balance
    });

    const savedWallet = await wallet.save();

    // Link wallet to user
    savedUser.wallet = savedWallet._id;
    await savedUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        balance: savedWallet.balance,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const titlipagesignup = async (req, res) => {
 
  try {
    const { username, email, password, balance } = req.body;

    if (!username || !email || !password || balance === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await CricketPageModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new CricketPageModel({
      username,
      email,
      password: hashedPassword,
    });

    // Save user first
    const savedUser = await newUser.save();

    // Create wallet for the user
    const wallet = new User_Wallet({
      user: savedUser._id,
      balance: balance, // Store initial balance
    });

    const savedWallet = await wallet.save();

    // Link wallet to user
    savedUser.wallet = savedWallet._id;
    await savedUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        balance: savedWallet.balance,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//Pages login
const avaitoradminlogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user in DB
    const user = await Avaitorpagemodel.findOne({ email }).populate('wallet');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Respond with user details (without JWT)
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        walletBalance: user.wallet?.balance || 0,
      },
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


const matkaadminlogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user in DB
    const user = await MatkaPage.findOne({ email }).populate('wallet');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Respond with user details (without JWT)
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        walletBalance: user.wallet?.balance || 0,
      },
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


const titliadminlogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user in DB
    const user = await AarParModel.findOne({ email }).populate('wallet');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Respond with user details (without JWT)
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        walletBalance: user.wallet?.balance || 0,
      },
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


const cricketpageadmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user in DB
    const user = await CricketPageModel.findOne({ email }).populate('wallet');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Respond with user details (without JWT)
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        walletBalance: user.wallet?.balance || 0,
      },
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


const paymentpageadmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user in DB
    const user = await AarParModel.findOne({ email }).populate('wallet');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Respond with user details (without JWT)
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        walletBalance: user.wallet?.balance || 0,
      },
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {paymentpageadmin,titlipagesignup,cricketpageadmin,cricketpagesignup, titliadminlogin,matkaadminlogin,matkapagelogin ,avaitorpagesignup ,aarpaarparchpagelogin,avaitoradminlogin};
