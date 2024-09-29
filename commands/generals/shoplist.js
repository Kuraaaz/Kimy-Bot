const { MessageEmbed } = require('discord.js');
const Shop = require('../../models/shop'); // Import du modèle de shop
const logger = require('../../utils/logger'); // Import de Logger

module.exports = {
  name: 'shoplist',
  description: 'Affiche la liste des items et rôles disponibles à l\'achat.',
  async execute(message) {
    try {
      // Récupérer tous les items du shop
      const items = await Shop.find({});
      console.log('Items récupérés :', items); // Journal des items récupérés

      if (items.length === 0) {
        return message.reply('Il n\'y a actuellement aucun item dans le shop.');
      }

      // Création de l'embed pour afficher les items
      const embed = new MessageEmbed()
        .setTitle('Liste des Achats Disponibles')
        .setColor('#00FF00')
        .setTimestamp();

      // Ajouter chaque item à l'embed
      items.forEach((item, index) => {
        const itemDisplay = item.type === 'role' && item.roleId 
          ? `<@&${item.roleId}>` // Mentionne le rôle si roleId existe
          : item.name; // Affiche le nom de l'item

        embed.addField(`${index + 1}. **${itemDisplay}**`, `Prix: **${item.price}** Kimyus`, false);

        // Log pour vérifier si le rôle peut être mentionné
        console.log(`Item: ${item.name}, Type: ${item.type}, Role ID: ${item.roleId}, Mention: ${itemDisplay}`);
      });

      await message.channel.send({ embeds: [embed] });
      logger.info('Shop list displayed successfully.');
    } catch (error) {
      console.error('Une erreur est survenue lors de l\'exécution de la commande shoplist :', error);
      message.channel.send('Une erreur est survenue lors de la récupération de la liste des achats.');
    }
  }
};
