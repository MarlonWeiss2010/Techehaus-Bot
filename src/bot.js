/**
 * @file Main entry point for the Discord bot.
 * @description Loads environment variables, registers commands dynamically, and handles command execution.
 * @version 1.0.0
 */

const dotenv = require("dotenv");
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");
const path = require("path");

dotenv.config();

/**
 * Create and configure a new Discord client instance.
 * @type {import("discord.js").Client}
 */
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Store commands in a collection
client.commands = new Collection();

/**
 * Loads all command modules from the "commands" directory.
 * @returns {Promise<void>}
 */
async function loadCommands() {
  try {
    const commandsPath = path.join(__dirname, "commands");
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const commandModule = require(filePath);

      const { command, execute } = commandModule;

      if (!command || typeof execute !== "function") {
        console.warn(`Skipping invalid command file: ${file}`);
        continue;
      }

      client.commands.set(command.name, execute);
      console.log(`Loaded command: ${command.name}`);
    }

    console.log(`Successfully loaded ${client.commands.size} commands.`);
  } catch (error) {
    console.error("Error loading commands:", error);
  }
}

/**
 * Event: Fired when the bot is ready.
 */
client.once("ready", () => {
  console.log(`Bot is now online as ${client.user.tag}`);

  client.user.setPresence({
    status: "dnd", // "online", "idle", "dnd", "invisible"
    activities: [
      {
        name: "dsc.gg/zechhaus",
        type: 0, // 0 = Playing
      },
    ],
  });
});

/**
 * Event: Handles interaction events (slash commands).
 */
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const execute = client.commands.get(interaction.commandName);
  if (!execute) {
    console.warn(`Unknown command: ${interaction.commandName}`);
    return;
  }

  try {
    await execute(interaction);
  } catch (error) {
    console.error(
      `Error executing command "${interaction.commandName}":`,
      error
    );

    const errorMessage = {
      content: "An error occurred while executing this command.",
      ephemeral: true,
    };

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(errorMessage);
    } else {
      await interaction.reply(errorMessage);
    }
  }
});

/**
 * Start the bot.
 */
(async () => {
  await loadCommands();

  const token = process.env.DISCORD_TOKEN;
  if (!token) {
    console.error("Missing DISCORD_TOKEN in environment variables.");
    process.exit(1);
  }

  client.login(token);
})();
