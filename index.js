import {
  GenBot,
  useMultiFileAuthState,
  serialize,
  protoType,
  smsg,
} from "./src/lib/myfunction.js";
import pino from "pino";
serialize();
protoType();

let authFile = `src/sessions`;
const { state, saveState, saveCreds } = await useMultiFileAuthState(authFile);

let conn = new GenBot({
  printQRInTerminal: true,
  auth: state,
  logger: pino({ level: "silent" }),
});
conn.saveCreds = saveCreds;
conn.smsg = smsg;
//export { conn };

/*conn.ev.on("messages.upsert", chatUpdate => {
	    if (!chatUpdate) 
         return;
     conn.pushMessage(chatUpdate.messages).catch(console.error) 
     let m = chatUpdate.messages[chatUpdate.messages.length - 1]
	try {
		m = smsg(conn, m) || m;
		if(m.text == 'p') m.reply('apaaaa')
	} catch {
		console.error()
	}
});*/
conn.loadPlugin().then(() => {
  console.log(conn.plugin);
});
conn.loadEvent().then(() => {
  console.log(conn.event);
  for (let name in conn.event) {
    let v = conn.event[name]?.bind(conn);
    console.log(v);
    conn.ev.on(name, v);
  }
});
export { conn };
//conn.event.forEach(ev => console.log(ev))
//console.log(conn.event);
conn.ev.on("creds.update", saveCreds.bind(conn, true));
conn.ev.on("connection.update", (update) => {
  const { connection, lastDisconnect, isNewLogin } = update;
  if (isNewLogin) conn.isInit = true;
});

//conn.loadEvent()
