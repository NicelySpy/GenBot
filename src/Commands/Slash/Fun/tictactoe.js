/** const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
} = require("discord.js");
const winCombinations = [
  // Across
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // Diagonal
  [0, 4, 8],
  [2, 4, 6],
  // Down
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
];

const emojis = {
  X: "✖",
  O: "⭕",
};

function rows(buttons) {
  return [
    new ActionRowBuilder().addComponents(buttons[0], buttons[1], buttons[2]),
    new ActionRowBuilder().addComponents(buttons[3], buttons[4], buttons[5]),
    new ActionRowBuilder().addComponents(buttons[6], buttons[7], buttons[8]),
  ];
}

function checkWin(butts, currentSign) {
  return winCombinations.some((comb) => {
    return comb.every((i) => {
      return butts[i].emoji?.name === emojis[currentSign];
    });
  });
}

function isDraw(butts) {
  return butts.every((btn) => btn.label !== "-");
}
module.exports = {
  ...new SlashCommandBuilder()
    .setName("tictactoe")
    .setDescription("Starts a game of tic-tac-toe with another user.")
    .addUserOption((options) =>
      options
        .setName("opponent")
        .setDescription("The opponent")
        .setRequired(true)
    ),
  run: async ({ interaction }) => {
    const opponent = interaction.options.getMember("opponent");
    let turn = interaction.member;
    let sign = "X";
    let pip = [];
    for (i = 0; i <= 8; i++) {
      pip.push(
        new ButtonBuilder()
          .setCustomId(i.toString())
          .setStyle(ButtonStyle.Primary)
          .setLabel("-")
      );
    }
    if (opponent.user.id === interaction.user.id) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              "You cant play a game of tic-tac-toe against yourself."
            ),
        ],
        ephemeral: true,
      });
    }
    if (opponent.user.bot) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              "You cant play a game of tic-tac-toe against a bot."
            ),
        ],
        ephemeral: true,
      });
    }
    const initial = await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setAuthor({
            name: interaction.guild.name,
            iconURL: interaction.guild.iconURL({ dynamic: true }),
          })
          .setTitle("Tic-Tac-Toe Game!")
          .setDescription(
            `**${interaction.user.tag} VS ${opponent.user.tag}**\nIts ${turn}(${emojis[sign]}) turn!`
          )
          .setColor("Random")
          .setFooter({
            text: `Game requested by ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
          }),
      ],
      components: rows(pip),
      fetchReply: true,
    });

    const xcollector = initial.createMessageComponentCollector({
      componentType: 2,
      time: 60000,
    });

    xcollector.on("collect", async (i) => {
      if (turn.id !== i.user.id)
        return i.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("Red")
              .setDescription("Wait for your turn!"),
          ],
          ephemeral: true,
        });
      pip[parseInt(i.customId)]
        .setEmoji(emojis[sign])
        .setDisabled(true)
        .setLabel(" ");
      if (checkWin(pip, sign)) {
        pip.forEach((btn) => btn.setDisabled(true));

        i.update({
          embeds: [
            new EmbedBuilder()
              .setColor("Green")
              .setDescription(`${turn} wins!`),
          ],
          components: rows(pip),
        });
        collector.stop();
      } else if (isDraw(pip)) {
        i.update({
          embeds: [new EmbedBuilder().setColor("Green").setDescription("Tie!")],
          components: rows(pip),
        });
        collector.stop();
      } else {
        collector.resetTimer();
        sign === "X" ? (sign = "O") : (sign = "X");
        turn === interaction.member
          ? (currentPlayer = opponent)
          : (currentPlayer = interaction.member);

        i.update({
          embeds: [
            new EmbedBuilder()
              .setAuthor({
                name: interaction.guild.name,
                iconURL: interaction.guild.iconURL({ dynamic: true }),
              })
              .setTitle("Tic-Tac-Toe Game!")
              .setDescription(
                `**${interaction.user.tag} VS ${opponent.user.tag}**\nIts ${turn}(${emojis[sign]}) turn!`
              )
              .setColor("Random")
              .setFooter({
                text: `Game requested by ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
              }),
          ],
          components: rows(pip),
          fetchReply: true,
        });
      }
    });
  },
};
*/
