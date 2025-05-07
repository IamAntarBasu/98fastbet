const User = require("../models/UserSignUp");
const User_Wallet = require("../models/Wallet");
const Withdraw = require("../models/withdrawModel");
const News = require("../models/newsModel");
const mongoose = require('mongoose');
const cloudinary = require('../middlware/cloudinary')
// 🔸 Create a new withdrawal request
exports.createWithdrawal = async (req, res) => {
  try {
    const { user, phoneNumber, userName, email, withdrawAmount, upi_id, status } = req.body;

    // Validation
    if (!user || !withdrawAmount) {
      return res.status(400).json({
        success: false,
        message: "User ID and Withdraw Amount are required",
      });
    }
    const wallet = await User_Wallet.findOne({ user });
    const userData = await User.findById(user)
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    } else if (wallet.balance >= withdrawAmount && status === "Approve") {
      wallet.balance -= withdrawAmount;  // Add winnings
      userData.walletBalance -= withdrawAmount
    }
    // Save withdrawal
    const newWithdrawal = new Withdraw({
      user,
      upi_id,
      phoneNumber,
      userName,
      email,
      wthdrawAmount: withdrawAmount, // Match schema field
    });

    const savedWithdrawal = await newWithdrawal.save();
    await wallet.save()
    await userData.save()
    res.status(201).json({
      success: true,
      message: "Withdrawal request created successfully",
      data: savedWithdrawal,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// 🔸 Get withdrawals for a specific user
// 🔸 Get all withdrawals for a specific user



exports.getAllWithdrawals = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    // Fetch withdrawals & populate user details
    const withdrawals = await Withdraw.find({ user: new mongoose.Types.ObjectId(userId) });


    if (withdrawals.length === 0) {
      return res.status(404).json({ success: false, message: "No withdrawals found" });
    }

    res.status(200).json({ success: true, withdrawals });
  } catch (error) {
    console.error("Error fetching withdrawals:", error);
    res.status(500).json({ success: false, message: "Failed to fetch withdrawals" });
  }
};



exports.getAllPayments = async (req, res) => {
  try {
    const withdrawals = await Withdraw.find().populate('user', 'username');
    res.status(200).json({ success: true, withdrawals }); // Ensure correct response format
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};


exports.approveWithdrawal = async (req, res) => {
  try {
    const { withdrawalId, amount, userId } = req.body;

    const userWallet = await User_Wallet.findOne({ user: userId });
    if (!userWallet) {
      return res.status(404).json({ success: false, message: "User wallet not found" });
    }

    // Update the wallet balance
    userWallet.balance -= amount;
    await userWallet.save();


    // Update withdrawal status
    await Withdraw.findByIdAndUpdate(withdrawalId, { status: "Approved" });

    res.json({ success: true, message: "Withdrawal approved successfully!" });
  } catch (error) {
    console.error("Error approving withdrawal:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const bankDetailsModel = require("../models/bankDetailsModel");

exports.getbankdetails = async (req, res) => {
  try {
    const bankDetails = await bankDetailsModel.findOne();
    if (bankDetails) {
      res.json(bankDetails);
    } else {
      res.json({ upi_id: '' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updatebankapi = async (req, res) => {
  try {
    const { upi_id } = req.body;

    let bankDetails = await bankDetailsModel.findOne();
    if (bankDetails) {
      bankDetails.upi_id = upi_id;
      await bankDetails.save();
      return res.json({ success: true, message: 'UPI ID updated successfully' });
    } else {
      await bankDetailsModel.create({ upi_id });
      return res.json({ success: true, message: 'UPI ID saved successfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


exports.updatebankphone = async (req, res) => {
  try {
    const { phone } = req.body;

    let bankDetails = await bankDetailsModel.findOne();
    if (bankDetails) {
      bankDetails.phone = phone;
      await bankDetails.save();
      return res.json({ success: true, message: 'Phone Payment updated successfully' });
    } else {
      await bankDetailsModel.create({ upi_id });
      return res.json({ success: true, message: 'Phone Payment saved successfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


// Serve uploaded files



exports.getQrcode = async (req, res) => {
  try {
    const bankDetails = await bankDetailsModel.findOne();
    res.json({
      success: true,
      upi_id: bankDetails?.upi_id || '',
      qrCode: bankDetails?.qrCode || ''
    });
  } catch (error) {
    console.error("Error fetching QR Code:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.updatebankQr = async (req, res) => {
  try {
    console.log("okkkk")
    if (!req.file) {
      return res.status(400).json({ success: false, message: "QR Code file is required" });
    }
    const upload = await cloudinary.v2.uploader.upload(req.file.path);

    const qrCodePath = `uploads/${req.file.filename}`;
console.log(upload.secure_url)
    let bankDetails = await bankDetailsModel.findOne();
    if (bankDetails) {
      bankDetails.qrCode = upload.secure_url;
      await bankDetails.save();
      return res.json({ success: true, message: "QR Code updated successfully", qrCode: upload.secure_url });
    } else {
      await bankDetailsModel.create({ qrCode: upload.secure_url });
      return res.json({ success: true, message: "QR Code saved successfully", qrCode: upload.secure_url });
    }
  } catch (error) {
    console.error("Error updating QR Code:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


exports.getupiqr = async (req, res) => {
  try {
    const bankDetails = await bankDetailsModel.findOne().sort({ createdAt: -1 }); // Get the latest entry

    if (!bankDetails) {
      return res.status(404).json({ message: "No bank details found" });
    }

    res.json({
      upi_id: bankDetails.upi_id,
      qrCode: bankDetails.qrCode,
      phone: bankDetails.phone,
    });
  } catch (error) {
    console.error("Error fetching bank details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};




const addPointModel = require("../models/addPointModel");

exports.getuserDepositData = async (req, res) => {
  try {
    const withdrawals = await addPointModel.find().populate('user', 'username');
    res.status(200).json({ success: true, withdrawals }); // Ensure correct response format
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

exports.approveDepositPayment = async (req, res) => {
  try {
    const { withdrawalId, amount, userId } = req.body;
    // console.log(userId, amount);

    // Find the user
    const userWallet = await User_Wallet.findOne({ user: userId });
    if (!userWallet) {
      return res.status(404).json({ success: false, message: "User wallet not found" });
    }

    // Ensure balance and amount are numbers
    const currentBalance = parseFloat(userWallet.balance) || 0;
    const depositAmount = parseFloat(amount) || 0;

    // Update the wallet balance with proper rounding
    userWallet.balance = parseFloat((currentBalance + depositAmount).toFixed(2));
    await userWallet.save();

    // Update withdrawal status
    await addPointModel.findByIdAndUpdate(withdrawalId, { status: "Approved" });

    res.json({ success: true, message: "Deposit approved successfully!" });
  } catch (error) {
    console.error("Error approving deposit:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.userLoginUserNo = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, userNo: user.userNo });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}

exports.platformnews = async (req, res) => {
  try {
    const news = await News.find();
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

exports.updatenews = async (req, res) => {
  try {
    const { content } = req.body;

    let updatedNews = await News.findOneAndUpdate({}, { content }, { new: true });

    if (!updatedNews) {
      // If no news exists, create a new one
      updatedNews = await News.create({ content });
    }

    res.json(updatedNews);
  } catch (error) {
    res.status(500).json({ message: "Error updating news", error });
  }
};
