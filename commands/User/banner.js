const { Client, Message, EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  name: "banner",
  description: "Show an user banner",
  usage: ["banner <mention || user id>"],
  args: true,
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const user =
      message.mentions.users.first() ||
      message.guild.members.cache.get(args[0]);
    axios
      .get(`https://discord.com/api/users/${user.id}`, {
        headers: {
          Authorization: `Bot ${client.token}`,
        },
      })
      .then((res) => {
        const { banner, accent_color } = res.data;

        if (banner) {
          const extension = banner.startsWith("a_") ? ".gif" : ".png";
          const url = `https://cdn.discordapp.com/banners/${user.id}/${banner}${extension}`;
          const embed = new Embed()
            .setDescription(`${user.tag}s banner`)
            .setImage(url)
            .setColor(accent_color || "RED");
          {
          }
          message.channel.send({ embeds: [embed] });
        } else if (accent_color) {
          const embed = new Embed()
            .setDescription(
              `${user.tag} Tidak Memiliki Banner Kostum, Dia Hanya Mempunyai Accent Color`
            )
            .setColor(accent_color);

          message.channel.send({ embeds: [embed] });
        } else {
          return message.reply({
            content: `${user.tag} Tidak Mempunyai Banner Kostum Atau Accent Color`,
          });
        }
      });
  },
};
