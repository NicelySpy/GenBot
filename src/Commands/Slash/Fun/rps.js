const Discord = require("discord.js");
const rps = ["scissors", "rock", "paper"];
const res = ["Scissors ✌", "Rock 👊", "Paper ✋"];
module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName("rps")
    .setDescription("Plays rock paper scissor with me!!")
    .addStringOption((options) =>
      options
        .setName("choice")
        .setDescription("Choice")
        .setRequired(true)
        .setChoices(
          { name: "Scissors ✌", value: "scissors" },
          { name: "Rock 👊", value: "rock" },
          { name: "Paper ✋", value: "paper" }
        )
    ),
  run: async ({ client, interaction }) => {
    let userChoice;
    userChoice = interaction.options.getString("choice")?.toLowerCase();
    userChoice = rps.indexOf(userChoice);

    const botChoice = Math.floor(Math.random() * 3);
    let result;

    if (userChoice === botChoice) {
      result = "It's a draw no one wins";
    } else if (
      (botChoice === 2 && userChoice === 1) ||
      (botChoice === 1 && userChoice === 0) ||
      (botChoice === 0 && userChoice === 2)
    ) {
      result = `**${client.user.username}** Wins`;
    } else {
      result = `**${interaction.member.displayName}** Wins nice my dude !!`;
    }

    const embed = new Discord.EmbedBuilder()
      .setTitle(
        `${interaction.member.displayName} vs ${client.user.username} **RPS**`
      )
      .addFields(
        {
          name: `${interaction.member.displayName}`,
          value: `${res[userChoice]}`,
          inline: true,
        },
        {
          name: `${client.user.username}`,
          value: `${res[botChoice]}`,
          inline: true,
        },
        { name: "Result", value: `${result}` }
      )
      .setFooter({
        text: `Challenged by ${interaction.member.displayName}`,
        iconURL: interaction.member.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp()
      .setColor("Random");
    interaction.reply({ embeds: [embed] });
  },
};
