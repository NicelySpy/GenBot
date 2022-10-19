module.exports = {
  ...new (require("discord.js").SlashCommandBuilder)()
    .setName("say")
    .setDescription("Will saying the word/s")
    .addStringOption((options) =>
      options.setName("text").setDescription("Text to say").setRequired(true)
    ),
  run: async ({ client, interaction }) => {
    const txt = interaction.options.getString("text");
    interaction.reply({
      content: `Wait until saying the word (${txt})`,
      ephemeral: true,
    });
    await client.wait(2000);
    return interaction.channel.send(`${txt}`);
  },
};
