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
    await interaction.deferReply();
    const q = interaction.options.getString("input");
    let p = q.replace("×", "*").replace("÷", "/");
    const h = math.evaluate(p);
    try {
      const ha = new EmbedBuilder().setTitle("Calculated!").addFields([
        {
          name: "Input",
          value: `${q}`,
          inline: true,
        },
        {
          name: "Output",
          value: `${h}`,
          inline: true,
        },
      ]);
      await interaction.editReply({
        embeds: [ha],
        ephemeral: false,
      });
    } catch (err) {
      throw err;
      interaction.editReply({
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
