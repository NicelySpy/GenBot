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
  run: async ({ interaction }) => {
    let color = interaction.options.getString("hex-color");
    if (color.includes("#")) {
      color = interaction.options.getString("hex-color").split("#")[1];
    }
    const url = `https://api.alexflipnote.dev/colour/${color}`;
    await interaction.deferReply();
    let json;
    try {
      json = await fetch(url).then((res) => res.json());
    } catch (e) {
      return interaction.editReply({
        embeds: [
          new Discord.EmbedBuilder()
            .setColor("Red")
            .setDescription("An error has occured"),
        ],
        ephemeral: true,
      });
    }
    if (json.description)
      return interaction.editReply({
        embeds: [
          new Discord.EmbedBuilder()
            .setColor("Red")
            .setDescription("Invalid color!"),
        ],
        ephemeral: true,
      });
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
