/**
 * @file Ping command
 * @description Replies with "Pong!" to confirm that the bot is responsive.
 */

module.exports = {
  command: {
    name: "ping",
    description: "Replies with Pong!",
  },

  /**
   * Executes the ping command.
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @returns {Promise<void>}
   */
  async execute(interaction) {
    await interaction.reply("Pong!");
  },
};
