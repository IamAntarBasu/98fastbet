const mongoose = require('mongoose');

const WithdrawSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        upi_id:{type:String},
        phoneNumber: { type: String },
        userName: { type: String },
        status:{type:String, default:"Pending"},
        wthdrawAmount: { type: String }
    },
    { timestamps: true }
);

const Withdraw = mongoose.model('withdraw', WithdrawSchema);
module.exports = Withdraw;