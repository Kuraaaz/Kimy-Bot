const { MessageEmbed } = require('discord.js');
const Bank = require('../../models/bank'); // Import du modèle de banque

module.exports = {
  name: 'resetmoney',
  description: 'Réinitialise la somme d\'argent de tous les utilisateurs du serveur.',
  async execute(message) {
    try {
      // Vérifier si l'utilisateur a la permission d'administrateur
      if (!message.member.permissions.has('ADMINISTRATOR')) {
        return message.reply('Vous n\'avez pas la permission d\'exécuter cette commande.');
      }

      // Récupérer tous les comptes en banque
      const allUsers = await Bank.find({});

      // Réinitialiser le solde de chaque utilisateur
      for (const user of allUsers) {
        user.balance = 0; // Réinitialiser le solde
        await user.save(); // Sauvegarder les changements
      }

      const embed = new MessageEmbed()
        .setTitle('Argent Réinitialisé')
        .setDescription('La somme d\'argent de tous les utilisateurs a été réinitialisée à 0.')
        .setColor('#ffcc00')
        .setTimestamp();

      await message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error('Une erreur est survenue lors de l\'exécution de la commande resetmoney :', error);
      message.channel.send('Une erreur est survenue lors de la réinitialisation de l\'argent.');
    }
  }
};
