const mongoose = require('mongoose');

const moneySchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  amount: { type: Number, default: 0 },
});

const UserMoney = mongoose.model('UserMoney', moneySchema);
module.exports = UserMoney;
