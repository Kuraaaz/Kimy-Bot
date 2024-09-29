const { MessageEmbed } = require('discord.js');
const UserXP = require('../../models/userXp'); // Import du modèle MongoDB

module.exports = {
  name: 'level',
  description: 'Affiche votre niveau et XP actuel, ou celui d\'un membre mentionné.',
  async execute(message) {
    try {
      // Vérifiez si un membre a été mentionné
      const mentionedMember = message.mentions.members.first();
      const userId = mentionedMember ? mentionedMember.id : message.author.id; // Utilise l'ID du membre mentionné ou de l'auteur

      // Cherche l'utilisateur dans la base de données
      const userXP = await UserXP.findOne({ userId });

      // Si aucun utilisateur trouvé, il n'a pas encore d'XP
      if (!userXP) {
        const userToMention = mentionedMember ? mentionedMember.user.username : message.author.username;
        return message.reply(`${userToMention}, vous n'avez pas encore d'XP enregistré. Participez dans le serveur pour commencer à en gagner !`);
      }

      const { xp, level } = userXP;
      const currentLevel = userXP.level;
      const nextLevelXP = 20 * Math.pow(currentLevel, 2); // XP nécessaire pour passer au niveau suivant
      const xpProgress = (xp / nextLevelXP) * 100; // Progression en pourcentage vers le niveau suivant

      // Création de l'embed pour afficher les infos de l'utilisateur mentionné ou de l'auteur
      const userToDisplay = mentionedMember || message.member; // Utilise le membre mentionné ou l'auteur
      const embed = new MessageEmbed()
        .setTitle(`${userToDisplay.user.username} - Niveau actuel`)
        .setColor('#e800ff')
        .setThumbnail(userToDisplay.user.displayAvatarURL({ dynamic: true }))
        .addFields(
          { name: 'Niveau', value: `**${level}**`, inline: true },
          { name: 'XP Actuel', value: `**${xp}** XP`, inline: true },
          { name: 'Prochain Niveau', value: `**${nextLevelXP}** XP requis`, inline: true },
          { name: 'Progression', value: `**${xpProgress.toFixed(2)}%**`, inline: false }
        )
        .setFooter('Continuez à être actif pour monter de niveau !')
        .setTimestamp();

      await message.channel.send({ embeds: [embed] });

    } catch (error) {
      console.error('Une erreur est survenue lors de l\'exécution de la commande level :', error);
      message.channel.send('Une erreur est survenue lors de la récupération de votre niveau.');
    }
  }
};