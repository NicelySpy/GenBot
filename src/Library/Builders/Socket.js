import fs from 'fs'
import path from "path";
import { fileTypeFromBuffer } from 'file-type'
import { fileURLToPath } from "url";
import fetch from 'node-fetch'
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
  async getFile(PATH, saveToFile = false) {
    let res, filename;
    const data = Buffer.isBuffer(PATH)
      ? PATH
      : PATH instanceof ArrayBuffer
      ? PATH.toBuffer()
      : /^data:.*?\/.*?;base64,/i.test(PATH)
      ? Buffer.from(PATH.split`,`[1], "base64")
      : /^https?:\/\//.test(PATH)
      ? await (res = await fetch(PATH)).buffer()
      : fs.existsSync(PATH)
      ? ((filename = PATH), fs.readFileSync(PATH))
      : typeof PATH === "string"
      ? PATH
      : Buffer.alloc(0);
    if (!Buffer.isBuffer(data)) throw new TypeError("Result is not a buffer");
    const type = (await fileTypeFromBuffer(data)) || {
      mime: "application/octet-stream",
      ext: ".bin",
    };
    if (data && saveToFile && !filename)
      (filename = path.join(
        __dirname,
        "../tmp/" + new Date() * 1 + "." + type.ext
      )),
        await fs.promises.writeFile(filename, data);
    return {
      res,
      filename,
      ...type,
      data,
      deleteFile() {
        return filename && fs.promises.unlink(filename);
      },
    };
  }
  async sendFile(
    jid,
    path,
    filename = "",
    caption = "",
    quoted,
    ptt = false,
    options = {}
  ) {
    let type = await this.getFile(path, true);
    let { res, data: file, filename: pathFile } = type;
    if ((res && res.status !== 200) || file.length <= 65536) {
      try {
        throw { json: JSON.parse(file.toString()) };
      } catch (e) {
        if (e.json) throw e.json;
      }
    }
    const fileSize = fs.statSync(pathFile).size / 1024 / 1024;
    if (fileSize >= 1800)
      throw new Error("File size has reach the maximum!\n\n");
    let opt = {};
    if (quoted) opt.quoted = quoted;
    if (!type) options.asDocument = true;
    let mtype = "",
      mimetype = options.mimetype || type.mime,
      convert;
    if (
      /webp/.test(type.mime) ||
      (/image/.test(type.mime) && options.asSticker)
    )
      mtype = "sticker";
    else if (
      /image/.test(type.mime) ||
      (/webp/.test(type.mime) && options.asImage)
    )
      mtype = "image";
    else if (/video/.test(type.mime)) mtype = "video";
    else if (/audio/.test(type.mime))
      (convert = await toAudio(file, type.ext)),
        (file = convert.data),
        (pathFile = convert.filename),
        (mtype = "audio"),
        (mimetype = options.mimetype || "audio/ogg; codecs=opus");
    else mtype = "document";
    if (options.asDocument) mtype = "document";

    delete options.asSticker;
    delete options.asLocation;
    delete options.asVideo;
    delete options.asDocument;
    delete options.asImage;

    let message = {
      ...options,
      caption,
      ptt,
      [mtype]: { url: pathFile },
      mimetype,
      fileName: filename || pathFile.split("/").pop(),
    };

    let m;
    try {
      m = await this.sendMessage(jid, message, { ...opt, ...options });
    } catch (e) {
      console.error(e);
      m = null;
    } finally {
      if (!m)
        m = await this.sendMessage(
          jid,
          { ...message, [mtype]: file },
          { ...opt, ...options }
        );
      file = null; // releasing the memory
      return m;
    }
  }
  reply(jid, text = "", quoted, options) {
    return Buffer.isBuffer(text)
      ? this.sendFile(jid, text, "file", "", quoted, false, options) 
      : this.sendMessage(jid, { ...options, text }, { quoted, ...options });
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
  
