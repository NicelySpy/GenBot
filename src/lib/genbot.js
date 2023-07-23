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
          chalk.bold.bgRgb(51, 204, 51)(" INFO "),
          `[${chalk.rgb(255, 255, 255)(new Date().toUTCString())}]:`,
          chalk.cyan(format(...args))
        );
      },
      error(...args) {
        console.log(
          chalk.bold.bgRgb(247, 38, 33)(" ERROR "),
          `[${chalk.rgb(255, 255, 255)(new Date().toUTCString())}]:`,
          chalk.rgb(255, 38, 0)(format(...args))
        );
      },
      warn(...args) {
        console.log(
          chalk.bold.bgRgb(255, 153, 0)(" WARNING "),
          `[${chalk.rgb(255, 255, 255)(new Date().toUTCString())}]:`,
          chalk.redBright(format(...args))
        );
      },
      trace(...args) {
        console.log(
          chalk.grey(" TRACE "),
          `[${chalk.rgb(255, 255, 255)(new Date().toUTCString())}]:`,
          chalk.white(format(...args))
        );
      },
      debug(...args) {
        console.log(
          chalk.bold.bgRgb(66, 167, 245)(" DEBUG "),
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

        if('command' in cmd) {
          let { command } = cmd
          if('name' in command) {
            let { name } = command
            name = name.toString()
          }

          if('description' in command) {
            let { description } = command
            description = description.toString()
          }

          if('aliases' in command) {
            let { aliases } = command
            aliases = Array.isArray(aliases) ? aliases : [].push(aliases)
          }

          if('category' in command) {
            let { category } = command
            category = category.toString()
          }

          if('help' in command) {
            let { help } = command
            help = Array.isArray(help) ? help : [].push(help)
          }

          if('require' in command) {
            if('diamond' in command.require) {
              let { diamond } = command.require
              diamond = isNaN(Number(diamond)) ? 0 : Number(diamond)
            }

            if('level' in command.require) {
              let { level } = command.require
              level = isNaN(Number(level)) ? 0 : Number(level)
            }
          }
        }

        if('expEarning' in cmd) {
          let { expEarning } = cmd
          expEarning = isNaN(Number(expEarning)) ? 50 : Number(expEarning)
        } else cmd.expEarning = 50

        if('onlyIf' in cmd) {
          let { onlyIf } = cmd
          onlyIf = Array.isArray(onlyIf) ? onlyIf : [].push(onlyif)
        }

        if('disabled' in cmd) {
          let { disabled } = cmd
          disabled = (typeof disabled === 'boolean') ? disabled : true
        }

        if('run' in cmd) {
          let { run } = cmd
          run = (typeof run === 'function') ? run.bind(this) : (m) => m;
        }

        if('runAll' in cmd) {
          let { runAll } = cmd
          runAll = (typeof runAll === 'function') ? runAll.bind(this) : (m) => m;
        }

        if('runBefore' in cmd) {
          let { runBefore } = cmd
          runBefore = (typeof runBefore === 'function') ? runBefore.bind(this) : (m) => m;
        }

        if('runAfter' in cmd) {
          let { runAfter } = cmd
          runAfter = (typeof runAfter === 'function') ? runAfter.bind(this) : (m) => m;
        }

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
