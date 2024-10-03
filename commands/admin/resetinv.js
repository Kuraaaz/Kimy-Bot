const { MessageEmbed } = require('discord.js');
const Inventory = require('../../models/inventory'); // Modèle d'inventaire
const logger = require('../../utils/logger'); // Logger

module.exports = {
  name: 'resetinv',
  description: 'Réinitialise l\'inventaire d\'un utilisateur mentionné ou soi-même.',
  async execute(message, args) {
    // Vérifier si l'utilisateur est administrateur
    if (!message.member.permissions.has('ADMINISTRATOR')) {
      return message.reply('Vous n\'avez pas les permissions nécessaires pour exécuter cette commande.');
    }

    // Si un utilisateur est mentionné, on réinitialise son inventaire, sinon on réinitialise celui de l'auteur
    const targetUser = message.mentions.users.first() || message.author;

    try {
      // Rechercher l'inventaire de l'utilisateur
      const userInventory = await Inventory.findOne({ userId: targetUser.id });

      if (!userInventory) {
        return message.reply(`L'utilisateur ${targetUser.tag} n'a pas d'inventaire.`);
      }

      // Supprimer l'inventaire de l'utilisateur
      await Inventory.deleteOne({ userId: targetUser.id });

      // Confirmation de la suppression de l'inventaire
      const embed = new MessageEmbed()
        .setTitle('Inventaire Réinitialisé')
        .setDescription(`L'inventaire de **${targetUser.tag}** a été réinitialisé.`)
        .setColor('#ff0000')
        .setTimestamp();

      await message.channel.send({ embeds: [embed] });

      // Log de la réinitialisation
      logger.info(`L'inventaire de ${targetUser.tag} a été réinitialisé par ${message.author.tag}.`);

    } catch (error) {
      console.error('Une erreur est survenue lors de la réinitialisation de l\'inventaire :', error);
      message.channel.send('Une erreur est survenue lors de la réinitialisation de l\'inventaire.');
    }
  },
};
