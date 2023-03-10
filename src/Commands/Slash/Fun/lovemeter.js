const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("lovemeter")
    .setDescription("Counting a lovemeter with a target & target")
    .addUserOption((options) =>
      options
        .setName("target1")
        .setDescription("Who is the user?")
        .setRequired(true)
    )
    .addUserOption((options) =>
      options.setName("target2").setDescription("Who is the user?")
    ),
  run: async ({ client, interaction }) => {
    const nilai = Math.floor(Math.random() * 101);
    const target1 = interaction.options.getMember("target1");
    const target2 =
      interaction.options.getMember("target2") || interaction.member;
    const ehem = new EmbedBuilder()
      .setColor("#FF8CEE")
      .addFields({
        name: `<@${target1.id}> w/ <@${target2.id}>`,
        value: `${nilai}%`,
        inline: true,
      })
      .setTimestamp();
    await interaction.reply("Counting...");
    await client.wait(2000);
    await interaction.editReply({ embeds: [ehem], ephemeral: false });
  },
};
