//import { GenBot as Client } from "./src/lib/genbot.js";
import { GenBot } from './src/lib/genbot.js'
import { useMultiFileAuthState } from 'baileys';

let authFile = `src/sessions`;
const { state, saveState, saveCreds } = await useMultiFileAuthState(authFile);

let conn = new GenBot({
  printQRInTerminal: true,
  auth: state,
});

conn.conn.ev.on('connection.update', update => {
  const { connection, lastDisconnect, isNewLogin } = update;  
  if (isNewLogin) conn.isInit = true;  
});
console.log(conn)
//conn.logger().info('p bang')
/*conn.logger().warn('ppp')
conn.logger().error('hola')
conn.logger().trace('hoh')
conn.logger().debug('p')*/