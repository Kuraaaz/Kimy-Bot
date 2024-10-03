const { MessageEmbed } = require('discord.js');
const Inventory = require('../../models/inventory'); // Modèle d'inventaire

module.exports = {
  name: 'inventory',
  description: 'Afficher l\'inventaire de l\'utilisateur.',
  async execute(message, args) {
    try {
      // Récupérer l'inventaire de l'utilisateur
      const userInventory = await Inventory.findOne({ userId: message.author.id });

      if (!userInventory || userInventory.items.length === 0) {
        return message.reply('Votre inventaire est vide.');
      }

      // Extraire uniquement les champs 'name' et 'type'
      const formattedItems = userInventory.items
        .map(item => `**Nom :** ${item.name}, **Type :** ${item.type}`)
        .join('\n');

      // Créer l'embed d'inventaire
      const embed = new MessageEmbed()
        .setTitle(`${message.author.username}'s Inventaire`)
        .setDescription(`**Items :**\n${formattedItems}`)
        .setColor('#1809f3')
        .setTimestamp();

      // Envoyer l'embed
      await message.channel.send({ embeds: [embed] });

    } catch (error) {
      console.error('Une erreur est survenue lors de l\'affichage de l\'inventaire :', error);
      message.channel.send('Une erreur est survenue lors de l\'affichage de votre inventaire.');
    }
  },
};
