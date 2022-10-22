const { inspect } = require("util");
const { clean, save } = require("../../src/Structures/Utils/string");
const { EmbedBuilder } = require("discord.js");
const { create } = require("sourcebin");
module.exports = {
  name: "eval",
  description: "Evaluate the code(OWNER ONLY)",
  aliases: ["e", "ev", "evaluate"],
  ownerOnly: true,
  args: true,
  usage: ["<code>"],
  run: async (client, message, args) => {
    try {
      const code = args.join(" ");
      if (!code) {
        return message.reply("Where is the code?").then((msg) => {
          setTimeout(() => msg.delete(), 3000);
        });
      }
      let evaled = eval(code);
      if (typeof evaled !== "string") evaled = inspect(evaled);
      evaled = clean(evaled);
      evaled = save(evaled);
      const embed = new EmbedBuilder()
        .setAuthor("Eval", message.author.avatarURL())
        .setColor("GREEN")
        .setTimestamp();
      if (code.length >= 1024) {
        const inputUrl = (
          await create([
            {
              content: code,
              language: "Javascript",
              name: "Input Code",
            },
          ])
        ).url;
        embed.addField(
          "Input",
          `Input length is 1024 or Higher, Press [this](${inputUrl}) to view the input code`
        );
        embed.addField("Output", `\`\`\`js\n${evaled}\n\`\`\``);
      } else if (evaled.length >= 1024) {
        const outputUrl = (
          await create([
            {
              content: evaled,
              language: "Javascript",
              name: "Output Code",
            },
          ])
        ).url;
        embed.addField("Input", `\`\`\`js\n${code}\n\`\`\``);
        embed.addField(
          "Output",
          `Output length is 1024 or Higher, Press [this](${outputUrl}) to view the output code`
        );
      } else if (code.length >= 1024 && evaled.length >= 1024) {
        const iu = (
          await create([
            {
              content: code,
              language: "Javascript",
              name: "Input Code",
            },
          ])
        ).url;
        const ou = (
          await create([
            {
              content: evaled,
              language: "Javascript",
              name: "Output Code",
            },
          ])
        ).url;
        embed.addField(
          "Input",
          `Input length is 1024 or Higher, Press [this](${iu}) to view the input code`
        );
        embed.addField(
          "Output",
          `Output length is 1024 or Higher, Press [this](${ou}) to view the output code`
        );
      } else {
        embed.addField("Input", `\`\`\`js\n${code}\n\`\`\``);
        embed.addField("Output", `\`\`\`js\n${evaled}\n\`\`\``);
      }
      message.reply({ embeds: [embed] });
    } catch (err) {
      message.channel.send(`\`Error\` \`\`\`\n${err}\`\`\``).then((msg) => {
        setTimeout(() => msg.delete(), 3000);
      });
    }
  },
};
