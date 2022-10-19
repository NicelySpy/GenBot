const {
  ApplicationCommandType,
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
} = require("discord.js");
const globPromise = require("util").promisify(require("glob").glob);
const config = require("@root/config.json");
const { AsciiTable3: ascii } = require("ascii-table3");
const mongoose = require("mongoose");
const chalk = require("chalk");

class Spider extends Client {
  constructor() {
    super({
      intents: [
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
      ],
      partials: [
        Partials.User,
        Partials.Channel,
        Partials.Message,
        Partials.GuildMember,
        Partials.Reaction,
        Partials.GuildScheduledEvent,
        Partials.ThreadMember,
      ],
      allowedMentions: {
        repliedUser: false,
      },
    });
    this.commands = {
      collection: new Collection(),
      array: [],
    };
    this.contexts = {
      collection: new Collection(),
      array: [],
    };
    this.events = new Collection();

    this.config = config;
    this.token = config.token;
    this.owners = config.owners;
    this.mongoURI = config.mongooseConnectionString;
    this.utils = new (require("@function/util.js"))();
    this.wait = require("node:util").promisify(setTimeout);
    this.loadEvents();
    this.loadCommands();
    this.loadContexts();
    this.antiCrash();
  }

  async loadFiles(dir) {
    const files = await globPromise(`${process.cwd()}/${dir}/**/*.js`);
    files.forEach((f) => delete require.cache[require.resolve(f)]);
    return files;
  }

  async loadEvents() {
    const table = new ascii("Events Status")
      .setHeading("Events", "Status", "Description")
      .setStyle("unicode-single");
    await this.events.clear();
    (await this.loadFiles("src/Events")).forEach((f) => {
      const ev = require(f);
      const client = this;
      const run = (...args) => ev.run(...args, client);

      if (!ev.name) {
        const splitted = f.split("/");
        const directory = splitted[splitted.length - 1];
        return table.addRow(directory, "❌", "Missing a name");
      } else if (!ev.run)
        return table.addRow(`${ev.name}`, "❌", "Missing a run");
      else table.addRow(`${ev.name}`, "✅️", " ");

      if (ev.rest) {
        if (ev.once) this.rest.once(ev.name, run);
        else this.rest.on(ev.name, run);
      } else {
        if (ev.once) this.once(ev.name, run);
        else this.on(ev.name, run);
      }
    });
    return console.log(table.toString());
  }
  async loadCommands() {
    const table = new ascii("Commands Status")
      .setHeading("Commands", "Status", "Description")
      .setStyle("unicode-single");
    await this.commands.collection.clear();
    (await this.loadFiles("src/Commands/Slash")).forEach((f) => {
      const command = require(f);
      if (!command.name) {
        const splitted = f.split("/");
        const directory = splitted[splitted.length - 1];
        return table.addRow(directory, "❌", "Missing a name");
      } else if (!command.description)
        return (command.description = "No description");
      else if (!command.run)
        return table.addRow(directory, "❌", "Missing a run");
      else table.addRow(`${command.name}`, "✅️", " ");

      this.commands.collection.set(command.name, command);
      this.commands.array.push(command);
    });
    return console.log(table.toString());
  }
  async loadContexts() {
    const table = new ascii("Context Status")
      .setHeading("Context", "Status", "Description")
      .setStyle("unicode-single");
    await this.contexts.collection.clear();
    (await this.loadFiles("src/Commands/Context")).forEach((f) => {
      const types = {
        msg: ApplicationCommandType.Message,
        user: ApplicationCommandType.User,
      };
      const anotherTypes = {
        3: "Message",
        2: "User",
      };
      const ctx = require(f);
      if (!ctx.name) {
        const splitted = f.split("/");
        const directory = splitted[splitted.length - 1];
        return table.addRow(directory, "❌", "Missing a name");
      } else if (!ctx.run)
        return table.addRow(directory, "❌", "Missing a run");
      else
        table.addRow(`${ctx.name}`, "✅️", `${anotherTypes[types[ctx.type]]}`);
      ctx.type
        ? (ctx.type = types[ctx.type || "msg"])
        : (ctx.type = ApplicationCommandType.Message);
      this.contexts.collection.set(ctx.name, ctx);
      this.contexts.array.push(ctx);
    });
    return console.log(table.toString());
  }
  antiCrash() {
    process.on("unhandledRejection", (reason, p) => {
      console.log(" [antiCrash] :: Unhandled Rejection/Catch");
      console.log(reason, p);
    });
    process.on("uncaughtException", (err, origin) => {
      console.log(" [antiCrash] :: Uncaught Exception/Catch");
      console.log(err, origin);
    });
    process.on("uncaughtExceptionMonitor", (err, origin) => {
      console.log(" [antiCrash] :: Uncaught Exception/Catch (MONITOR)");
      console.log(err, origin);
    });
    process.on("multipleResolves", (type, promise, reason) => {
      console.log(" [antiCrash] :: Multiple Resolves");
      console.log(type, promise, reason);
    });
  }
  mongooseConnection() {
    if (!this.mongoURI) return;
    mongoose.connect(this.mongoURI, {});
    mongoose.connection.on("connected", () =>
      console.log(
        chalk.cyan("[INFORMATION]") +
          chalk.blue(` ${new Date().toLocaleDateString()} `) +
          chalk.cyan("MongoDB Connection ") +
          chalk.greenBright("Connected!")
      )
    );
    mongoose.connection.on("disconnected", () =>
      console.log(
        chalk.cyan("[INFORMATION]") +
          chalk.blue(` ${new Date().toLocaleDateString()} `) +
          chalk.cyan("MongoDB Connection ") +
          chalk.greenBright("Disconnected")
      )
    );
    mongoose.connection.on("error", (error) =>
      console.log(
        chalk.cyan("[INFORMATION]") +
          chalk.blue(` ${new Date().toLocaleDateString()} `) +
          chalk.cyan("MongoDB Connection ") +
          chalk.redBright("Error") +
          "\n" +
          chalk.white(`${error}`)
      )
    );
  }
}
module.exports = { Spider };
