const Discord = require("discord.js");
const fetch = require("node-fetch");
module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName("colour")
    .setDescription("Showing an information from the colours")
    .addStringOption((options) =>
      options
        .setName("hex-color")
        .setDescription("The hex color (with # or without #)")
        .setRequired(true)
    ),
  run: async ({ client, interaction }) => {
    let color = interaction.options.getString("hex-color");
    await interaction.deferReply();
    let json = await client.utils.getColourData(color);
    let embed = new Discord.EmbedBuilder()
      .setTitle(json.name)
      .setColor(json.rgb.values)
      .addFields(
        { name: "RGB", value: `${json.rgb.string}`, inline: true },
        { name: "Brightness", value: `${json.brightness}`, inline: true },
        { name: "Hex", value: `${json.hex.string}`, inline: true },
        { name: "HSL", value: `${json.hsl.string}`, inline: true },
        { name: "CMYK", value: `${json.cmyk.string}`, inline: true }
      )
      .setThumbnail(json.images.square)
      .setImage(json.images.gradient, true);
    interaction.editReply({ embeds: [embed], ephemeral: false });
  },
};
