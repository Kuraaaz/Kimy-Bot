const { MessageEmbed } = require('discord.js');
const ShopItem = require('../../models/shop');

module.exports = {
  name: 'addshop',
  description: 'Ajoute un nouvel item au shop.',
  async execute(message, args) {
    try {
      if (!message.member.permissions.has('ADMINISTRATOR')) {
        return message.reply('Vous n\'avez pas la permission d\'exécuter cette commande.');
      }

      if (args.length < 4) {
        return message.reply('Veuillez fournir le nom, le prix, le type et la mention du rôle (ex: `+addshop <nom> <prix> <type> <@role>`).');
      }

      const roleMentioned = message.mentions.roles.first();
      if (!roleMentioned) {
        return message.reply('Veuillez mentionner un rôle valide.');
      }

      const argsWithoutRole = args.filter(arg => arg !== `<@&${roleMentioned.id}>`);

      const price = argsWithoutRole[argsWithoutRole.length - 2];
      const type = argsWithoutRole[argsWithoutRole.length - 1];
      const name = argsWithoutRole.slice(0, argsWithoutRole.length - 2).join(' ');

      const priceNumber = parseFloat(price);
      if (isNaN(priceNumber) || priceNumber <= 0) {
        return message.reply('Veuillez spécifier un prix valide.');
      }

      const newItem = new ShopItem({
        name: name,
        price: priceNumber,
        type: type,
        roleId: roleMentioned.id
      });

      await newItem.save();
      message.channel.send(`L'item **${name}** a été ajouté au shop avec succès !`);
    } catch (error) {
      console.error('Une erreur est survenue lors de l\'ajout de l\'item au shop :', error);
      message.channel.send('Une erreur est survenue lors de l\'ajout de l\'item au shop.');
    }
  }
};