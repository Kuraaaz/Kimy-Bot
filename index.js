const { Client, Collection } = require('discord.js');
const dotenv = require('dotenv');
const fs = require('fs');
const mongoose = require('mongoose');
const logger = require('./utils/logger'); // Importer la bibliothèque Logger
require("dotenv").config();

const client = new Client({
    intents: 98303,
    partials: ["MESSAGE", "CHANNEL", "REACTION", "USER"],
});

// Initialiser la collection des commandes
client.commands = new Collection();

// Charger les fichiers de commandes depuis chaque sous-dossier
const commandFolders = fs.readdirSync('./commands');
for (const folder of commandFolders) {
  const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(`./commands/${folder}/${file}`);
    logger.command(`Commande chargée: ${command.name}`); // Utilisation de Logger
    client.commands.set(command.name, command);
  }
}

// Charger les événements
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  logger.event(`Événement chargé: ${file}`); // Utilisation de Logger
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

// Gestion des messages
client.on('messageCreate', (message) => {
  if (!message.content.startsWith('+') || message.author.bot) return;

  const args = message.content.slice(1).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName);

  if (!command) return;

  try {
    command.execute(message, args); 
    logger.command(`Commande exécutée : ${commandName}`); // Log via Logger
  } catch (error) {
    logger.error('Erreur lors de l\'exécution de la commande:', error);
    message.reply("Une erreur s'est produite lors de l'exécution de cette commande.");
  }
});

// Connexion à MongoDB
mongoose.connect(process.env.DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    logger.client('Connecté à MongoDB');
}).catch((err) => {
    logger.error('Erreur de connexion à MongoDB:', err);
});

// Écouter l'événement rewardGiven
client.on('rewardGiven', async (member, role) => {
  const rewardGiven = require('./events/rewardGiven');
  await rewardGiven.execute(member, role);
});

// Connexion à Discord
client.login(process.env.DISCORD_TOKEN)
  .then(() => logger.client('Bot connecté avec succès!'))
  .catch(err => logger.error('Erreur de connexion au bot:', err));