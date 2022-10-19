const glob = require("glob");

const chalk = require("chalk");
module.exports = {
  name: "reload",
  description: "Reload the commands",
  aliases: ["load"],
  ownerOnly: true,
  run: async (client, message, args) => {
    client.commands.sweep(() => true);
    glob(`${__dirname}/../**/*.js`, async (err, filePaths) => {
      filePaths.forEach((file) => {
        delete require.cache[require.resolve(file)];
        const pull = require(file);
        if (pull.name) {
          console.log(
            chalk.green.bold(`[RELOAD] Reloaded ${pull.name} commands!`)
          );
          client.commands.set(pull.name, pull);
        }
        if (pull.aliases && Array.isArray(pull.aliases)) {
          pull.aliases.forEach((alias) => {
            client.aliases.set(alias, pull.name);
          });
        }
      });
    });
    message.reply("Reloaded");
  },
};
