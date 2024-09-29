const { MessageEmbed } = require('discord.js');
const Inventory = require('../../models/inventory'); // Import du modèle MongoDB pour l'inventaire
const logger = require('../../utils/logger'); // Import de Logger

module.exports = {
  name: 'inventory',
  description: 'Affiche l\'inventaire de l\'utilisateur mentionné ou de l\'invocateur.',
  async execute(message, args) {
    try {
      // Vérifie si un membre a été mentionné
      const mentionedMember = message.mentions.members.first() || message.member;
      const userId = mentionedMember.id;

      // Cherche l'inventaire de l'utilisateur
      const userInventory = await Inventory.findOne({ userId });

      const embed = new MessageEmbed()
        .setTitle(`${mentionedMember.user.username}'s Inventaire`)
        .setColor('#1809f3')
        .setTimestamp();

      if (userInventory && userInventory.items.length > 0) {
        embed.setDescription(`Items : \n- ${userInventory.items.join('\n- ')}`);
      } else {
        embed.setDescription('Cet utilisateur n\'a aucun item dans son inventaire.');
      }

      await message.channel.send({ embeds: [embed] });
      logger.info(`Inventaire affiché pour ${mentionedMember.user.username} (${userId}).`);
    } catch (error) {
      console.error('Une erreur est survenue lors de l\'exécution de la commande inventory :', error);
      message.channel.send('Une erreur est survenue lors de l\'affichage de l\'inventaire.');
    }
  }
};
