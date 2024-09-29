const { MessageEmbed } = require('discord.js');
const IgnoredChannel = require('../../models/ignoredChannels'); // Assurez-vous que le chemin est correct

module.exports = {
  name: 'ignoredxpl',
  description: 'Affiche la liste de tous les salons ou catégories ignorés pour le gain d\'XP',
  async execute(message) {
    try {
      const { guild } = message;

      // Récupère tous les salons ignorés dans la base de données pour cette guilde
      const ignoredChannels = await IgnoredChannel.find({ guildId: guild.id });

      // Si aucun salon n'est ignoré
      if (!ignoredChannels.length) {
        return message.reply('Aucun salon ou catégorie n\'est actuellement ignoré pour le gain d\'XP.');
      }

      // Crée une liste numérotée de salons à afficher
      const ignoredChannelsList = ignoredChannels.map((ignored, index) => {
        const channel = guild.channels.cache.get(ignored.channelId);
        return channel 
          ? `**${index + 1}.** ${channel}` // Numéro et mention du salon
          : `**${index + 1}.** ID Invalide : ${ignored.channelId}`;
      });

      // Crée l'embed pour afficher la liste des salons ignorés
      const embed = new MessageEmbed()
        .setTitle('Salons Ignorés pour le gain d\'XP')
        .setDescription(ignoredChannelsList.join('\n'))
        .setColor('#0900ff')
        .setFooter('Voici les salons actuellement ignorés pour le gain d\'XP')
        .setTimestamp();

      // Envoie l'embed dans le canal actuel
      message.channel.send({ embeds: [embed] });

    } catch (error) {
      console.error('Erreur lors de l\'exécution de la commande ignorexpList:', error);
      return message.reply('Une erreur est survenue lors de l\'exécution de la commande.');
    }
  },
};
