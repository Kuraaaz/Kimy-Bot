const IgnoredChannel = require('../../models/ignoredChannels');

module.exports = {
  name: 'ignoredxp',
  description: 'Ajoute ou supprime un salon ou une catégorie à ignorer pour le gain d\'XP',
  permissions: ['ADMINISTRATOR'], // Nécessite les permissions d'admin
  async execute(message, args) {
    const { guild, channel } = message;

    if (args.length < 2) {
      return message.reply("Usage : `+ignorexp <add/remove> <channel/category>`");
    }

    const action = args[0].toLowerCase();
    const target = message.mentions.channels.first() || guild.channels.cache.get(args[1]);

    if (!target) {
      return message.reply("Veuillez mentionner un salon valide ou fournir son ID.");
    }

    const isCategory = target.type === 'GUILD_CATEGORY';
    const type = isCategory ? 'category' : 'channel';

    if (action === 'add') {
      // Vérifier si le salon ou la catégorie est déjà ignoré
      const exists = await IgnoredChannel.findOne({ guildId: guild.id, channelId: target.id });
      if (exists) {
        return message.reply(`${type.charAt(0).toUpperCase() + type.slice(1)} est déjà ignoré.`);
      }

      // Ajouter le salon ou la catégorie à ignorer
      const newIgnored = new IgnoredChannel({
        guildId: guild.id,
        channelId: target.id,
        type
      });
      await newIgnored.save();
      return message.reply(`${type.charAt(0).toUpperCase() + type.slice(1)} ajouté à la liste des ignorés.`);

    } else if (action === 'remove') {
      // Supprimer le salon ou la catégorie de la liste ignorée
      const removed = await IgnoredChannel.findOneAndDelete({ guildId: guild.id, channelId: target.id });
      if (!removed) {
        return message.reply(`${type.charAt(0).toUpperCase() + type.slice(1)} n'était pas ignoré.`);
      }

      return message.reply(`${type.charAt(0).toUpperCase() + type.slice(1)} retiré de la liste des ignorés.`);
    } else {
      return message.reply("Action invalide. Utilisez `add` ou `remove`.");
    }
  }
};
