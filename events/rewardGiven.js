const { MessageEmbed } = require('discord.js');
const logger = require('../utils/logger'); // Importer Logger

module.exports = {
  name: 'rewardGiven',
  async execute(member, role) {
    try {
      const embed = new MessageEmbed()
        .setTitle('Récompense Conférée!')
        .setDescription(`🎉 ${member.user.username}, vous avez reçu le rôle **${role.name}**! 🎉`)
        .setColor('#00FF00')
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setTimestamp();

      // Utiliser l'ID du salon spécifique pour envoyer le message
      const channel = member.guild.channels.cache.get('1289691264270471311');
      if (channel) {
        await channel.send({ embeds: [embed] });
        logger.event(`Récompense donnée à ${member.user.username} pour le rôle ${role.name}`);
      } else {
        logger.error('Le salon spécifié pour envoyer le message de récompense est introuvable.');
      }
    } catch (error) {
      logger.error('Une erreur est survenue lors de l\'envoi de l\'embed de récompense :', error);
    }
  }
};