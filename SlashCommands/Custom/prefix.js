const prefixSchema = require("../../src/Structures/Models/prefix");
const { CommandInteraction } = require("discord.js");

module.exports = {
  name: "prefix",
  description: "Mengkustomasi Prefix Bot",
  userPermissions: ["ADMINISTRATOR"],
  options: [
    {
      name: "prefix",
      description: "Apa prefixnya?",
      type: "STRING",
      required: true,
    },
  ],
  /**
   * @param {CommandInteraction} interaction
   */
  run: async ({ interaction }) => {
    const message = interaction;
    const res = await interaction.options.getString("prefix");
    if (res.length > 3) {
      return interaction.reply({
        content: "Prefix length must be under 3 characters",
      });
    }
    prefixSchema.findOne({ Guild: message.guild.id }, async (err, data) => {
      if (err) throw err;
      if (data) {
        // prefixSchema.findOneAndDelete({ Guild : message.guild.id })
        await data.delete();
        data = new prefixSchema({ Guild: message.guild.id, Prefix: res });
        data.save();
        message.reply({
          content: `Your prefix has been updated to **${res}**`,
        });
      } else {
        data = new prefixSchema({ Guild: message.guild.id, Prefix: res });
        data.save();
        message.reply({
          content: `Custom prefix in this server is now set to **${res}**`,
        });
      }
    });
  },
};
