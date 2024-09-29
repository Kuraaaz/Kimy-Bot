const { MessageEmbed } = require('discord.js');
const Bank = require('../../models/bank'); // Import du modèle de banque

module.exports = {
  name: 'resetmoneyu',
  description: 'Réinitialise la somme d\'argent de l\'utilisateur mentionné.',
  async execute(message, args) {
    try {
      // Vérifier si l'utilisateur a la permission d'administrateur
      if (!message.member.permissions.has('ADMINISTRATOR')) {
        return message.reply('Vous n\'avez pas la permission d\'exécuter cette commande.');
      }

      // Vérifier si un membre a été mentionné
      const mentionedMember = message.mentions.members.first();
      if (!mentionedMember) {
        return message.reply('Veuillez mentionner un membre pour réinitialiser son argent.');
      }

      // Chercher le compte en banque de l'utilisateur mentionné
      const userBank = await Bank.findOne({ userId: mentionedMember.id });
      if (!userBank) {
        return message.reply(`Aucun compte en banque trouvé pour ${mentionedMember.user.username}.`);
      }

      // Réinitialiser le solde de l'utilisateur
      userBank.balance = 0;
      await userBank.save();

      const embed = new MessageEmbed()
        .setTitle('Argent Réinitialisé')
        .setDescription(`La somme d'argent de **${mentionedMember.user.username}** a été réinitialisée à 0.`)
        .setColor('#ffcc00')
        .setTimestamp();

      await message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error('Une erreur est survenue lors de l\'exécution de la commande resetmoneyu :', error);
      message.channel.send('Une erreur est survenue lors de la réinitialisation de l\'argent de l\'utilisateur mentionné.');
    }
  }
};
