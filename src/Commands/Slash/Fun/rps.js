const Discord = require("discord.js");
const rps = [null, "scissors", "rock", "paper"];
const res = [null, "Scissors ✌", "Rock 👊", "Paper ✋"];
module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName("rps")
    .setDescription("Plays rock paper scissor someone")
    .addUserOption((options) =>
      options
        .setName("opponent")
        .setDescription("Your opponent.")
        .setRequired(true)
    ),
  run: async ({ client, interaction }) => {
    let userChoice = null;
    let opponentChoice = null;
    const player = {
      user: interaction.member,
      opponent: interaction.options.getMember("opponent"),
    };
    //if(player.user.id == player.opponent.id) return interaction.reply({ content: "You can't play with yourself.", ephemeral: true })
    let components = [
      new Discord.ActionRowBuilder().addComponents([
        new Discord.ButtonBuilder()
          .setLabel("✌️")
          .setCustomId("scissors")
          .setStyle(Discord.ButtonStyle.Primary),
        new Discord.ButtonBuilder()
          .setLabel("👊")
          .setCustomId("rock")
          .setStyle(Discord.ButtonStyle.Primary),
        new Discord.ButtonBuilder()
          .setLabel("🤚")
          .setCustomId("paper")
          .setStyle(Discord.ButtonStyle.Primary),
      ]),
    ];
    let embed = new Discord.EmbedBuilder()
      .setTitle("🔥RPS Battle🔥")
      .setDescription(`${player.user} VS ${player.opponent}`)
      .setColor("Orange")
      .setFooter({
        text: "Can be used for the next 3 min!",
      });
    const msg = await interaction.reply({
      embeds: [embed],
      components,
      fetchReply: true,
    });
    const collector = msg.createMessageComponentCollector({
      filter: (b) => {
        if (b.user.id !== player.user.id && b.user.id !== player.opponent.id)
          return b.reply({
            content: "You can only watch this battle!",
            ephemeral: true,
          });
        else return true;
      },
      time: 180000,
    });
    collector.on("collect", async (btn) => {
      await btn.deferUpdate();
      if (btn.user.id == player.user.id && !userChoice) {
        userChoice = rps.indexOf(btn.customId);
        btn.followUp({
          content: `You choosing ${res[userChoice]}.`,
          ephemeral: true,
        });
      } else if (btn.user.id == player.opponent.id && !opponentChoice) {
        opponentChoice = rps.indexOf(btn.customId);
        btn.followUp({
          content: `You choosing ${res[opponentChoice]}.`,
          ephemeral: true,
        });
      }
	    console.log(userChoice, opponentChoice)
      if (userChoice && opponentChoice) return collector.stop();
    });
    collector.on("end", async () => {
      msg.edit({
        embeds: [
          embed
            .setDescription(
              `${player.user}: ${res[userChoice] ?? "??"}\nVS\n${
                player.opponent
              }: ${res[opponentChoice] ?? "??"}`
            )
            .addFields({
              name: "Result",
              value: `${checkWin(userChoice - 1, opponentChoice - 1)}`,
            }),
        ],
        components: [],
      });
    });
    function checkWin(a, b) {
      let result;
      if ((a == 2 && b == 1) || (a == 1 && b == 0) || (a == 0 && b == 2))
        result = `${player.user} Wins🔥`;
      else if ((a == 0 && b == 1) || (a == 1 && b == 2) || (a == 2 && b == 0))
        result = `${player.opponent} Wins🔥`;
      else if (a == b || !a || !b) result = "Tie! No one wins..😥";
      return result;
    }
  },
};
