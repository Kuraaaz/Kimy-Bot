const UserXP = require('../../models/userXp'); // Import du modèle MongoDB
const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'resetxp',
  description: 'Réinitialise l\'XP de tous les utilisateurs.',
  async execute(message) {
    try {
      // Vérifier si l'utilisateur a la permission d'administrateur
      if (!message.member.permissions.has('ADMINISTRATOR')) {
        return message.reply('Vous n\'avez pas la permission d\'exécuter cette commande.');
      }

      // Envoyer le message de confirmation
      const confirmationMessage = await message.channel.send('Êtes-vous sûr de vouloir réinitialiser l\'XP de tous les utilisateurs ? (oui/non)');
      
      // Filtrer les réponses pour s'assurer de recevoir la réponse dans un délai raisonnable
      const filter = response => {
        return response.author.id === message.author.id && (response.content.toLowerCase() === 'oui' || response.content.toLowerCase() === 'non');
      };

      // Attendre la réponse de l'utilisateur
      const collected = await message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] });
      const response = collected.first();

      if (response.content.toLowerCase() === 'oui') {
        // Réinitialiser l'XP de tous les utilisateurs
        await UserXP.updateMany({}, { xp: 0, level: 1 });

        console.log("-------------L'XP de tous les utilisateurs a bien été reset !-------------");
        
        const embed = new MessageEmbed()
          .setTitle('Réinitialisation de l\'XP')
          .setDescription('L\'XP de tous les utilisateurs a été réinitialisée avec succès.')
          .setColor('#e800ff')
          .setTimestamp();

        await message.channel.send({ embeds: [embed] });
      } else {
        await message.channel.send('Réinitialisation annulée.');
      }
      
    } catch (error) {
      if (error instanceof require('discord.js').Collection) {
        console.error('Aucune réponse reçue dans le délai imparti. Réinitialisation annulée.');
        message.channel.send('Aucune réponse reçue. Réinitialisation annulée.');
      } else {
        console.error('Une erreur est survenue lors de la réinitialisation de l\'XP :', error);
        message.channel.send('Une erreur est survenue lors de la réinitialisation de l\'XP.');
      }
    }
  }
};