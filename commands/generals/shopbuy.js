const { MessageEmbed } = require('discord.js');
const Inventory = require('../../models/inventory'); // Import du modèle d'inventaire
const ShopItem = require('../../models/shop'); // Import du modèle de shop
const UserMoney = require('../../models/money'); // Import du modèle d'argent
const logger = require('../../utils/logger'); // Import de Logger

module.exports = {
  name: 'shopbuy',
  description: 'Acheter un item du shop.',
  async execute(message, args) {
    try {
      const itemName = args.join(' '); // Récupérer le nom de l'item à acheter
      if (!itemName) {
        return message.reply('Veuillez spécifier le nom de l\'item que vous souhaitez acheter.');
      }

      // Cherche l'item dans le shop
      const item = await ShopItem.findOne({ name: itemName });
      if (!item) {
        return message.reply('Cet item n\'existe pas dans le shop.');
      }

      // Vérifier la quantité d'argent de l'utilisateur
      const userMoneyData = await UserMoney.findOne({ userId: message.author.id });
      if (!userMoneyData || userMoneyData.amount < item.price) {
        return message.reply('Vous n\'avez pas assez d\'argent pour acheter cet item.');
      }

      // Soustraire le prix de l'item
      userMoneyData.amount -= item.price;
      await userMoneyData.save();

      // Ajouter l'item à l'inventaire de l'utilisateur
      let userInventory = await Inventory.findOne({ userId: message.author.id });
      if (!userInventory) {
        userInventory = new Inventory({
          userId: message.author.id,
          items: [],
        });
      }

      // Ajouter l'item à l'inventaire
      userInventory.items.push(item.name);
      await userInventory.save();

      // Confirmation de l'achat
      const embed = new MessageEmbed()
        .setTitle('Achat Réussi !')
        .setDescription(`Vous avez acheté **${item.name}** pour **${item.price}** !`)
        .setColor('#00ff00')
        .setTimestamp();

      await message.channel.send({ embeds: [embed] });
      logger.info(`${message.author.tag} a acheté ${item.name} pour ${item.price}$.`);
      
    } catch (error) {
      console.error('Une erreur est survenue lors de l\'exécution de la commande shopbuy :', error);
      message.channel.send('Une erreur est survenue lors de l\'achat de l\'item.');
    }
  },
};
