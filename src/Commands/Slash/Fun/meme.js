const got = require("got");
const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("meme")
    .setDescription("Post the meme from reddit"),
  run: async ({ interaction }) => {
    got("https://www.reddit.com/r/memes/random/.json").then((res) => {
      const content = JSON.parse(res.body);
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(content[0].data.children[0].data.title)
            .setImage(content[0].data.children[0].data.url)
            .setColor("Random")
            .setFooter({
              text: `👍 ${content[0].data.children[0].data.ups} 👎 ${content[0].data.children[0].data.downs} | Comments : ${content[0].data.children[0].data.num_comments}`,
            }),
        ],
      });
    });
  },
};
