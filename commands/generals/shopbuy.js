const { MessageEmbed } = require('discord.js');
const Inventory = require('../../models/inventory'); // Modèle d'inventaire
const ShopItem = require('../../models/shop'); // Modèle du shop
const UserMoney = require('../../models/money'); // Modèle d'argent
const logger = require('../../utils/logger'); // Logger

module.exports = {
  name: 'shopbuy',
  description: 'Acheter un item ou un rôle du shop.',
  async execute(message, args) {
    try {
      const itemName = args.join(' ').trim(); // Récupérer le nom de l'item à acheter
      if (!itemName) {
        return message.reply('Veuillez spécifier le nom de l\'item que vous souhaitez acheter.');
      }

      // Log pour vérifier quel nom d'item est reçu
      console.log(`Nom de l'item cherché : ${itemName}`);

      // Cherche l'item dans le shop
      const item = await ShopItem.findOne({ name: itemName });
      if (!item) {
        return message.reply(`L'item **${itemName}** n'existe pas dans le shop.`);
      }

      // Log pour vérifier si l'item est trouvé
      console.log(`Item trouvé : ${item.name}, Prix: ${item.price}`);

      // Vérifier la quantité d'argent de l'utilisateur
      const userMoneyData = await UserMoney.findOne({ userId: message.author.id });
      if (!userMoneyData) {
        return message.reply('Vous n\'avez pas d\'argent sur votre compte.');
      }

      // Log pour vérifier combien d'argent l'utilisateur possède
      console.log(`Argent utilisateur : ${userMoneyData.amount}, Prix de l'item : ${item.price}`);

      if (userMoneyData.amount < item.price) {
        return message.reply(`Vous n'avez pas assez d'argent pour acheter **${item.name}**. Il vous manque ${item.price - userMoneyData.amount}.`);
      }

      // Soustraire le prix de l'item
      userMoneyData.amount -= item.price;
      await userMoneyData.save();

      // Ajouter l'item ou le rôle à l'inventaire de l'utilisateur
      let userInventory = await Inventory.findOne({ userId: message.author.id });
      if (!userInventory) {
        userInventory = new Inventory({
          userId: message.author.id,
          items: [],
        });
      }

      // Si l'item est un rôle, l'ajouter à l'utilisateur
      if (item.type === 'role' && item.roleId) {
        const role = message.guild.roles.cache.get(item.roleId);
        if (role) {
          await message.member.roles.add(role); // Ajouter le rôle à l'utilisateur
          message.reply(`Félicitations ! Vous avez reçu le rôle **${role.name}** !`);
        } else {
          return message.reply('Le rôle spécifié est introuvable sur ce serveur.');
        }
      }

      // Ajouter l'item ou le rôle à l'inventaire
      userInventory.items.push({ name: item.name, type: item.type });
      await userInventory.save();

      // Confirmation de l'achat
      const embed = new MessageEmbed()
        .setTitle('Achat Réussi !')
        .setDescription(`Vous avez acheté **${item.name}** pour **${item.price}** monnaie !`)
        .setColor('#00ff00')
        .setTimestamp();

      await message.channel.send({ embeds: [embed] });
      logger.info(`${message.author.tag} a acheté ${item.name} pour ${item.price} monnaie.`);
      
    } catch (error) {
      console.error('Une erreur est survenue lors de l\'exécution de la commande shopbuy :', error);
      message.channel.send('Une erreur est survenue lors de l\'achat de l\'item.');
    }
  },
};