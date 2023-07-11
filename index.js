import { WhatsappBot as Client } from "./src/lib/whatsapp.js";
const { useMultiFileAuthState } = await import("@adiwajshing/baileys");

let authFile = `src/sessions`;
const { state, saveState, saveCreds } = await useMultiFileAuthState(authFile);

let conn = new Client({
  printQRInTerminal: true,
  auth: state,
});

console.log(conn);
