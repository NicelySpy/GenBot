const { exec } = require("child_process");

module.exports = {
  name: "execute",
  aliases: ["exec", "ex"],
  description: "Run a console command from this command(OWNER ONLY)!",
  ownerOnly: true,
  args: true,
  usage: ["<code>"],
  run: async (client, message, args) => {
    const p = args.join(" ");
    if (!p) {
      return message.reply("Where is the Code?").then((msg) => {
        setTimeout(() => msg.delete(), 3000);
      });
    }
    exec(p, (error, stdout) => {
      const response = stdout || error;
      message.channel.send({ content: `${response}`, split: true, code: true });
    });
  },
};
