const { MessageEmbed } = require('discord.js');
const Reward = require('../../models/reward'); // Import du modèle MongoDB

module.exports = {
  name: 'rewardl',
  description: 'Affiche la liste des récompenses disponibles.',
  async execute(message) {
    try {
      // Récupérer toutes les récompenses de la base de données
      const rewards = await Reward.find({});

      // Vérifier s'il y a des récompenses
      if (rewards.length === 0) {
        return message.reply('Aucune récompense disponible pour le moment.');
      }

      // Créer un embed pour afficher les récompenses
      const embed = new MessageEmbed()
        .setTitle('Liste des Récompenses')
        .setColor('#00ff00')
        .setTimestamp();

      // Ajouter chaque récompense à l'embed
      rewards.forEach(reward => {
        const role = message.guild.roles.cache.get(reward.roleId);
        if (role) {
          embed.addField(`Niveau ${reward.level}`, `Rôle: ${role}`, true);
        }
      });

      await message.channel.send({ embeds: [embed] });

    } catch (error) {
      console.error('Une erreur est survenue lors de l\'exécution de la commande rewardlist :', error);
      message.channel.send('Une erreur est survenue lors de la récupération de la liste des récompenses.');
    }
  }
};
