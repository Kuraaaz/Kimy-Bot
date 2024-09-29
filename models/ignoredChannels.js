const mongoose = require('mongoose');

const ignoredChannelSchema = new mongoose.Schema({
  guildId: { type: String, required: true }, // L'ID du serveur
  channelId: { type: String, required: true }, // L'ID du salon ou de la catégorie ignorée
  type: { type: String, enum: ['channel', 'category'], required: true } // Type (salon ou catégorie)
});

module.exports = mongoose.model('IgnoredChannel', ignoredChannelSchema);
