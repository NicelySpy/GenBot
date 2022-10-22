const {
  EmbedBuilder,
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require("discord.js");
module.exports = {
  ...new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban members")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Ban members")
        .addUserOption((options) =>
          options.setName("user").setDescription("The user").setRequired(true)
        )
        .addStringOption((options) =>
          options.setName("reason").setDescription("The reason")
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("delete")
        .setDescription("Unban members")
        .addStringOption((options) =>
          options
            .setName("userid")
            .setDescription("The user id")
            .setRequired(true)
        )
    )
    .toJSON(),
  run: async ({ interaction }) => {
    const target = interaction.options.getMember("user");
    const reason = interaction.options.getString("reason") || "No reason";
    const userId = interaction.options.getString("userid");
    let what = new EmbedBuilder().setColor("Red");
    let check = () => {
      const tWi =
        interaction.options.getMember("user").roles.highest.position >=
        interaction.guild.members.me.roles.highest.position;
      const tWu =
        interaction.options.getMember("user").roles.highest.position >=
        interaction.member.roles.highest.position;
      if (tWi || tWu) {
        if (tWi)
          what.setDescription(
            `The role of ${
              interaction.options.getMember("user").user.tag
            } is higher than my role`
          );
        if (tWu)
          what.setDescription(
            `The role of ${
              interaction.options.getMember("user").user.tag
            } is higher than your role`
          );

        return interaction.reply({
          embeds: [what],
          ephemeral: true,
        });
      }
    };
    switch (interaction.options.getSubcommand()) {
      case "add":
        {
          await check();
          target.send({
            embeds: [
              new EmbedBuilder()
                .setColor("Red")
                .setDescription(
                  `You has been banned from ${interaction.guild.name}, ${reason}`
                ),
            ],
          });
          target.ban({ reason });
          interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor("Green")
                .setDescription(`Banned ${target.user.tag}, ${reason}`),
            ],
          });
        }
        break;
      case "delete":
        {
          await interaction.guild.members.unban(userid).then((user) => {
            user.send({
              embeds: [
                new EmbedBuilder()
                  .setColor("Red")
                  .setDescription(
                    `You has been banned from ${interaction.guild.name}, ${reason}`
                  ),
              ],
            });
            interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setColor("Green")
                  .setDescription(`Unbanned ${user.user.tag}`),
              ],
            });
          });
        }
    }
  },
};
