const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  items: [{ type: String }] // Liste des noms des items
});

module.exports = mongoose.model('Inventory', inventorySchema);
