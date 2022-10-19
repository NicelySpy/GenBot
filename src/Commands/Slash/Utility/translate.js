const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const translate = require("@iamtraction/google-translate");
module.exports = {
  ...new SlashCommandBuilder()
    .setName("translate")
    .setDescription("Google translate")
    .addStringOption((options) =>
      options
        .setName("query")
        .setDescription("The text to translate")
        .setRequired(true)
    )
    .addStringOption((options) =>
      options
        .setName("language")
        .setDescription("The Language")
        .setRequired(true)
    ),
  run: async ({ interaction }) => {
    const query = interaction.options.getString("query");
    const language = interaction.options.getString("language");
    try {
      const translated = await translate(query, { to: language });
      const e = new EmbedBuilder()
        .setColor("Green")
        .setDescription("Text has been translated")
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
          {
            name: "Language",
            value: `From: ${translated.from.language.iso} \nTo: ${args[0]}`,
          },
        ])
        .setTimestamp();
      interaction.reply({ embeds: [e] });
    } catch (err) {
      console.log(err);
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              "Error!, This might can happends if u put invalid language!"
            ),
        ],
        ephemeral: true,
      });
    }
  },
};
