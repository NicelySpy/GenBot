const { EmbedBuilder, WebhookClient } = require("discord.js");

function errLogger(content, err) {
  let loggerWebhook = new WebhookClient({
    id: "1023612429281787954",
    token:
      "EGqooh4bd1aBTAf1Yoro7UzKkTn9SlApRxV9csJFrf7LwD9-6flapfRBd4MTCKc7EQJi",
  });
  if (!content && !err) return;
  const errString = err?.stack || err;

  const embed = new EmbedBuilder()
    .setColor("Red")
    .setAuthor({ name: err?.name || "Error" })
    .setTitle(`🟥 **There was a ${content}** 🟥`)
    .setDescription(
      "```js\n" +
        (errString.length > 4096
          ? `${errString.substr(0, 4000)}...`
          : errString) +
        "\n```"
    );

  if (err?.description)
    embed.addFields({
      name: "Error Description",
      value: `${err?.description}`,
    });
  if (content) embed.addFields({ name: "Error Type", value: `${content}` });
  if (err?.message)
    embed.addFields({ name: "Error Message", value: `${err?.message}` });

  return loggerWebhook.send({
    content: `<@792601024790790184> There seems to have been an error.`,
    username: "Console Logs",
    avatar:
      "https://media.discordapp.net/attachments/799461147367178240/973802347908169788/31bd523f36314ccf6a9facd54f2f7b06.jpg",
    embeds: [embed],
  });
}
module.exports = { errLogger };
