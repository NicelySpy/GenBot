const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

const answers = ["heads", "tails"];

module.exports = {
  ...new SlashCommandBuilder()
    .setName("coinflip")
    .setDescription("Heads or tails?")
    .addStringOption((options) =>
      options
        .setName("choice")
        .setDescription("Choice")
        .setRequired(true)
        .setChoices(
          { name: "Heads", value: "heads" },
          { name: "Tails", value: "tails" }
        )
    ),
  run: async ({ interaction }) => {
    const choices = interaction.options.getString("choice");

    const headswinembed = new EmbedBuilder()
      .setTitle("Its a heads!!")
      .setDescription(`The coin landed on heads , You won the bet`)
      .setColor("Green");

    const tailslooseembed = new EmbedBuilder()
      .setTitle("Its a tails!!")
      .setDescription(
        `The coin landed on tails but you chose heads , You lost the bet`
      )
      .setColor("Red");

    const tailswinembed = new EmbedBuilder()
      .setTitle("Its a tails!!")
      .setDescription(`The coin landed on tails , You won the bet`)
      .setColor("Green");

    const headslooseembed = new EmbedBuilder()
      .setTitle("Its a heads!!")
      .setDescription(
        `The coin landed on heads but you chose tails , You lost the bet`
      )
      .setColor("Red");

    const coin = answers[Math.floor(Math.random() * answers.length)];
    if (choices === "heads") {
      if (coin === "heads") {
        interaction.reply({ embeds: [headswinembed] });
      } else if (coin === "tails") {
        interaction.reply({ embeds: [tailslooseembed] });
      }
    }

    if (choices === "tails") {
      if (coin === "tails") {
        interaction.reply({ embeds: [tailswinembed] });
      } else if (coin === "heads") {
        interaction.reply({ embeds: [headslooseembed] });
      }
    }
  },
};
