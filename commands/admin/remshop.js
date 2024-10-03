const { MessageEmbed } = require('discord.js');
const ShopItem = require('../../models/shop'); // Modèle du shop
const logger = require('../../utils/logger'); // Logger

module.exports = {
  name: 'remshop',
  description: 'Supprime un item du shop par sa position.',
  async execute(message, args) {
    try {
      // Vérifier si l'utilisateur a le rôle d'administrateur
      if (!message.member.permissions.has('ADMINISTRATOR')) {
        return message.reply('Vous n\'avez pas la permission de faire cela.');
      }

      const index = parseInt(args[0]); // Récupérer l'index de l'item à supprimer
      if (isNaN(index) || index < 1) {
        return message.reply('Veuillez spécifier un numéro de position valide.');
      }

      // Récupérer tous les items du shop
      const items = await ShopItem.find();
      if (items.length === 0) {
        return message.reply('Le shop est vide.');
      }

      // Vérifier si l'index est valide
      if (index > items.length) {
        return message.reply(`Il n'y a pas d'item à la position ${index}. Le shop contient ${items.length} items.`);
      }

      // Supprimer l'item à la position spécifiée
      const itemToRemove = items[index - 1]; // L'index est 0-based, donc on soustrait 1
      await ShopItem.deleteOne({ _id: itemToRemove._id }); // Supprimer l'item

      // Confirmation de la suppression
      const embed = new MessageEmbed()
        .setTitle('Item Supprimé !')
        .setDescription(`L'item **${itemToRemove.name}** a été supprimé du shop.`)
        .setColor('#ff0000')
        .setTimestamp();

      await message.channel.send({ embeds: [embed] });
      logger.info(`${message.author.tag} a supprimé ${itemToRemove.name} du shop.`);
      
    } catch (error) {
      console.error('Une erreur est survenue lors de l\'exécution de la commande remshop :', error);
      message.channel.send('Une erreur est survenue lors de la suppression de l\'item.');
    }
  },
};
