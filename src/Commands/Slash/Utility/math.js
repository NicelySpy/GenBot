const math = require("mathjs");
const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("math")
    .setDescription("Helps your math home")
    .addStringOption((options) =>
      options.setName("input").setDescription("Math question").setRequired(true)
    ),
  run: async ({ client, interaction }) => {
    const p = interaction.options.getString("input");
    const h = math.evaluate(p);
    try {
      const ha = new EmbedBuilder().setTitle("Calculated!").addFields([
        {
          name: "Input",
          value: `${p}`,
          inline: true,
        },
        {
          name: "Output",
          value: `${h}`,
          inline: true,
        },
      ]);
      await interaction.reply("Calculating..");
      await client.wait(2000);
      await interaction.editReply({
        content: "Calculated!",
        embeds: [ha],
        ephemeral: false,
      });
    } catch (err) {
      console.log(err);
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              "Error!, This may can happend if you put invalid question"
            ),
        ],
        ephemeral: true,
      });
    }
  },
};
