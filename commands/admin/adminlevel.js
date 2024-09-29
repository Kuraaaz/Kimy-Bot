const { MessageEmbed } = require('discord.js');
const UserXP = require('../../models/userXp'); // Import du modèle MongoDB

module.exports = {
  name: 'adminlevel',
  description: 'Ajoute un certain nombre de niveaux à un utilisateur mentionné.',
  async execute(message, args) {
    try {
      // Vérifier si l'utilisateur a la permission d'administrateur
      if (!message.member.permissions.has('ADMINISTRATOR')) {
        return message.reply('Vous n\'avez pas la permission d\'exécuter cette commande.');
      }

      // Vérifiez si un membre a été mentionné
      const mentionedMember = message.mentions.members.first();
      if (!mentionedMember) {
        return message.reply('Veuillez mentionner un membre pour ajouter des niveaux.');
      }

      // Vérifiez si un montant de niveaux a été spécifié
      const levelsToAdd = parseInt(args[1]);
      if (isNaN(levelsToAdd) || levelsToAdd <= 0) {
        return message.reply('Veuillez spécifier un montant de niveaux valide à ajouter.');
      }

      // Cherche l'utilisateur dans la base de données
      const userXP = await UserXP.findOne({ userId: mentionedMember.id });
      
      if (!userXP) {
        return message.reply(`L'utilisateur mentionné n'a pas encore d'XP enregistré.`);
      }

      // Ajouter les niveaux
      userXP.level += levelsToAdd;
      await userXP.save();

      const embed = new MessageEmbed()
        .setTitle('Niveaux Ajoutés')
        .setDescription(`**${levelsToAdd}** niveaux ont été ajoutés à **${mentionedMember.user.username}**.`)
        .setColor('#00ff00')
        .setTimestamp();

      await message.channel.send({ embeds: [embed] });

    } catch (error) {
      console.error('Une erreur est survenue lors de l\'exécution de la commande adminlevel :', error);
      message.channel.send('Une erreur est survenue lors de l\'ajout des niveaux.');
    }
  }
};
