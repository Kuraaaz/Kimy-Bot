const { MessageEmbed } = require('discord.js');
const Bank = require('../../models/bank'); // Import du modèle de banque

module.exports = {
  name: 'rmoney',
  description: 'Retire une certaine somme d\'argent à un utilisateur mentionné.',
  async execute(message, args) {
    try {
      // Vérifier si l'utilisateur a la permission d'administrateur
      if (!message.member.permissions.has('ADMINISTRATOR')) {
        return message.reply('Vous n\'avez pas la permission d\'exécuter cette commande.');
      }

      // Vérifiez si un membre a été mentionné
      const mentionedMember = message.mentions.members.first();
      if (!mentionedMember) {
        return message.reply('Veuillez mentionner un membre à qui retirer de l\'argent.');
      }

      // Vérifiez si un montant d'argent a été spécifié
      const amountToRemove = parseInt(args[1]);
      if (isNaN(amountToRemove) || amountToRemove <= 0) {
        return message.reply('Veuillez spécifier un montant d\'argent valide à retirer.');
      }

      // Cherche l'utilisateur dans la base de données
      let userBank = await Bank.findOne({ userId: mentionedMember.id });

      // Vérifiez si l'utilisateur a un compte en banque
      if (!userBank) {
        return message.reply(`L'utilisateur mentionné n'a pas encore de compte en banque.`);
      }

      // Vérifiez si l'utilisateur a suffisamment d'argent
      if (userBank.balance < amountToRemove) {
        return message.reply(`L'utilisateur n'a pas assez d'argent pour retirer ${amountToRemove}.`);
      }

      // Retirer l'argent
      userBank.balance -= amountToRemove;
      await userBank.save();

      const embed = new MessageEmbed()
        .setTitle('Argent Retiré')
        .setDescription(`**${amountToRemove}** Kimyus ont été retirés à **${mentionedMember.user.username}**.`)
        .setColor('#ff0000')
        .setTimestamp();

      await message.channel.send({ embeds: [embed] });

    } catch (error) {
      console.error('Une erreur est survenue lors de l\'exécution de la commande rmoney :', error);
      message.channel.send('Une erreur est survenue lors du retrait d\'argent.');
    }
  }
};
