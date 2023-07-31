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
  
  decodeJid(jid) {
    if(!jid || typeof jid !== "string") return null;
    if(/:\d+@/gi.test(jid) {
      let { user, server } = jidDecode(jid) || {};
      return (
        (user && server && user + '@' + server) || jid
      ).trim();
    } else return jid.trim()
  }
  reply(jid, text = "", quoted, options) {
    //return Buffer.isBuffer(text)
      //? this.sendFile(jid, text, "file", "", quoted, false, options) :
      return this.sendMessage(jid, { ...options, text }, { quoted, ...options });
  }
  fakeReply(
    jid,
    text = "",
    fakeJid = this.user.jid,
    fakeText = "",
    fakeGroupJid,
    options
  ) {
    return this.reply(jid, text, {
      key: {
        fromMe: areJidsSameUser(fakeJid, this.user.id),
        participant: fakeJid,
        ...(fakeGroupJid ? { remoteJid: fakeGroupJid } : {}),
      },
      message: { conversation: fakeText },
      ...options,
    });
}
