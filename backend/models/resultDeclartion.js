const mongoose = require('mongoose');

const newDeclarationSchema = new mongoose.Schema({
  match: { type: String, required: true },
  winner: { type: String, required: true },
  resultType: { type: String, required: true },
  declared_by: { type: String, default: 'admin' },
  timestamp: { type: Date, default: Date.now }
});

const ResultDeclaration = mongoose.model('ResultDeclaration', newDeclarationSchema);
module.exports = ResultDeclaration;