import { WhatsappBot } from './builder/whatsapp.js';
import { glob } from 'glob';
import path from 'path';
import { createRequire } from 'module';
import fs from 'fs'

export class GenBot extends WhatsappBot {
	constructor(connOpts, opts) {
		super(connOpts, opts);

		this.timestamp = Date.now()
		this.event = new Map()
		this.plugin = new Map()
    this.require = createRequire(import.meta.url)
		//this.conn = this || this.conn
	}
  async logger(...args) {
		return {
			info: console.log(...args),
			warn: console.warn(...args)
		}
	}
  async deleteCachedFile(file) { 
    const filePath = path.resolve(file); 
    if (this.require.cache[filePath]) delete this.require.cache[filePath]; 
  } 
  async loadFiles(dirPath) { 
    try { 
      const jsF = ( 
        await glob(path.join(process.cwd(), dirPath).replace(/\\/g, "/")) 
      ).filter((file) => path.extname(file) === ".js"); 
      await Promise.all(jsF.map(this.deleteCachedFile)); 
      return jsF; 
    } catch (error) { 
      console.error(`${dirPath}: ${error}`); 
      throw error; 
    }
  }
  async loadEvent() {
    await this.event.clear();
    for(let f of (await this.loadFiles('../Events/*.js')) {
      let e = await import(f);
      let ev = e.default || e;
      let event = ev.binder : ev.run.bind(this, binder) ? ev.run.bind(this);
      this.event.set(ev.name, ev)
    }
  }
  async loadPlugin() {
    await this.plugin.clear()
    for(let f of (await this.loadFiles('../Plugins/**/*.js')) {
      let c = await import(f);
      let cmd = c.default|| c;
      cmd.name = cmd.name + ('.js') || f;
      this.plugin.set(cmd.name, cmd)
    }
  }
  async quickTest() {
    
  }
}
