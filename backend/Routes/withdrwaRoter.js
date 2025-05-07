const express = require("express");
const router = express.Router();
const withdrawController = require("../controller/withdrawController");
const upload = require("../middlware/multer");
// Route to create a withdrawal request
router.post("/withdraw", withdrawController.createWithdrawal);

// Route to fetch all withdrawals
router.get('/getupiqr', withdrawController.getupiqr);
router.get('/getwithdrawal/:userId', withdrawController.getAllWithdrawals);
router.get('/platform/news', withdrawController.platformnews);
router.get('/userLoginUserNo/:username', withdrawController.userLoginUserNo);
router.get('/admin/getuserpayemt', withdrawController.getAllPayments);
router.post('/admin/approveWithdrawal', withdrawController.approveWithdrawal);
router.get('/admin/getbankdetails', withdrawController.getbankdetails);
router.post('/admin/updatebankapi', withdrawController.updatebankapi);
router.get('/admin/getQrcode', withdrawController.getQrcode);
router.post('/admin/updatebankQr', upload.single("qrCode"), withdrawController.updatebankQr);
router.get('/admin/getuserDepositData', withdrawController.getuserDepositData);
router.post('/admin/approveDepositPayment', withdrawController.approveDepositPayment);
router.post('/admin/updatebankphone', withdrawController.updatebankphone);
router.put('/admin/updatenews', withdrawController.updatenews);
module.exports = router;