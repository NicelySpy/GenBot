const { codeBlock, SlashCommandBuilder } = require("discord.js");
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);
module.exports = {
  data: new SlashCommandBuilder()
    .setName("chatgpt")
    .setDescription("Ask Chat-GPT for an answer or question!")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("question")
        .setDescription("Ask Chat-GPT a question!")
        .addStringOption((option) =>
          option
            .setName("q-content")
            .setDescription("What do you want to ask?")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommands) =>
      subcommands
        .setName("image")
        .setDescription("Ask Chat-GPT to generate an image!")
        .addStringOption((options) =>
          options
            .setName("i-content")
            .setDescription("What do you want to generate?")
            .setRequired(true)
        )
    ),
  run: async ({ interaction }) => {
    await interaction.deferReply();
    const subCommand = interaction.options.getSubcommand();
    const question = interaction.options.getString("q-content");
    const image = interaction.options.getString("i-content");

    switch (subCommand) {
      case "question":
        {
          interaction.editReply({
            content: "Please wait while your question is being processed!",
          });
          try {
            const response = await openai.createCompletion({
              model: "text-davinci-003", // Most powerful model so far
              prompt: question,
              max_tokens: 2048, // 2048 because that's the maximum amount of characters in Discord
              temperature: 0.5,
            });
            interaction.editReply({
              content: codeBlock(response.data.choices[0].text),
            });
          } catch (error) {
            console.log(error);
            interaction.editReply({
              content: "Request failed! Please try again later!",
            });
          }
        }
        break;

      case "image":
        {
          await interaction.editReply({
            content: "Please wait while your image is being generated!",
          });
          try {
            const response = await openai.createImage({
              prompt: image,
              n: 1, // Amount of images to send
              size: "1024x1024", // 256x256 or 512x512 or 1024x1024
            });
            interaction.editReply({ content: response.data.data[0].url });
          } catch (error) {
            console.log(error);
            interaction.editReply({
              content: "Request failed! Please try again later!",
            });
          }
        }
        break;
    }
  },
};
