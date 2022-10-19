const {
  EmbedBuilder,
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require("discord.js");
module.exports = {
  ...new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick members")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption((options) =>
      options.setName("user").setDescription("The user").setRequired(true)
    )
    .addStringOption((options) =>
      options.setName("reason").setDescription("The reason")
    ),
  run: async ({ interaction }) => {
    let what = new EmbedBuilder().setColor("Red");
    const aku = interaction.guild.members.me;
    const target = interaction.options.getMember("user");
    const reason = interaction.options.getString("reason") || "No reason";
    const dia = interaction.member;
    const tWi = target.roles.highest.position >= aku.roles.highest.position;
    const tWu = target.roles.highest.position >= dia.roles.highest.position;
    if (tWi || tWu) {
      if (tWi)
        what.setDescription(
          `The role of ${target.user.tag} is higher than my role`
        );
      if (tWu)
        what.setDescription(
          `The role of ${target.user.tag} is higher than your role`
        );

      return interaction.reply({
        embeds: [what],
        ephemeral: true,
      });
    }

    await target.send({
      embeds: [
        new EmbedBuilder()
          .setColor("Red")
          .setDescription(
            `You has been kicked from ${interaction.guild.name}, ${reason}`
          ),
      ],
    });
    target.kick(reason);
    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Green")
          .setDescription(`Kicked ${target.user.tag}, ${reason}`),
      ],
    });
  },
};
