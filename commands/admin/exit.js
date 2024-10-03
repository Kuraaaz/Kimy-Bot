module.exports = {
    name: 'exit',
    description: 'Met le bot hors ligne et l\'arrête.',
    async execute(message) {
      const ownerId = '1046834138583412856'; // Remplacez par votre ID
  
      // Vérifier si l'utilisateur est l'owner du bot
      if (message.author.id !== ownerId) {
        return message.reply('Vous n\'avez pas la permission d\'exécuter cette commande.');
      }
  
      await message.client.user.setStatus('invisible');

      // Répondre au message de commande
      await message.reply('Mise en arrêt du programme.');
  
      // Arrêter le bot

      console.log("Le bot s'est bien arrété avec le code 0 !")

      process.exit(0);
    }
  };
  