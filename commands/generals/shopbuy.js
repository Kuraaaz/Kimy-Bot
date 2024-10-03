const { MessageEmbed } = require('discord.js');
const Inventory = require('../../models/inventory'); // Modèle d'inventaire
const ShopItem = require('../../models/shop'); // Modèle du shop
const Bank = require('../../models/bank'); // Modèle de banque
const logger = require('../../utils/logger'); // Logger

module.exports = {
  name: 'shopbuy',
  description: 'Acheter un item ou un rôle du shop par position.',
  async execute(message, args) {
    try {
      const index = parseInt(args[0]); // Récupérer l'index de l'item à acheter
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

      const item = items[index - 1]; // L'index est 0-based, donc on soustrait 1
      console.log(`Item trouvé : ${item.name}, Prix: ${item.price}`);

      // Vérifier la quantité d'argent de l'utilisateur dans la banque
      let userBank = await Bank.findOne({ userId: message.author.id });

      // Si l'utilisateur n'a pas encore de compte en banque, on le crée avec un solde de 0
      if (!userBank) {
        userBank = new Bank({
          userId: message.author.id,
          balance: 0 // Initialiser avec 0 monnaie
        });
        await userBank.save(); // Sauvegarder les données par défaut
      }

      // Log pour vérifier combien d'argent l'utilisateur possède
      console.log(`Argent utilisateur : ${userBank.balance}, Prix de l'item : ${item.price}`);

      // Vérifier si l'utilisateur a assez d'argent
      if (userBank.balance < item.price) {
        return message.reply(`Vous n'avez pas assez d'argent pour acheter **${item.name}**. Il vous manque ${item.price - userBank.balance} monnaie.`);
      }

      // Soustraire le prix de l'item du solde de l'utilisateur
      userBank.balance -= item.price;  // Correctement déduire l'argent
      console.log(`Nouvel argent utilisateur : ${userBank.balance}`); // Log pour vérifier la mise à jour

      // Sauvegarder les données de la banque mises à jour
      await userBank.save();  // Sauvegarder après modification

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

      // Sauvegarder les modifications dans l'inventaire
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
