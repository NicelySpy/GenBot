const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("gaymeter")
    .setDescription("How gay he is?")
    .addUserOption((options) =>
      options.setName("user").setDescription("Who is the user?")
    ),
  run: async ({ client, interaction }) => {
    const target = interaction.options.getMember("user") || interaction.member;
    const res = Math.floor(Math.random() * 101) + "%";

    await interaction.reply({ content: "Counting..." });
    await client.wait(2000);
    await interaction.editReply({
      content: "Counted!",
      embeds: [
        new EmbedBuilder()
          .setColor("Random")
          .setTitle("Is he a gay?")
          .setDescription(`<@${target.id}>'s Gay test result is ${res}🏳️‍🌈🏳️‍🌈`),
      ],
    });
  },
};
