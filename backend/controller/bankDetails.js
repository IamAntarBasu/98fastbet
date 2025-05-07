// formData.append("upi_id", upiID);
// formData.append("account_No", "11122220221229865310");
// formData.append("accoundHolderName", "Easebuzz");

const express = require("express");
const bankDetailsModel = require("../models/bankDetailsModel")
const uploader = require("../middlware/upload");
// const addPointRouterNew = express.Router()
const cloudinary = require('../middlware/cloudinary')
const router = express.Router()
router.post("/add-bank-details", uploader.single("qrCode"), async (req, res) => {
    try {
            const {  upi_id, account_No, accoundHolderName } = req.body;
            const upload = await cloudinary.v2.uploader.upload(req.file.path);
            // console.log(req.file)
            const data = await bankDetailsModel.insertMany({
                // user,
                // phoneNumber,
                upi_id,
                account_No,
                accoundHolderName,
                qrCode: upload.secure_url,
                Date: Date.now()
            })
            // console.log(Date)
            return res.status(200).json({
                success: true,
                result: data
            });
        }

    // }
    catch (e) {
        console.log(e)
        res.status(404).json({
            status: "Failed",
            message: e.message,
          
        })
    }
});


router.get("/get-bank-details", async (req, res) => {
    try {
        const bankDetails = await bankDetailsModel.find(); // Fetch all bank details

        return res.status(200).json({
            success: true,
            result: bankDetails
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            status: "Failed",
            message: e.message
        });
    }
});

module.exports = router