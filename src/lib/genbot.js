import { WhatsappBot } from './builder/whatsapp.js';

export class GenBot extends WhatsappBot {
	constructor(connOpts, opts) {
		super(connOpts, opts);

		this.timestamp = Date.now()
		this.event = new Map()
		this.plugin = new Map()

		//this.conn = this || this.conn
	}
	
  logger() {
		return {
			info: (...args) => {
				return console.log(...args);
			}
		}
	}
}
