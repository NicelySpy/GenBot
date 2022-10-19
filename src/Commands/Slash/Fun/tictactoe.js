const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
} = require("discord.js");
const xPlaying = new Set();
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
    if (opponent.user.id === interaction.user.id) {
      return interaction
        .reply({
          embeds: [
            new EmbedBuilder()
              .setColor("Red")
              .setDescription(
                "You cant play a game of tic-tac-toe against yourself."
              ),
          ],
          ephemeral: true,
        })
        .catch((err) => {});
    }
    if (opponent.user.bot) {
      return interaction
        .reply({
          embeds: [
            new EmbedBuilder()
              .setColor("Red")
              .setDescription(
                "You cant play a game of tic-tac-toe against a bot."
              ),
          ],
          ephemeral: true,
        })
        .catch((err) => {});
    }

    if (xPlaying.has(interaction.user.id) || xPlaying.has(opponent.user.id)) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              "One of you is already in a match! Complete that match first to start a new match!"
            ),
        ],
        ephemeral: true,
      });
    }
    xPlaying.add(interaction.user.id);
    xPlaying.add(opponent.user.id);

    let a1 = "⬜";
    let a2 = "⬜";
    let a3 = "⬜";
    let a4 = "⬜";
    let a5 = "⬜";
    let a6 = "⬜";
    let a7 = "⬜";
    let a8 = "⬜";
    let a9 = "⬜";

    const new1 = new ActionRowBuilder().addComponents(
      (grey1 = new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("grey1")
        .setEmoji("➖")),
      (grey2 = new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("grey2")
        .setEmoji("➖")),
      (grey3 = new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("grey3")
        .setEmoji("➖"))
    );

    const new2 = new ActionRowBuilder().addComponents(
      (grey4 = new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("grey4")
        .setEmoji("➖")),
      (grey5 = new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("grey5")
        .setEmoji("➖")),
      (grey6 = new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("grey6")
        .setEmoji("➖"))
    );

    const new3 = new ActionRowBuilder().addComponents(
      (grey7 = new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("grey7")
        .setEmoji("➖")),
      (grey8 = new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("grey8")
        .setEmoji("➖")),
      (grey9 = new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("grey9")
        .setEmoji("➖"))
    );

    const embed = new EmbedBuilder()
      .setAuthor({
        name: interaction.guild.name,
        iconURL: interaction.guild.iconURL({ dynamic: true }),
      })
      .setTitle("Tic-Tac-Toe Game!")
      .setDescription(`**${interaction.user.tag} versus ${opponent.user.tag}**`)
      .setColor("Random")
      .setFooter({
        text: `Game requested by ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      });

    const initial = await interaction
      .reply({
        embeds: [embed],
        components: [new1, new2, new3],
        fetchReply: true,
      })
      .catch((err) => {});

    const xcollector = initial.createMessageComponentCollector({
      componentType: 2,
    });

    xcollector.on("collect", async (i) => {
      if (xPlaying.has(interaction.user.id)) {
        if (i.user.id === interaction.user.id) {
          if (i.customId === "grey1") {
            new1.components[0]
              .setStyle(ButtonStyle.Primary)
              .setEmoji("❌")
              .setCustomId("x1")
              .setDisabled(true);
            a1 = "x";
            i.update({ embeds: [embed], components: [new1, new2, new3] }).catch(
              (err) => {}
            );
            xPlaying.delete(interaction.user.id);
          } else if (i.customId === "grey2") {
            new1.components[1]
              .setStyle(ButtonStyle.Primary)
              .setEmoji("❌")
              .setCustomId("x2")
              .setDisabled(true);
            a2 = "x";
            i.update({ embeds: [embed], components: [new1, new2, new3] }).catch(
              (err) => {}
            );
            xPlaying.delete(interaction.user.id);
          } else if (i.customId === "grey3") {
            new1.components[2]
              .setStyle(ButtonStyle.Primary)
              .setEmoji("❌")
              .setCustomId("x3")
              .setDisabled(true);
            a3 = "x";
            i.update({ embeds: [embed], components: [new1, new2, new3] }).catch(
              (err) => {}
            );
            xPlaying.delete(interaction.user.id);
          } else if (i.customId === "grey4") {
            new2.components[0]
              .setStyle(ButtonStyle.Primary)
              .setEmoji("❌")
              .setCustomId("x4")
              .setDisabled(true);
            a4 = "x";
            i.update({ embeds: [embed], components: [new1, new2, new3] }).catch(
              (err) => {}
            );
            xPlaying.delete(interaction.user.id);
          } else if (i.customId === "grey5") {
            new2.components[1]
              .setStyle(ButtonStyle.Primary)
              .setEmoji("❌")
              .setCustomId("x5")
              .setDisabled(true);
            a5 = "x";
            i.update({ embeds: [embed], components: [new1, new2, new3] }).catch(
              (err) => {}
            );
            xPlaying.delete(interaction.user.id);
          } else if (i.customId === "grey6") {
            new2.components[2]
              .setStyle(ButtonStyle.Primary)
              .setEmoji("❌")
              .setCustomId("x6")
              .setDisabled(true);
            a6 = "x";
            i.update({ embeds: [embed], components: [new1, new2, new3] }).catch(
              (err) => {}
            );
            xPlaying.delete(interaction.user.id);
          } else if (i.customId === "grey7") {
            new3.components[0]
              .setStyle(ButtonStyle.Primary)
              .setEmoji("❌")
              .setCustomId("x7")
              .setDisabled(true);
            a7 = "x";
            i.update({ embeds: [embed], components: [new1, new2, new3] }).catch(
              (err) => {}
            );
            xPlaying.delete(interaction.user.id);
          } else if (i.customId === "grey8") {
            new3.components[1]
              .setStyle(ButtonStyle.Primary)
              .setEmoji("❌")
              .setCustomId("x8")
              .setDisabled(true);
            a8 = "x";
            i.update({ embeds: [embed], components: [new1, new2, new3] }).catch(
              (err) => {}
            );
            xPlaying.delete(interaction.user.id);
          } else if (i.customId === "grey9") {
            new3.components[2]
              .setStyle(ButtonStyle.Primary)
              .setEmoji("❌")
              .setCustomId("x9")
              .setDisabled(true);
            a9 = "x";
            i.update({ embeds: [embed], components: [new1, new2, new3] }).catch(
              (err) => {}
            );
            xPlaying.delete(interaction.user.id);
          }

          if (
            (a1 === "x" && a2 === "x" && a3 === "x") ||
            (a4 === "x" && a5 === "x" && a6 === "x") ||
            (a7 === "x" && a8 === "x" && a9 === "x") ||
            (a1 === "x" && a4 === "x" && a7 === "x") ||
            (a2 === "x" && a5 === "x" && a8 === "x") ||
            (a3 === "x" && a6 === "x" && a9 === "x") ||
            (a1 === "x" && a5 === "x" && a9 === "x") ||
            (a3 === "x" && a5 === "x" && a7 === "x")
          ) {
            interaction.channel
              .send({
                embeds: [
                  new EmbedBuilder()
                    .setColor("Green")
                    .setDescription(`${opponent.user.tag} wins!`),
                ],
              })
              .catch((err) => {});
            xcollector.stop();
            xPlaying.delete(opponent.user.id);
            xPlaying.delete(interaction.user.id);
          } else if (
            a1 !== "⬜" &&
            a2 !== "⬜" &&
            a3 !== "⬜" &&
            a4 !== "⬜" &&
            a5 !== "⬜" &&
            a6 !== "⬜" &&
            a7 !== "⬜" &&
            a8 !== "⬜" &&
            a9 !== "⬜"
          ) {
            interaction.channel.send({
              embeds: [
                new EmbedBuilder().setColor("Green").setDescription("Tie!"),
              ],
            });
            xcollector.stop();
            xPlaying.delete(opponent.user.id);
            xPlaying.delete(interaction.user.id);
          } else {
            return;
          }
        } else if (i.user.id === opponent.user.id) {
          i.reply({
            embeds: [
              new EmbedBuilder()
                .setColor("Red")
                .setDescription("Wait for your turn!"),
            ],
            ephemeral: true,
          }).catch((err) => {});
        } else {
          i.reply({
            embeds: [
              new EmbedBuilder()
                .setColor("Red")
                .setDescription("This is not your game!"),
            ],
            ephemeral: true,
          }).catch((err) => {});
        }
      } else if (!xPlaying.has(interaction.user.id)) {
        if (i.user.id === interaction.user.id) {
          i.reply({
            embeds: [
              new EmbedBuilder()
                .setColor("Red")
                .setDescription("Wait for your turn!"),
            ],
            ephemeral: true,
          }).catch((err) => {});
        } else if (i.user.id === opponent.user.id) {
          if (i.customId === "grey1") {
            new1.components[0]
              .setStyle(ButtonStyle.Primary)
              .setEmoji("⭕")
              .setCustomId("o1")
              .setDisabled(true);
            a1 = "o";
            i.update({ embeds: [embed], components: [new1, new2, new3] }).catch(
              (err) => {}
            );
            xPlaying.add(interaction.user.id);
          } else if (i.customId === "grey2") {
            new1.components[1]
              .setStyle(ButtonStyle.Primary)
              .setEmoji("⭕")
              .setCustomId("o2")
              .setDisabled(true);
            a2 = "o";
            i.update({ embeds: [embed], components: [new1, new2, new3] }).catch(
              (err) => {}
            );
            xPlaying.add(interaction.user.id);
          } else if (i.customId === "grey3") {
            new1.components[2]
              .setStyle(ButtonStyle.Primary)
              .setEmoji("⭕")
              .setCustomId("o3")
              .setDisabled(true);
            a3 = "o";
            i.update({ embeds: [embed], components: [new1, new2, new3] }).catch(
              (err) => {}
            );
            xPlaying.add(interaction.user.id);
          } else if (i.customId === "grey4") {
            new2.components[0]
              .setStyle(ButtonStyle.Primary)
              .setEmoji("⭕")
              .setCustomId("o4")
              .setDisabled(true);
            a4 = "o";
            i.update({ embeds: [embed], components: [new1, new2, new3] }).catch(
              (err) => {}
            );
            xPlaying.add(interaction.user.id);
          } else if (i.customId === "grey5") {
            new2.components[1]
              .setStyle(ButtonStyle.Primary)
              .setEmoji("⭕")
              .setCustomId("o5")
              .setDisabled(true);
            a5 = "o";
            i.update({ embeds: [embed], components: [new1, new2, new3] }).catch(
              (err) => {}
            );
            xPlaying.add(interaction.user.id);
          } else if (i.customId === "grey6") {
            new2.components[2]
              .setStyle(ButtonStyle.Primary)
              .setEmoji("⭕")
              .setCustomId("o6")
              .setDisabled(true);
            a6 = "o";
            i.update({ embeds: [embed], components: [new1, new2, new3] }).catch(
              (err) => {}
            );
            xPlaying.add(interaction.user.id);
          } else if (i.customId === "grey7") {
            new3.components[0]
              .setStyle(ButtonStyle.Primary)
              .setEmoji("⭕")
              .setCustomId("o7")
              .setDisabled(true);
            a7 = "o";
            i.update({ embeds: [embed], components: [new1, new2, new3] }).catch(
              (err) => {}
            );
            xPlaying.add(interaction.user.id);
          } else if (i.customId === "grey8") {
            new3.components[1]
              .setStyle(ButtonStyle.Primary)
              .setEmoji("⭕")
              .setCustomId("o8")
              .setDisabled(true);
            a8 = "o";
            i.update({ embeds: [embed], components: [new1, new2, new3] }).catch(
              (err) => {}
            );
            xPlaying.add(interaction.user.id);
          } else if (i.customId === "grey9") {
            new3.components[2]
              .setStyle(ButtonStyle.Primary)
              .setEmoji("⭕")
              .setCustomId("o9")
              .setDisabled(true);
            a9 = "o";
            i.update({ embeds: [embed], components: [new1, new2, new3] }).catch(
              (err) => {}
            );
            xPlaying.add(interaction.user.id);
          }

          if (
            (a1 === "o" && a2 === "o" && a3 === "o") ||
            (a4 === "o" && a5 === "o" && a6 === "o") ||
            (a7 === "o" && a8 === "o" && a9 === "o") ||
            (a1 === "o" && a4 === "o" && a7 === "o") ||
            (a2 === "o" && a5 === "o" && a8 === "o") ||
            (a3 === "o" && a6 === "o" && a9 === "o") ||
            (a1 === "o" && a5 === "o" && a9 === "o") ||
            (a3 === "o" && a5 === "o" && a7 === "o")
          ) {
            interaction.channel
              .send({
                embeds: [
                  new EmbedBuilder()
                    .setColor("Green")
                    .setDescription(`${opponent.user.tag} wins!`),
                ],
              })
              .catch((err) => {});
            xcollector.stop();
            xPlaying.delete(opponent.user.id);
            xPlaying.delete(interaction.user.id);
          } else if (
            a1 !== "⬜" &&
            a2 !== "⬜" &&
            a3 !== "⬜" &&
            a4 !== "⬜" &&
            a5 !== "⬜" &&
            a6 !== "⬜" &&
            a7 !== "⬜" &&
            a8 !== "⬜" &&
            a9 !== "⬜"
          ) {
            interaction.channel.send({
              embeds: [
                new EmbedBuilder().setColor("Green").setDescription("Tie!"),
              ],
            });
            xcollector.stop();
            xPlaying.delete(opponent.user.id);
            xPlaying.delete(interaction.user.id);
          } else {
            return;
          }
        } else {
          i.reply({
            embeds: [
              new EmbedBuilder()
                .setColor("Red")
                .setDescription("This is not your game!"),
            ],
            ephemeral: true,
          }).catch((err) => {});
        }
      }
    });
  },
};
