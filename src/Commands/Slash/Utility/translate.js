const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const translate = require("@iamtraction/google-translate");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("translate")
    .setDescription("Translate any text to english")
    .addStringOption((options) =>
      options
        .setName("query")
        .setDescription("The text to translate")
        .setRequired(true)
    ),
  run: async ({ interaction }) => {
    const query = interaction.options.getString("query");
    try {
      const translated = await translate(query, { to: "en" });
      const e = new EmbedBuilder()
        .setColor("Purple")
        .addFields([
          {
            name: "Content",
            value: query,
            inline: true,
          },
          {
            name: "Result",
            value: translated.text,
            inline: true,
          },
        ])
      interaction.reply({ embeds: [e] });
    } catch (err) {
      client.errLogger("CommandError", err)
      //console.error("/translate:" + err);
    }
  },
};
