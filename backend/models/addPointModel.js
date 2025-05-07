const mongoose = require('mongoose');
const addPointSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    phoneNumber: { type: String },
    userName :{type:String}, 
    deposite:{type:String},
    status:{type:String, default:"Pending"},
    Utr: { type: String },

}, { timestamps: true });
const addPointModel = mongoose.model('addPoint', addPointSchema);
module.exports = addPointModel;