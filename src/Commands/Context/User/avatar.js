const {
  ContextMenuCommandBuilder,
  EmbedBuilder,
  ApplicationCommandType,
} = require("discord.js");
module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("avatar")
    .setType(ApplicationCommandType.User),
  run: async ({ client, interaction }) => {
    const target = await client.users.fetch(interaction.targetId);
    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`${target.tag}'s Avatar`)
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
