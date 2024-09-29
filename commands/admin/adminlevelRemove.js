const { MessageEmbed } = require('discord.js');
const UserXP = require('../../models/userXp'); // Import du modèle MongoDB

module.exports = {
  name: 'adminlevelr',
  description: 'Enlève un certain nombre de niveaux à un utilisateur mentionné.',
  async execute(message, args) {
    try {
      // Vérifier si l'utilisateur a la permission d'administrateur
      if (!message.member.permissions.has('ADMINISTRATOR')) {
        return message.reply('Vous n\'avez pas la permission d\'exécuter cette commande.');
      }

      // Vérifiez si un membre a été mentionné
      const mentionedMember = message.mentions.members.first();
      if (!mentionedMember) {
        return message.reply('Veuillez mentionner un membre pour enlever des niveaux.');
      }

      // Vérifiez si un montant de niveaux a été spécifié
      const levelsToRemove = parseInt(args[1]);
      if (isNaN(levelsToRemove) || levelsToRemove <= 0) {
        return message.reply('Veuillez spécifier un montant de niveaux valide à enlever.');
      }

      // Cherche l'utilisateur dans la base de données
      const userXP = await UserXP.findOne({ userId: mentionedMember.id });
      
      if (!userXP) {
        return message.reply(`L'utilisateur mentionné n'a pas encore d'XP enregistré.`);
      }

      // Enlever les niveaux
      userXP.level = Math.max(1, userXP.level - levelsToRemove); // Assurez-vous que le niveau ne tombe pas en dessous de 1
      await userXP.save();

      const embed = new MessageEmbed()
        .setTitle('Niveaux Enlevés')
        .setDescription(`**${levelsToRemove}** niveaux ont été enlevés à **${mentionedMember.user.username}**.`)
        .setColor('#ff0000')
        .setTimestamp();

      await message.channel.send({ embeds: [embed] });

    } catch (error) {
      console.error('Une erreur est survenue lors de l\'exécution de la commande adminlevelr :', error);
      message.channel.send('Une erreur est survenue lors de l\'enlèvement des niveaux.');
    }
  }
};
