const { MessageEmbed } = require('discord.js');
const Bank = require('../../models/bank'); // Import du modèle de banque

module.exports = {
  name: 'addmoney',
  description: 'Ajoute une certaine somme d\'argent à un utilisateur mentionné.',
  async execute(message, args) {
    try {
      // Vérifier si l'utilisateur a la permission d'administrateur
      if (!message.member.permissions.has('ADMINISTRATOR')) {
        return message.reply('Vous n\'avez pas la permission d\'exécuter cette commande.');
      }

      // Vérifiez si un membre a été mentionné
      const mentionedMember = message.mentions.members.first();
      if (!mentionedMember) {
        return message.reply('Veuillez mentionner un membre à qui ajouter de l\'argent.');
      }

      // Vérifiez si un montant d'argent a été spécifié
      const amountToAdd = parseInt(args[1]);
      if (isNaN(amountToAdd) || amountToAdd <= 0) {
        return message.reply('Veuillez spécifier un montant d\'argent valide à ajouter.');
      }

      // Cherche l'utilisateur dans la base de données
      let userBank = await Bank.findOne({ userId: mentionedMember.id });
      
      // Si l'utilisateur n'a pas encore de compte, l'initialiser
      if (!userBank) {
        userBank = new Bank({
          userId: mentionedMember.id,
          balance: 0,
        });
      }

      // Ajouter l'argent
      userBank.balance += amountToAdd;
      await userBank.save();

      const embed = new MessageEmbed()
        .setTitle('Argent Ajouté')
        .setDescription(`**${amountToAdd}** Kimyus ont été ajoutés à **${mentionedMember.user.username}**.`)
        .setColor('#00ff00')
        .setTimestamp();

      await message.channel.send({ embeds: [embed] });

    } catch (error) {
      console.error('Une erreur est survenue lors de l\'exécution de la commande addmoney :', error);
      message.channel.send('Une erreur est survenue lors de l\'ajout d\'argent.');
    }
  }
};
