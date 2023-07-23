import { WhatsappBot } from "./builder/whatsapp.js";
import { glob } from "glob";
import path from "path";
import { createRequire } from "module";
import fs from "fs";
import { format } from "util";
import chalk from "chalk";

export class GenBot extends WhatsappBot {
  constructor(connOpts, opts) {
    super(connOpts, opts);

    this.timestamp = Date.now();
    this.event = {};
    this.plugin = {};
    this.require = createRequire(import.meta.url);
    //this.conn = this || this.conn
    //this.loadEvent()
  }
  get logger() {
    return {
      info(...args) {
        console.log(
          chalk.bold.bgRgb(51, 204, 51)("INFO "),
          `[${chalk.rgb(255, 255, 255)(new Date().toUTCString())}]:`,
          chalk.cyan(format(...args))
        );
      },
      error(...args) {
        console.log(
          chalk.bold.bgRgb(247, 38, 33)("ERROR "),
          `[${chalk.rgb(255, 255, 255)(new Date().toUTCString())}]:`,
          chalk.rgb(255, 38, 0)(format(...args))
        );
      },
      warn(...args) {
        console.log(
          chalk.bold.bgRgb(255, 153, 0)("WARNING "),
          `[${chalk.rgb(255, 255, 255)(new Date().toUTCString())}]:`,
          chalk.redBright(format(...args))
        );
      },
      trace(...args) {
        console.log(
          chalk.grey("TRACE "),
          `[${chalk.rgb(255, 255, 255)(new Date().toUTCString())}]:`,
          chalk.white(format(...args))
        );
      },
      debug(...args) {
        console.log(
          chalk.bold.bgRgb(66, 167, 245)("DEBUG "),
          `[${chalk.rgb(255, 255, 255)(new Date().toUTCString())}]:`,
          chalk.white(format(...args))
        );
      },
    };
  }
  async loadEvent() {
    //this.event.clear();
    for (let f of fs.readdirSync(`src/Events`)) {
      //console.log(f)
      let file = await import(`../Events/${f}`);
      let cmd = file.default || file;
      cmd.name = cmd.name || `${f.split(".")[0]}.${f.split(".")[1]}`;

      //console.log(f, file, cmd)
      //this.event.set([cmd.name, cmd])
      //cmd.run = cmd.run.bind(this);
      this.event[cmd.name] = cmd.run;
    }
  }

  async loadPlugin() {
    for (let dir of fs.readdirSync("src/Plugins")) {
      for (let f of fs
        .readdirSync(`src/Plugins/${dir}`)
        .filter((c) => c.endsWith(".js"))) {
        let file = await import(`../Plugins/${dir}/${f}`);
        let cmd = file.default || file;

        if (!cmd.command) cmd.command = {};
        cmd.command.name = cmd.command.name || f.split(".")[0];
        cmd.command.description = cmd.command.description || "";
        cmd.command.aliases = Array.isArray(cmd.command.aliases)
          ? cmd.command.aliases
          : [cmd.command.aliases || cmd.command.name];
        cmd.command.category =
          (cmd.command.category || dir).toLowerCase() || dir.toLowerCase();
        cmd.command.help = cmd.command.help || cmd.command.name;

        if (!cmd.command.require) cmd.command.require = {};
        cmd.command.require.diamond = isNaN(cmd.command.require.diamond)
          ? 0
          : Number(cmd.command.require.diamond);
        cmd.command.require.level = isNaN(cmd.command.require.level)
          ? 0
          : Number(cmd.command.require.level);
        cmd.onlyIf = cmd.onlyIf || {};
        cmd.expEarning = isNaN(cmd.expEarning) ? 50 : Number(cmd.expEarning);
        cmd.disabled = typeof cmd.disabled == "boolean" ? cmd.disabled : false;

        cmd.run = typeof cmd.run == "function" ? cmd.run : ({ m }) => m;
        cmd.runBefore =
          typeof cmd.runBefore == "function" ? cmd.runBefore : ({ m }) => m;
        cmd.runAfter =
          typeof cmd.runAfter == "function" ? cmd.runAfter : ({ m }) => m;
        cmd.runAll =
          typeof cmd.runAll == "function" ? cmd.runAll : ({ m }) => m;

        cmd._file = {
          dir,
          file: f,
        };
        this.plugin[cmd.command.name] = cmd;
      }
    }
  }
  async quickTest() {}
  async start() {
    this.loadEvent();
    this.loadPlugin();
    this.loadDatabase();
    this.quickTest();
  }
}
