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

    items.forEach((item, index) => {
        const role = message.guild.roles.cache.get(item.roleId);
        const itemDisplay = item.type === 'role' && role 
        ? `${role.name}`
        : item.name;
  
        embed.addField(`${index + 1}. **${itemDisplay}**`, `Prix: **${item.price}** monnaie`, false);
    });
  

      await message.channel.send({ embeds: [embed] });
      logger.info('Shop list displayed successfully.');
    } catch (error) {
      console.error('Une erreur est survenue lors de l\'exécution de la commande shoplist :', error);
      message.channel.send('Une erreur est survenue lors de la récupération de la liste des achats.');
    }
  }
};
