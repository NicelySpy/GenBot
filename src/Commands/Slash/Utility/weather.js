const Discord = require("discord.js");
const weather = require("weather-js");

module.exports = {
  ...new Discord.SlashCommandBuilder()
    .setName("weather")
    .setDescription("Weather command")
    .addStringOption((options) =>
      options.setName("city").setDescription("The City").setRequired(true)
    ),
  run: async ({ interaction }) => {
    const city = interaction.options.getString("city");
    const degreetype = "C";

    await weather.find(
      { search: city, degreeType: degreetype },
      function (err, result) {
        if (err || result === undefined || result.length === 0) {
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor("Red")
                .setDescription("Unknown city.. Please try again.."),
            ],
            ephemeral: true,
          });
        }

        const current = result[0].current;
        const location = result[0].location;

        const embed = new Discord.EmbedBuilder()
          .setAuthor({ name: current.observationpoint })
          .setDescription(`> ${current.skytext}`)
          .setThumbnail(current.imageUrl)
          .setTimestamp()
          .setColor(0x7289da);
        const array = [
          { name: "Latitude", value: "➮ " + location.lat, inline: true },
          { name: "Longtitude", value: "➮ " + location.long, inline: true },
          {
            name: "Feels Like",
            value: "➮ " + current.feelslike + "° Degress",
            inline: true,
          },
          {
            name: "Degree Type",
            value: "➮ " + location.degreetype,
            inline: true,
          },
          { name: "Winds", value: "➮ " + current.winddisplay, inline: true },
          {
            name: "Humidity",
            value: "➮ " + current.humidity + "%",
            inline: true,
          },
          {
            name: "Timezone",
            value: "➮ GMT" + location.timezone,
            inline: true,
          },
          {
            name: "Temperature",
            value: "➮ " + current.temperature + "° Degrees",
          },
          {
            name: "Observation Time",
            value: "➮ " + current.observationtime,
            inline: true,
          },
        ];
        embed.addFields(array);

        return interaction.reply({ embeds: [embed], ephemeral: false });
      }
    );
  },
};
