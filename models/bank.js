const mongoose = require('mongoose');

const bankSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true, // Chaque utilisateur doit avoir un enregistrement unique
  },
  balance: {
    type: Number,
    default: 0, // Solde initial
  },
});

module.exports = mongoose.model('Bank', bankSchema);
