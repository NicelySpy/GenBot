let {
  makeWASocket,
  proto,
  jidDecode,
  areJidsSameUser
} = (await import("@whiskeysockets/baileys")).default

class Socket {
  constructor(options) {
    let conn = makeWASocket(options)
    for(let v in conn) { this[v] = conn[v] }

    if(this.user?.id) this.user.jid = this.decodeJid(this.user.id)
  }
  reply = this.sendMessage;
  decodeJid(jid) {
    if(!jid || typeof jid !== "string") return null;
    if(/:\d+@/gi.test(jid) {
      let { user, server } = jidDecode(jid) || {};
      return (
        (user && server && user + '@' + server) || jid
      ).trim();
    } else return jid.trim()
  }
  
}
