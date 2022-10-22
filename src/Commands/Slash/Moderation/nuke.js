const {
  EmbedBuilder,
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require("discord.js");
module.exports = {
  ...new SlashCommandBuilder()
    .setName("Nuke")
    .setDescription("Will delete all the messages.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  run: async ({ client, interaction }) => {
    interaction.reply({ content: "Waiting...", ephemeral: true });
    await client.wait(3000);
    return interaction.channel.clone().then((ch) => {
      ch.setParent(interaction.channel.parent.id);
      ch.setPosition(interaction.channel.position);
      interaction.channel.delete();
      return ch.send({
        embeds: [
          new EmbedBuilder()
            .setDescription("This channel has been nuked.")
            .setColor("Orange"),
        ],
      });
    });
  },
};
