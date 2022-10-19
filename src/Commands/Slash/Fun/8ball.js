const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
module.exports = {
  ...new SlashCommandBuilder()
    .setName("8ball")
    .setDescription("Answer your question with a random answer")
    .addStringOption((options) =>
      options
        .setName("question")
        .setDescription("The question to answer")
        .setRequired(true)
    ),
  run: async ({ interaction }) => {
    const q = interaction.options.getString("question");
    const array = [
      "Yes",
      "Yes maybe?",
      "Absolute",
      "Maybe",
      "Hmmmm",
      "Sussy Baka",
      "Idk",
      "No maybe?",
      "No",
      "That is real?",
      "Huh?",
      "I hope yes",
      "I hope no",
      "I hope so",
      "Big chance",
      "Hahaha",
      "Wht the?",
      "Never!",
      "Bruh",
      "Yoo whatt??",
      "oeknejsodpoep",
    ];
    const a = array[Math.floor(Math.random() * array.length)];

    const succes = new EmbedBuilder()

      .setColor("Green")
      .setTimestamp()
      .setDescription("Your question has been answered!")
      .addFields(
        { name: "Question", value: `${q}` },
        { name: "Answer", value: `${a}` }
      );
    interaction.reply({ embeds: [succes] });
  },
};
