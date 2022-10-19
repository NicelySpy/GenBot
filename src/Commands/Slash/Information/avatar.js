const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
module.exports = {
  ...new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Showing the user avatar")
    .addUserOption((options) =>
      options.setName("user").setDescription("Who is the user?")
    ),
  run: ({ interaction }) => {
    const target = interaction.options.getMember("user") || interaction.member;
    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`${target.user.tag}'s Avatar`)
          .setURL(
            target.displayAvatarURL({
              format: "png",
              dynamic: true,
              size: 4096,
            })
          )
          .setImage(
            target.displayAvatarURL({
              format: "png",
              dynamic: true,
              size: 4096,
            })
          ),
      ],
    });
  },
};
