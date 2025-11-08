/**
 * @file User info command
 * @description Replies with information about a user or yourself.
 * @version 1.0.0
 */

const { SlashCommandBuilder } = require("discord.js");

/**
 * @type {import("discord.js").SlashCommandBuilder}
 */
const command = new SlashCommandBuilder()
  .setName("userinfo")
  .setDescription("Shows information about yourself or another user.")
  .addUserOption((option) =>
    option
      .setName("target")
      .setDescription("The user you want information about")
  );

/**
 * Executes the userinfo command.
 * @param {import("discord.js").ChatInputCommandInteraction} interaction
 * @returns {Promise<void>}
 */
const execute = async (interaction) => {
  const user = interaction.options.getUser("target") || interaction.user;

  const replyMessage = `User: ${user.tag}\nID: ${user.id}`;

  await interaction.reply(replyMessage);
};

module.exports = {
  command,
  execute,
};
