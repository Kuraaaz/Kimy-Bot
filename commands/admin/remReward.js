const Reward = require('../../models/reward'); // Assurez-vous que le chemin d'accès est correct

module.exports = {
  name: 'remreward',
  description: 'Retire une récompense de la liste des récompenses.',
  async execute(message, args) {
    // Vérifier si l'utilisateur a les permissions nécessaires (ex. : administrateur)
    if (!message.member.permissions.has('ADMINISTRATOR')) {
      return message.reply("Vous n'avez pas la permission d'exécuter cette commande.");
    }

    // Vérifier que l'argument a été fourni
    if (!args.length) {
      return message.reply('Veuillez fournir l\'ID ou le nom de la récompense à retirer.');
    }

    const rewardIdentifier = args.join(' '); // L'ID ou le nom de la récompense
    console.log('Arguments reçus:', args);
    console.log('Recherche de la récompense pour:', rewardIdentifier);

    try {
      // Chercher la récompense dans la base de données
      const reward = await Reward.findOneAndDelete({
        $or: [
          { roleId: rewardIdentifier },
          { name: rewardIdentifier },
        ],
      });

      console.log('Récompense trouvée:', reward);

      if (!reward) {
        return message.reply('Aucune récompense trouvée avec cet identifiant.');
      }

      // Répondre à l'utilisateur
      return message.channel.send(`La récompense **${reward}** a été retirée avec succès.`);
    } catch (error) {
      console.error('Erreur lors de la suppression de la récompense:', error);
      return message.reply('Une erreur est survenue lors de la suppression de la récompense.');
    }
  },
};