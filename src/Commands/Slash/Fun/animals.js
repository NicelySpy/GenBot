const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  ...new SlashCommandBuilder()
    .setName("animals")
    .setDescription("Showing animals picture")
    .addStringOption((options) =>
      options
        .setName("name")
        .setDescription("The name.")
        .setRequired(true)
        .setChoices(
          { name: "Bird", value: "bird" },
          { name: "Cat", value: "cat" },
          { name: "Dog", value: "dog" },
          { name: "Fox", value: "fox" },
          { name: "Kangaroo", value: "kangaroo" },
          { name: "Koala", value: "koala" },
          { name: "Panda", value: "panda" },
          { name: "Raccoon", value: "raccoon" },
          { name: "Redpanda", value: "red_panda" },
          { name: "Random", value: "random" }
        )
    ),
  run: async ({ interaction }) => {
    const omeji = interaction.options.getString("name");
    if (omeji === "random") {
      const url = "https://some-random-api.ml/animal/";

      let fact, image, res;

      const array = [
        "dog",
        "cat",
        "panda",
        "fox",
        "red_panda",
        "koala",
        "bird",
        "raccoon",
        "kangaroo",
      ];
      const arrayRes = array[Math.floor(Math.random() * array.length)];
      const newUrl = `${url}${arrayRes}`;

      res = await axios.get(newUrl);
      image = res.data.image;
      fact = res.data.fact;
      const embed = new EmbedBuilder()
        .setColor("#f3f3f3")
        .setDescription(fact)
        .setImage(image);

      await interaction.reply({ embeds: [embed] });
    } else if (omeji !== "random") {
      const url = `https://some-random-api.ml/animal/${omeji}`;

      let image, response;
      response = await axios.get(url);
      image = response.data;
      const embed = new EmbedBuilder()
        .setColor("#f3f3f3")
        .setDescription(image.fact)
        .setImage(image.image);

      await interaction.reply({ embeds: [embed] });
    }
  },
};
