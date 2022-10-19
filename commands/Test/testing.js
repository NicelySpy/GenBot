const Command = require("../../src/Structures/Classes/Command");
module.exports = new Command({
  name: "testing",
  ownerOnly: true,
  run: async (client, message, args) => {
    message.reply("BOOOO");
  },
});
