import { WhatsappBot } from "./whatsapp.js";

export class GenBot extends WhatsappBot {
  constructor(connectionOptions, options = {}) {
    super(connectionOptions, options);
    //console.log(this)
  }
}
