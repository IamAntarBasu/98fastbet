const express = require("express");
const addPointModel = require("../models/addPointModel");
const User = require("../models/UserSignUp");
const User_Wallet = require("../models/Wallet");
const axios = require("axios");

const router = express.Router();

router.post("/add-more-points", async (req, res) => {
  try {
    const { user, phoneNumber, deposite, status, userName, Utr } = req.body;

    // Check if wallet exists
    const wallet = await User_Wallet.findOne({ user });
    const userData = await User.findById(user);

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    // Update wallet balance
    if (status === "Approve") {
      wallet.balance += deposite;
      userData.walletBalance += deposite;
    }

    // Save deposit details
    const data = await addPointModel.create({
        user,
      userName,
      phoneNumber,
      deposite,
      Utr,
      date: Date.now(),
    });

    await wallet.save();
    await userData.save();

    // Send WhatsApp message
    const message = `Payment Submission Details:
    - Name: ${userName}
    - Phone No: ${phoneNumber || "N/A"}
    - Deposit: ₹${deposite}
    - UTR No: ${Utr}`;

    const whatsappUrl = `https://wa.me/91${8979066955}?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp in browser (optional: for server-side request use axios)
    // await axios.get(whatsappUrl); 

    return res.status(200).json({
      success: true,
      result: data,
      whatsappLink: whatsappUrl, // Optional: Return WhatsApp link if frontend wants to handle it
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({
      status: "Failed",
      message: e.message,
    });
  }
});

module.exports = router;
