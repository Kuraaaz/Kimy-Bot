const { MessageEmbed } = require('discord.js');
const { readdirSync } = require('fs'); // Pour lire les fichiers de commandes
const path = require('path'); // Importer le module path

module.exports = {
  name: 'help',
  description: 'Affiche la liste des commandes disponibles.',
  async execute(message) {
    try {
      // Lire tous les fichiers de commandes dans le dossier "commands/generals"
      const commandFiles = readdirSync(path.join(__dirname, '../../commands/generals')).filter(file => file.endsWith('.js'));

      // Créer un embed pour afficher les commandes
      const embed = new MessageEmbed()
        .setTitle('Liste des commandes')
        .setColor('#00FF00')
        .setTimestamp();

      // Ajouter chaque commande à l'embed
      commandFiles.forEach(file => {
        const commands = require(`../../commands/generals/${file}`);
        embed.addField(`\`${commands.name}\``, commands.description || 'Pas de description', true);
      });

      // Envoyer l'embed dans le canal
      await message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error('Une erreur est survenue lors de l\'exécution de la commande help :', error);
      message.channel.send('Une erreur est survenue lors de l\'affichage des commandes.');
    }
  },
};
