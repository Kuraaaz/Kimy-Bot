const { MessageEmbed } = require('discord.js');
const Bank = require('../../models/bank'); // Import du modèle de banque

module.exports = {
  name: 'money',
  description: 'Affiche la valeur de votre compte en banque.',
  async execute(message, args) {
    try {
      // Récupérer le solde de l'utilisateur
      const userId = message.author.id;
      const userBank = await Bank.findOne({ userId });

      // Si l'utilisateur n'a pas de compte, l'initialiser
      if (!userBank) {
        return message.reply('Vous n\'avez pas encore de compte en banque.');
      }

      // Créer un embed pour afficher le solde
      const embed = new MessageEmbed()
        .setTitle('Solde de votre compte')
        .setDescription(`💰 Votre solde est de **${userBank.balance}** Kimyus.`)
        .setColor('#00ff00')
        .setTimestamp();

      // Envoyer l'embed dans le canal
      await message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error('Une erreur est survenue lors de l\'exécution de la commande money :', error);
      message.channel.send('Une erreur est survenue lors de la récupération de votre solde.');
    }
  },
};