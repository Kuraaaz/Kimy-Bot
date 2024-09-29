const { MessageEmbed } = require('discord.js');
const IgnoredChannel = require('../../models/ignoredChannels'); // Import du modèle des salons ignorés

module.exports = {
  name: 'ignoredxpr',
  description: 'Enlève un salon de la liste des salons ignorés pour le gain d\'XP.',
  async execute(message, args) {
    try {
      // Vérifier si l'utilisateur a la permission d'administrateur
      if (!message.member.permissions.has('ADMINISTRATOR')) {
        return message.reply('Vous n\'avez pas la permission d\'exécuter cette commande.');
      }

      // Vérifiez si un salon a été mentionné
      const targetChannel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
      if (!targetChannel) {
        return message.reply('Veuillez mentionner un salon valide ou fournir un ID de salon.');
      }

      // Cherche le salon dans la base de données
      const ignoredChannel = await IgnoredChannel.findOne({ guildId: message.guild.id, channelId: targetChannel.id });
      if (!ignoredChannel) {
        return message.reply(`Le salon **${targetChannel.name}** n'est pas dans la liste des salons ignorés.`);
      }

      // Supprime le salon de la base de données
      await IgnoredChannel.deleteOne({ guildId: message.guild.id, channelId: targetChannel.id });

      const embed = new MessageEmbed()
        .setTitle('Salon Retiré')
        .setDescription(`Le salon **${targetChannel.name}** a été retiré de la liste des salons ignorés pour le gain d'XP.`)
        .setColor('#ff0000')
        .setTimestamp();

      await message.channel.send({ embeds: [embed] });

    } catch (error) {
      console.error('Une erreur est survenue lors de l\'exécution de la commande ignoredxpremove :', error);
      message.channel.send('Une erreur est survenue lors de la suppression du salon ignoré.');
    }
  }
};