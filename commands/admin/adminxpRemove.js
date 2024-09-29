const { MessageEmbed } = require('discord.js');
const UserXP = require('../../models/userXp'); // Import du modèle MongoDB

module.exports = {
  name: 'adminxpr',
  description: 'Enlève un certain nombre d\'XP à un utilisateur mentionné.',
  async execute(message, args) {
    try {
      // Vérifier si l'utilisateur a la permission d'administrateur
      if (!message.member.permissions.has('ADMINISTRATOR')) {
        return message.reply('Vous n\'avez pas la permission d\'exécuter cette commande.');
      }

      // Vérifiez si un membre a été mentionné
      const mentionedMember = message.mentions.members.first();
      if (!mentionedMember) {
        return message.reply('Veuillez mentionner un membre pour enlever de l\'XP.');
      }

      // Vérifiez si un montant d'XP a été spécifié
      const xpToRemove = parseInt(args[1]);
      if (isNaN(xpToRemove) || xpToRemove <= 0) {
        return message.reply('Veuillez spécifier un montant d\'XP valide à enlever.');
      }

      // Cherche l'utilisateur dans la base de données
      const userXP = await UserXP.findOne({ userId: mentionedMember.id });
      
      if (!userXP) {
        return message.reply(`L'utilisateur mentionné n'a pas encore d'XP enregistré.`);
      }

      // Enlever l'XP
      userXP.xp = Math.max(0, userXP.xp - xpToRemove); // Assurez-vous que l'XP ne tombe pas en dessous de zéro
      await userXP.save();

      const embed = new MessageEmbed()
        .setTitle('XP Enlevé')
        .setDescription(`**${xpToRemove}** XP ont été enlevés à **${mentionedMember.user.username}**.`)
        .setColor('#ff0000')
        .setTimestamp();

      await message.channel.send({ embeds: [embed] });

    } catch (error) {
      console.error('Une erreur est survenue lors de l\'exécution de la commande adminxpr :', error);
      message.channel.send('Une erreur est survenue lors de l\'enlèvement de l\'XP.');
    }
  }
};
