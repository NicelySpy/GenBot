const ms = require("ms");
module.exports = {
  ...new (require("discord.js").SlashCommandBuilder)()
    .setName("uptime")
    .setDescription("Showing how long the bot uptime"),
  run: async ({ client, interaction }) => {
    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Green")
          .setDescription(`My uptime is\n${ms(client.uptime, { long: true })}`),
      ],
    });
  },
};
