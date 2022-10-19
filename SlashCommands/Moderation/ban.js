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
    .addUserOption((options) =>
      options.setName("user").setDescription("The user").setRequired(true)
    )
    .addStringOption((options) =>
      options.setName("reason").setDescription("The reason")
    ),
  run: async ({ interaction }) => {
    const aku = interaction.guild.members.me;
    const target = interaction.options.getMember("user");
    const reason = interaction.options.getString("reason") || "No reason";
    const dia = interaction.member;
    if (target.roles.highest.position >= aku.roles.highest.position)
      return interaction.reply({
        content: `The role of \`\`\`${target.user.tag}\`\`\` is higher than my role`,
        ephemeral: true,
      });
    if (target.roles.highest.position >= dia.roles.highest.position)
      return interaction.reply({
        content: `The role of \`\`\`${target.user.tag}\`\`\` is higher than your role`,
        ephemeral: true,
      });

    await target.send(
      `You has been banned from ${interaction.guild.name}, \`\`\`${reason}\`\`\``
    );
    target.ban({ reason });
    interaction.reply({
      content: `Banned ${target.user.tag}, \`\`\`${reason}\`\`\``,
    });
  },
};
