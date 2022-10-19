const Discord = require("discord.js");
const fetch = require("node-fetch");
module.exports = {
  ...new Discord.SlashCommandBuilder()
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
    let json;
    try {
      json = await fetch(url).then((res) => res.json());
    } catch (e) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription("An error has occured"),
        ],
        ephemeral: true,
      });
    }
    if (json.description)
      return interaction.reply({
        embeds: [
          new EmbedBuilder().setColor("Red").setDescription("Invalid color!"),
        ],
        ephemeral: true,
      });
    let embed = new Discord.EmbedBuilder()
      .setTitle(json.name)
      .setColor(json.hex)
      .addFields(
        { name: "RGB", value: `${json.rgb}`, inline: true },
        { name: "Brightness", value: `${json.brightness}`, inline: true },
        { name: "Hex", value: `${json.hex}`, inline: true }
      )
      .setThumbnail(json.image)
      .setImage(json.image_gradient, true);
    interaction.reply({ embeds: [embed], ephemeral: false });
  },
};
