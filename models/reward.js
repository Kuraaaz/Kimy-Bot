const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
  level: { type: Number, required: true, unique: true },
  roleId: { type: String, required: true },
});

module.exports = mongoose.model('Reward', rewardSchema);
