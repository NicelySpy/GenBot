const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
module.exports = {
  ...new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Display bots latency"),
  run: async ({ client, interaction }) => {
    const now = Date.now();
    const ping = now - interaction.createdTimestamp;

    const duration = moment
      .duration(client.uptime)
      .format(" D [days], H [hrs], m [mins], s [secs]");

    const zap = "⚡";
    const green = "🟢";
    const red = "🔴";
    const yellow = "🟡";

    let color2 = zap;
    let color = zap;
    const cPing = Math.round(client.ws.ping);

    if (cPing >= 40) {
      color2 = green;
    }
    if (cPing >= 200) {
      color2 = yellow;
    }
    if (cPing >= 400) {
      color2 = red;
    }

    if (ping >= 40) {
      color = green;
    }
    if (ping >= 200) {
      color = yellow;
    }
    if (ping >= 400) {
      color = red;
    }
    const embed1 = new EmbedBuilder()
      .setDescription("🏓 | Pinging ...")
      .setColor("#6F8FAF");

    const info = new EmbedBuilder()
      .setTitle("🏓 | Pong!")
      .addFields(
        {
          name: "API Latency",
          value: color2 + " | " + cPing + "ms",
          inline: true,
        },
        {
          name: "Message Latency",
          value: color + " | " + ping + "ms",
          inline: true,
        },
        { name: "Uptime", value: "⏲️ | " + duration, inline: true }
      )
      .setColor("#6F8FAF");
    await interaction.reply({
      embeds: [embed1],
    });
    await client.wait(1500);
    await interaction.editReply({ content: "Pong!", embeds: [info] });
  },
};
