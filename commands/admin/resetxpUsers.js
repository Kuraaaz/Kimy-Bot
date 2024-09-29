const { MessageEmbed } = require('discord.js');
const UserXP = require('../../models/userXp'); // Import du modèle MongoDB

module.exports = {
  name: 'resetxpu',
  description: 'Réinitialise l\'XP et le niveau d\'un utilisateur mentionné.',
  async execute(message) {
    try {
      // Vérifier si l'utilisateur a la permission d'administrateur
      if (!message.member.permissions.has('ADMINISTRATOR')) {
        return message.reply('Vous n\'avez pas la permission d\'exécuter cette commande.');
      }

      // Vérifiez si un membre a été mentionné
      const mentionedMember = message.mentions.members.first();
      if (!mentionedMember) {
        return message.reply('Veuillez mentionner un membre dont vous souhaitez réinitialiser l\'XP et le niveau.');
      }

      // Cherche l'utilisateur dans la base de données
      const userXP = await UserXP.findOne({ userId: mentionedMember.id });
      
      if (!userXP) {
        return message.reply(`L'utilisateur mentionné n'a pas encore d'XP enregistré.`);
      }

      // Réinitialiser l'XP et le niveau
      userXP.xp = 0;
      userXP.level = 1;
      await userXP.save();

      const embed = new MessageEmbed()
        .setTitle('Réinitialisation de l\'XP et du Niveau')
        .setDescription(`L'XP et le niveau de **${mentionedMember.user.username}** ont été réinitialisés.`)
        .setColor('#ff0000')
        .setTimestamp();

      await message.channel.send({ embeds: [embed] });

    } catch (error) {
      console.error('Une erreur est survenue lors de l\'exécution de la commande resetxpu :', error);
      message.channel.send('Une erreur est survenue lors de la réinitialisation de l\'XP et du niveau.');
    }
  }
};
