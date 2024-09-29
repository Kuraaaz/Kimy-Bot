const mongoose = require('mongoose');

const userMoneySchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true }, // L'ID de l'utilisateur Discord
  amount: { type: Number, default: 0 }, // La quantité de monnaie que l'utilisateur possède
  lastUpdated: { type: Date, default: Date.now } // Date de la dernière mise à jour du solde
});

module.exports = mongoose.model('UserMoney', userMoneySchema);
