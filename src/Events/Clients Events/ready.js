const chalk = require("chalk");
module.exports = {
  name: "ready",
  once: true,
  run: async (client) => {
    const all = [];
    client.commands.array.forEach((c) => all.push(c));
    client.contexts.array.forEach((c) => all.push(c));
    const personalGuild = client.guilds.cache.get("1023607210149945436");
    await personalGuild.commands.set(all);
    //await this.application.commands.set(all);
    const port = 3000 || 3001 || 1232 || 6804;
    const status = [
      `${client.config.prefix}help || ${client.user.tag}`,
      `${client.guilds.cache.size} servers!`,
      `${client.channels.cache.size} channels!`,
      `${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} users!`,
    ];
    setInterval(() => {
      client.user.setActivity(
        status[Math.floor(Math.random() * status.length)],
        {
          type: "LISTENING",
        }
      );
    }, 2500);
    const express = require("express");
    const app = express();

    app.all("/", (req, res) => {
      res.send("Hello Worldd");
      res.end();
    });
    app.listen(port, () => {
      console.log(
        chalk.cyan("[INFORMATION]") +
          chalk.blue(` ${new Date().toLocaleDateString()} `) +
          chalk.cyan("Listening to ") +
          chalk.greenBright(`localhost/${port}`)
      );
    });

    // mongoose goes brrrr

    console.log(
      chalk.cyan("[INFORMATION]") +
        chalk.blue(` ${new Date().toLocaleDateString()} `) +
        chalk.cyan("Date now ") +
        chalk.greenBright(`${String(new Date()).split(" ", 5).join(" ")}`)
    );
    console.log(
      chalk.cyan("[INFORMATION]") +
        chalk.blue(` ${new Date().toLocaleDateString()} `) +
        chalk.cyan("Logged in as ") +
        chalk.greenBright(`${client.user.tag}`)
    );
    client.mongooseConnection();
  },
};
