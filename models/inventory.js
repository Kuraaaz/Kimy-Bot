const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  items: [
    {
      name: { type: String, required: true },
      type: { type: String, required: true }, // Par exemple 'Titre', 'Item', etc.
    }
  ],
});

module.exports = mongoose.model('Inventory', inventorySchema);
