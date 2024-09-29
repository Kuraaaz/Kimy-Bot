const { MessageEmbed } = require('discord.js');
const Reward = require('../../models/reward'); // Import du modèle MongoDB

module.exports = {
  name: 'addreward',
  description: 'Ajoute une récompense à un niveau donné.',
  async execute(message, args) {
    try {
      // Vérifier si l'utilisateur a la permission d'administrateur
      if (!message.member.permissions.has('ADMINISTRATOR')) {
        return message.reply('Vous n\'avez pas la permission d\'exécuter cette commande.');
      }

      // Vérification des arguments
      if (args.length < 2) {
        return message.reply('Veuillez spécifier un niveau et un rôle (mentionnez le rôle) !');
      }

      const level = parseInt(args[0]);
      const roleMention = message.mentions.roles.first();
      if (!roleMention) {
        return message.reply('Veuillez mentionner un rôle valide.');
      }

      // Vérifier si le niveau est un nombre valide
      if (isNaN(level) || level <= 0) {
        return message.reply('Veuillez entrer un niveau valide.');
      }

      // Vérifier si une récompense pour ce niveau existe déjà
      const existingReward = await Reward.findOne({ level });
      if (existingReward) {
        return message.reply(`Une récompense pour le niveau **${level}** existe déjà.`);
      }

      // Créer et sauvegarder la nouvelle récompense
      const newReward = new Reward({ level, roleId: roleMention.id });
      await newReward.save();

      const embed = new MessageEmbed()
        .setTitle('Récompense ajoutée')
        .setDescription(`La récompense pour le niveau **${level}** est le rôle **${roleMention.name}**.`)
        .setColor('#00ff00')
        .setTimestamp();

      await message.channel.send({ embeds: [embed] });

    } catch (error) {
      console.error('Une erreur est survenue lors de l\'ajout de la récompense :', error);
      message.channel.send('Une erreur est survenue lors de l\'ajout de la récompense.');
    }
  }
};
