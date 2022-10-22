const { EmbedBuilder, version: djsversion } = require("discord.js");
const { version } = require("../../package.json");
const { utc } = require("moment");
const os = require("os");
const ms = require("ms");

module.exports = {
  name: "botinfo",
  description: "Show botinfo",
  run: async ({ client, interaction }) => {
    const directories = [
      ...new Set(client.commands.map((cmd) => cmd.directory)),
    ];
    const categories = directories;

    const core = os.cpus()[0];
    const general = [
      `**❯ Client:** ${client.user.tag} (${client.user.id})`,
      `**❯ Commands:** ${client.commands.size}`,
      `**❯ Slash Commands:** ${client.slashCommands.size}`,
      `**❯ Category:** ${categories.size}`,
      `**❯ Servers:** ${client.guilds.cache.size.toLocaleString()} `,
      `**❯ Users:** ${client.guilds.cache
        .reduce((a, b) => a + b.memberCount, 0)
        .toLocaleString()}`,
      `**❯ Channels:** ${client.channels.cache.size.toLocaleString()}`,
      `**❯ Creation Date:** ${utc(client.user.createdTimestamp).format(
        "Do MMMM YYYY HH:mm:ss"
      )}`,
      `**❯ Node.js:** ${process.version}`,
      `**❯ Version:** v${version}`,
      `**❯ Discord.js:** v${djsversion}`,
      "\u200b",
    ].join("\n");
    const sistem = [
      `**❯ Platform:** ${process.platform}`,
      "**❯ Uptime:**",
      `\u3000 OS: ${ms(os.uptime() * 1000, { long: true })}`,
      `\u3000 Bot: ${ms(client.uptime, { long: true })}`,
      "**❯ CPU:**",
      `\u3000 Cores: ${os.cpus().length}`,
      `\u3000 Model: ${core.model}`,
      `\u3000 Speed: ${core.speed}MHz`,
      "**❯ Memory:**",
      `\u3000 Total: ${client.utils.formatBytes(
        process.memoryUsage().heapTotal
      )}`,
      `\u3000 Used: ${client.utils.formatBytes(
        process.memoryUsage().heapUsed
      )}`,
    ].join("\n");
    const embed = new EmbedBuilder()
      .setThumbnail(client.user.displayAvatarURL())
      .setColor(interaction.guild.me.displayHexColor || "BLUE")
      .addField("General", `${general}`)
      .addField("System", `${sistem}`)
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  },
};
