const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  type: { type: String, required: true }, // 'item' ou 'role'
  roleId: { type: String } // ID du rôle, peut être nullable
});

module.exports = mongoose.model('Shop', shopSchema);
