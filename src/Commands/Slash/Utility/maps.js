const Discord = require("discord.js");
const fetch = require("node-fetch");
module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName("maps")
    .setDescription("Showing the google maps image")
    .addStringOption((options) =>
      options
        .setName("location")
        .setDescription("The Location")
        .setRequired(true)
    ),
  run: async ({ client, interaction }) => {
    await interaction.deferReply();
    let args = [];
    const pip = interaction.options.getString("location");
    args.push(pip);
    const sit = args.join("_");
    const site = `https://maps.google.com/?q=${args.join("+")}`;
    try {
      const { body } = await fetch(
        `https://image.thum.io/get/width/1920/crop/675/noanimate/${site}`
      );
      let att = new Discord.AttachmentBuilder(body, { name: `${sit}.png` });
      interaction.editReply({ files: [att] });
    } catch (err) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription("An error has occured"),
        ],
        ephemeral: true,
      });
    }
  },
};
