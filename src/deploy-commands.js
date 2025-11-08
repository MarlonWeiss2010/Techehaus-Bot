/**
 * @file Command registration script.
 * @description Loads all commands from the "commands" directory and registers them with the Discord API.
 * @version 1.0.0
 */

const dotenv = require("dotenv");
const { REST, Routes } = require("discord.js");
const fs = require("fs");
const path = require("path");

dotenv.config();

/**
 * @type {string}
 */
const token = process.env.DISCORD_TOKEN;

/**
 * @type {string}
 */
const applicationId = process.env.APPLICATION_ID;

/**
 * @type {string}
 */
const guildId = process.env.GUILD_ID;

if (!token || !applicationId || !guildId) {
  console.error(
    "Missing one or more required environment variables (DISCORD_TOKEN, APPLICATION_ID, GUILD_ID)."
  );
  process.exit(1);
}

/**
 * @type {Array<import('discord.js').RESTPostAPIChatInputApplicationCommandsJSONBody>}
 */
const commands = [];

// Resolve commands path
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const commandModule = require(filePath);
  const { command } = commandModule;

  if (
    command &&
    typeof command.name === "string" &&
    typeof command.toJSON === "function"
  ) {
    commands.push(command.toJSON());
    console.log(`Loaded command: ${command.name}`);
  } else {
    console.warn(`Skipping invalid command file: ${file}`);
  }
}

// Create REST client
const rest = new REST({ version: "10" }).setToken(token);

/**
 * Registers commands with Discord.
 * @returns {Promise<void>}
 */
async function registerCommands() {
  try {
    console.log("Registering application commands with Discord...");

    // Option 1: Guild-specific registration (recommended for testing)
    await rest.put(Routes.applicationGuildCommands(applicationId, guildId), {
      body: commands,
    });

    // Option 2: Global registration (uncomment to enable, may take up to 1 hour)
    // await rest.put(Routes.applicationCommands(applicationId), { body: commands });

    console.log(
      `Successfully registered ${commands.length} application commands.`
    );
  } catch (error) {
    console.error("Error registering commands:", error);
  }
}

// Run registration
registerCommands();
