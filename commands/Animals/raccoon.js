const axios = require("axios");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "raccoon",
  category: "animals",
  run: async (client, message, args) => {
    const url = "https://some-random-api.ml/animal/raccoon";

    let image, response;
    try {
      response = await axios.get(url);
      image = response.data;
    } catch (e) {
      return message.channel.send("An error occured, please try again!");
    }

    const embed = new MessageEmbed()
      .setTitle("Random Raccoon Image and Fact")
      .setColor("#f3f3f3")
      .setDescription(image.fact)
      .setImage(image.image);

    await message.channel.send({ embeds: [embed] });
  },
};
