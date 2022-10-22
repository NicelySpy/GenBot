const axios = require("axios");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "fox",
  category: "animals",
  run: async (client, message, args) => {
    const url = "https://some-random-api.ml/animal/fox";

    let image, response;
    try {
      response = await axios.get(url);
      image = response.data;
    } catch (e) {
      return message.channel.send("An error occured, please try again!");
    }

    const embed = new EmbedBuilder()
      .setTitle("Random Fox Image and Fact")
      .setColor("#f3f3f3")
      .setDescription(image.fact)
      .setImage(image.image);

    await message.channel.send({ embeds: [embed] });
  },
};
4;
