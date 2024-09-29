const { MessageEmbed } = require('discord.js');
const UserXP = require('../models/userXp'); // Import du modèle MongoDB pour XP
const Reward = require('../models/reward'); // Import du modèle de récompense
const IgnoredChannel = require('../models/ignoredChannels'); // Import du modèle des salons ignorés
const Bank = require('../models/bank'); // Import du modèle de la banque
const rewardGiven = require('./rewardGiven'); // Import du fichier d'événement
const logger = require('../utils/logger'); // Import de Logger
require('dotenv').config();

module.exports = {
  name: 'messageCreate',
  once: false,
  async execute(message, client) {
    try {
      if (message.author.bot) return;

      const { guild, channel } = message;

      const isIgnored = await IgnoredChannel.findOne({
        guildId: guild.id,
        $or: [
          { channelId: channel.id }, // Le salon
          { channelId: channel.parentId } // La catégorie (si applicable)
        ]
      });

      if (isIgnored) {
        logger.info(`Message ignoré pour l'XP dans ${channel.name} (Salon ignoré) - ${message.author.tag}`);
        return;
      }

      const userId = message.author.id;

      let userXP = await UserXP.findOne({ userId });
      let userBank = await Bank.findOne({ userId }); // Cherche l'utilisateur dans la banque

      // Si l'utilisateur n'a pas encore d'XP enregistré, on l'initialise
      if (!userXP) {
        userXP = new UserXP({
          userId: userId,
          xp: 0,
          level: 1,
        });
        await userXP.save();
        logger.info(`Nouvel utilisateur enregistré : ${message.author.tag}`);
      }

      // Si l'utilisateur n'a pas encore d'argent enregistré, on l'initialise
      if (!userBank) {
        userBank = new Bank({
          userId: userId,
          balance: 0,
        });
        await userBank.save();
        logger.info(`Nouvel utilisateur de banque enregistré : ${message.author.tag}`);
      }

      // Gagner de l'XP aléatoire entre 5 et 15 à chaque message
      const xpGained = Math.floor(Math.random() * 11) + 5;
      userXP.xp += xpGained;

      // Gagner de l'argent aléatoire entre 5 et 50 à chaque message
      const moneyGained = Math.floor(Math.random() * 50) + 5;
      userBank.balance += moneyGained;

      const currentLevel = userXP.level;
      const nextLevelXP = 20 * Math.pow(currentLevel, 2);

      // Vérification si l'utilisateur monte de niveau
      if (userXP.xp >= nextLevelXP) {
        userXP.level += 1;
        userXP.xp = 0;

        logger.event(`${message.author.tag} est monté au niveau ${userXP.level}`);

        const levelUpEmbed = new MessageEmbed()
          .setTitle('Félicitations !')
          .setDescription(`${message.author} est monté au niveau ${userXP.level} !`)
          .setColor('#e800ff')
          .setTimestamp()
          .setThumbnail(message.author.displayAvatarURL({ dynamic: true }));

        // Envoi dans le canal avec l'ID spécifique
        const levelUpChannel = message.guild.channels.cache.get('1289691264270471311');
        if (levelUpChannel) {
          await levelUpChannel.send({ embeds: [levelUpEmbed] });
        } else {
          logger.error('Le salon spécifié pour envoyer le message de montée de niveau est introuvable.');
        }

        const member = message.guild.members.cache.get(userId);
        await giveReward(member, client);
      }

      // Sauvegarder les données mises à jour dans MongoDB
      await userXP.save();
      await userBank.save(); // Sauvegarder le solde mis à jour

      logger.info(`XP ajouté : ${xpGained} pour ${message.author.tag}. XP total: ${userXP.xp}`);
      logger.info(`Argent ajouté : ${moneyGained} pour ${message.author.tag}. Solde total: ${userBank.balance}`);

    } catch (error) {
      logger.error('Une erreur est survenue lors du traitement du message :', error);
    }
  },
};

// Fonction pour attribuer des récompenses
async function giveReward(member, client) {
  const rewards = await Reward.find({});

  for (const reward of rewards) {
    const userXP = await UserXP.findOne({ userId: member.id });
    if (userXP && userXP.level >= reward.level) {
      const role = member.guild.roles.cache.get(reward.roleId);
      if (role && !member.roles.cache.has(role.id)) {
        await member.roles.add(role);
        logger.command(`Rôle ${role.name} ajouté à ${member.user.username}`);

        client.emit('rewardGiven', member, role);
      }
    }
  }
}