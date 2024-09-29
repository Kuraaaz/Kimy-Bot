const { MessageEmbed } = require('discord.js');
const Bank = require('../../models/bank'); // Import du modèle de banque

module.exports = {
  name: 'money',
  description: 'Affiche la valeur de votre compte en banque ou de la personne mentionnée.',
  async execute(message, args) {
    try {
      // Déterminer si un utilisateur a été mentionné
      const targetUser = message.mentions.users.first() || message.author;
      const userId = targetUser.id;

      // Récupérer le solde de l'utilisateur mentionné ou celui qui exécute la commande
      const userBank = await Bank.findOne({ userId });

      // Si l'utilisateur n'a pas de compte, afficher un message
      if (!userBank) {
        return message.reply(`${targetUser.tag} n'a pas encore de compte en banque.`);
      }

      // Créer un embed pour afficher le solde
      const embed = new MessageEmbed()
        .setTitle(`Solde du compte de ${targetUser.tag}`)
        .setDescription(`💰 Le solde est de **${userBank.balance}** Kimyus.`)
        .setColor('#00ff00')
        .setTimestamp();

      // Envoyer l'embed dans le canal
      await message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error('Une erreur est survenue lors de l\'exécution de la commande money :', error);
      message.channel.send('Une erreur est survenue lors de la récupération du solde.');
    }
  },
};