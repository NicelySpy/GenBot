const d = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new d.SlashCommandBuilder()
    .setName("banner")
    .setDescription("Get user banner")
    .addUserOption((opt) =>
      opt.setName("user").setDescription("The user").setRequired(true)
    ),
  run: async ({ client, interaction }) => {
    const target = interaction.options.getMember("user");
    axios
      .get(`https://discord.com/api/users/${target.id}`, {
        headers: {
          Authorization: `Bot ${client.token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
      });
  },
};
