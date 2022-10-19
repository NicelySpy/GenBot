const { errLogger } = require("@function/logger.js");
const { EmbedBuilder } = require("discord.js");
module.exports = {
  name: "interactionCreate",
  run: async (interaction, client) => {
    // Slash Command Handling
    if (interaction.isChatInputCommand()) {
      const cmd = client.commands.collection.get(interaction.commandName);
      if (!cmd) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("Red")
              .setDescription("An error has occured"),
          ],
          ephemeral: true,
        });
      }
      interaction.member = interaction.guild.members.cache.get(
        interaction.user.id
      );

      if (!interaction.memberPermissions.has(cmd.userPermissions || [])) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("Red")
              .setDescription(
                "You didn't have the permission/s to use this command!"
              ),
          ],
          ephemeral: true,
        });
      }
      if (
        !interaction.guild.members.me.permissions.has(cmd.botPermissions || [])
      ) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("Red")
              .setDescription(
                "I didn't have the permission/s to use this command!"
              ),
          ],
          ephemeral: true,
        });
      }
      if (cmd.devOnly && !client.owners.includes(interaction.member.id)) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("Red")
              .setDescription("Sorry, this command is owner only!"),
          ],
          ephemeral: true,
        });
      }
      if (!client.owners.includes(interaction.member.id))
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("Red")
              .setDescription("Sorry, this command is only for developer!"),
          ],
          ephemeral: true,
        });
      cmd
        .run({ client, interaction })
        .catch((err) => errLogger("CommandError", err));
      console.log("Someone has using /" + interaction.commandName);
    }
    if (interaction.isContextMenuCommand()) {
      await interaction.deferReply({ ephemeral: false });
      const command = client.contexts.collection.get(interaction.commandName);
      if (command) command.run({ client, interaction });
    }
  },
};
