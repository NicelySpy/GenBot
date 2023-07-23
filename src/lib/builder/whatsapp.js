import fs from "fs";
import path from "path";
import yargs from "yargs";
import fetch from "node-fetch";
import PhoneNumber from "awesome-phonenumber";
import { fileTypeFromBuffer } from "file-type";
import util, { format } from "util";
import { fileURLToPath } from "url";
import {
  logic,
  protoType,
  isNumber,
  getRandom,
  nullish,
  smsg,
} from "../myfunction.js";
import { bind } from "./store.js";

const {
  default: _makeWaSocket,
  makeWALegacySocket,
  proto,
  downloadContentFromMessage,
  jidDecode,
  areJidsSameUser,
  generateForwardMessageContent,
  generateWAMessageFromContent,
  WAMessageStubType,
  extractMessageContent,
} = (await import("baileys")).default;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class WhatsappBot {
  constructor(connOpts = {}, opts = {}) {
    let conn = _makeWaSocket(connOpts);
    this.connOpts = opts;
    this.type = conn.type;
    this.ws = conn.ws;
    this.ev = conn.ev;
    this.authState = conn.authState;
    this.signalRepository = conn.signalRepository;
    this.user = conn.user;
    this.generateMessageTag = conn.generateMessageTag;
    this.query = conn.query;
    this.waitForMessage = conn.waitForMessage;
    this.waitForSocketOpen = conn.waitForSocketOpen;
    this.sendRawMessage = conn.sendRawMessage;
    this.sendNode = conn.sendNode;
    this.logout = conn.logout;
    this.end = conn.end;
    this.onUnexpectedError = conn.onUnexpectedError;
    this.uploadPreKeys = conn.uploadPreKeys;
    this.uploadPreKeysToServerIfRequired = conn.uploadPreKeysToServerIfRequired;
    this.waitForConnectionUpdate = conn.waitForConnectionUpdate;
    this.processingMutex = conn.processingMutex;
    this.upsertMessage = conn.upsertMessage;
    this.appPatch = conn.appPatch;
    this.sendPresenceUpdate = conn.sendPresenceUpdate;
    this.presenceSubscribe = conn.presenceSubscribe;
    this.onWhatsApp = conn.onWhatsApp;
    this.resyncAppState = conn.resyncAppState;
    this.chatModify = conn.chatModify;
    this.assertSessions = conn.assertSessions;
    this.relayMessage = conn.relayMessage;
    this.sendReceipt = conn.sendReceipt;
    this.sendReceipts = conn.sendReceipts;
    this.readMessages = conn.readMessages;
    this.refreshMediaConn = conn.refreshMediaConn;
    this.waUploadToServer = conn.waUploadToServer;
    this.updateMediaMessage = conn.updateMediaMessage;
    this.sendMessage = conn.sendMessage;
    this.sendMessageAck = conn.sendMessageAck;
    this.sendRetryRequest = conn.sendRetryRequest;
    this.rejectCall = conn.rejectCall;

    this.profile = {
      updatePicture: conn.updateProfilePicture,
      removePicture: conn.removeProfilePicture,
      updateStatus: conn.updateProfileStatus,
      updateName: conn.updateProfileName,
      pictureUrl: conn.profilePictureUrl,
      privacy: {
        fetch: conn.fetchPrivacySettings,
        getToken: conn.getPrivacyTokens,
        update: {
          lastSeen: conn.updateLastSeenPrivacy,
          online: conn.updateLastSeenPrivacy,
          profilePicture: conn.updateProfilePicturePrivacy,
          readReceipt: conn.updateReadReceiptPrivacy,
          groupsAdd: conn.updateGroupsAddPrivacy,
        },
      },
    };
    this.group = {
      metadata: conn.groupMetadata,
      create: conn.groupCreate,
      leave: conn.groupLeave,
      participantsUpdate: conn.groupParticipantsUpdate,
      settingUpdate: conn.groupSettingUpdate,
      fetch: {
        allParticipating: conn.groupFetchAllParticipating,
      },
      toggle: {
        ephemeral: conn.groupToggleEphemeral,
        membershipApprovalMode: conn.groupToggleMembershipApprovalMode,
      },
      invite: {
        getCode: conn.groupInviteCode,
        revoke: conn.groupRevokeInvite,
        accept: conn.groupAcceptInvite,
        acceptV4: conn.groupAcceptInviteV4,
        getInfo: conn.groupGetInviteInfo,
      },
      update: {
        subject: conn.groupUpdateSubject,
        description: conn.groupUpdateDescription,
      },
    };
    this.fetch = {
      blocklist: conn.fetchBlocklist,
      status: conn.fetchStatus,
    };
    this.update = {
      blockStatus: conn.updateBlockStatus,
      defaultDisappearingMode: conn.updateDefaultDisappearingMode,
    };
    this.business = {
      get: {
        profile: conn.getBusinessProfile,
        orderDetails: conn.getOrderDetails,
        catalog: conn.getCatalog,
        collections: conn.getCollections,
      },
      product: {
        create: conn.productCreate,
        delete: conn.productDelete,
        update: conn.productUpdate,
      },
    };

    this.opts = new Object(
      yargs(process.argv.slice(2)).exitProcess(false).parse()
    );
    this.chats = { ...(this.connOpts.chats || {}) };

    bind(this);
  }
  async decodeJid(jid) {
    if (!jid || typeof jid !== "string") return (!nullish(jid) && jid) || null;
    return jid.decodeJid();
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

  async sendContact(jid, data, quoted, options) {
    if (!Array.isArray(data[0]) && typeof data[0] === "string") data = [data];
    let contacts = [];
    for (let [number, name] of data) {
      number = number.replace(/[^0-9]/g, "");
      let njid = number + "@s.whatsapp.net";
      let biz =
        (await this.business.get.profile(njid).catch((_) => null)) || {};
      let vcard = `  
  BEGIN:VCARD  
  VERSION:3.0  
  N:;${name.replace(/\n/g, "\\n")};;;  
  FN:${name.replace(/\n/g, "\\n")}  
  TEL;type=CELL;type=VOICE;waid=${number}:${PhoneNumber("+" + number).getNumber(
        "international"
      )}${
        biz.description
          ? `  
  X-WA-BIZ-NAME:${(
    this.chats[njid]?.vname ||
    this.getName(njid) ||
    name
  ).replace(/\n/, "\\n")}  
  X-WA-BIZ-DESCRIPTION:${biz.description.replace(/\n/g, "\\n")}  
  `.trim()
          : ""
      }  
  END:VCARD  
          `.trim();
      contacts.push({ vcard, displayName: name });
    }
    return await this.sendMessage(
      jid,
      {
        ...options,
        contacts: {
          ...options,
          displayName:
            (contacts.length >= 2
              ? `${contacts.length} kontak`
              : contacts[0].displayName) || null,
          contacts,
        },
      },
      { quoted, ...options }
    );
  }
  async reply(jid, text = "", quoted, options) {
    return Buffer.isBuffer(text)
      ? this.sendFile(jid, text, "file", "", quoted, false, options)
      : this.sendMessage(jid, { ...options, text }, { quoted, ...options });
  }

  async updateProfileStatus(status) {
    return this.query({
      tag: "iq",
      attrs: {
        to: "s.whatsapp.net",
        type: "set",
        xmlns: "status",
      },
      content: [
        {
          tag: "status",
          attrs: {},
          content: Buffer.from(status, "utf-8"),
        },
      ],
    });
  }
  async sendPayment(jid, amount, currency, text = "", from, options) {
    const requestPaymentMessage = {
      amount: {
        currencyCode: currency || "USD",
        offset: 0,
        value: amount || 9.99,
      },
      expiryTimestamp: 0,
      amount1000: (amount || 9.99) * 1000,
      currencyCodeIso4217: currency || "USD",
      requestFrom: from || "0@s.whatsapp.net",
      noteMessage: {
        extendedTextMessage: {
          text: text || "Example Payment Message",
        },
      },
      //background: !!image ? file : undefined
    };
    return this.relayMessage(jid, { requestPaymentMessage }, { ...options });
  }

  async sendPoll(jid, name = "", optiPoll, options) {
    if (!Array.isArray(optiPoll[0]) && typeof optiPoll[0] === "string")
      optiPoll = [optiPoll];
    if (!options) options = {};
    const pollMessage = {
      name: name,
      options: optiPoll.map((btn) => ({
        optionName: (!nullish(btn[0]) && btn[0]) || "",
      })),
      selectableOptionsCount: 1,
    };
    return this.relayMessage(
      jid,
      { pollCreationMessage: pollMessage },
      { ...options }
    );
  }

  async sendHydrated(
    jid,
    text = "",
    footer = "",
    buffer,
    url,
    urlText,
    call,
    callText,
    buttons,
    quoted,
    options
  ) {
    let type;
    if (buffer)
      try {
        (type = await this.getFile(buffer)), (buffer = type.data);
      } catch {
        buffer = buffer;
      }
    if (
      buffer &&
      !Buffer.isBuffer(buffer) &&
      (typeof buffer === "string" || Array.isArray(buffer))
    )
      (options = quoted),
        (quoted = buttons),
        (buttons = callText),
        (callText = call),
        (call = urlText),
        (urlText = url),
        (url = buffer),
        (buffer = null);
    if (!options) options = {};
    let templateButtons = [];
    if (url || urlText) {
      if (!Array.isArray(url)) url = [url];
      if (!Array.isArray(urlText)) urlText = [urlText];
      templateButtons.push(
        ...(url
          .map((v, i) => [v, urlText[i]])
          .map(([url, urlText], i) => ({
            index: templateButtons.length + i + 1,
            urlButton: {
              displayText:
                (!nullish(urlText) && urlText) || (!nullish(url) && url) || "",
              url:
                (!nullish(url) && url) || (!nullish(urlText) && urlText) || "",
            },
          })) || [])
      );
    }
    if (call || callText) {
      if (!Array.isArray(call)) call = [call];
      if (!Array.isArray(callText)) callText = [callText];
      templateButtons.push(
        ...(call
          .map((v, i) => [v, callText[i]])
          .map(([call, callText], i) => ({
            index: templateButtons.length + i + 1,
            callButton: {
              displayText:
                (!nullish(callText) && callText) ||
                (!nullish(call) && call) ||
                "",
              phoneNumber:
                (!nullish(call) && call) ||
                (!nullish(callText) && callText) ||
                "",
            },
          })) || [])
      );
    }
    if (buttons.length) {
      if (!Array.isArray(buttons[0])) buttons = [buttons];
      templateButtons.push(
        ...(buttons.map(([text, id], index) => ({
          index: templateButtons.length + index + 1,
          quickReplyButton: {
            displayText: (!nullish(text) && text) || (!nullish(id) && id) || "",
            id: (!nullish(id) && id) || (!nullish(text) && text) || "",
          },
        })) || [])
      );
    }
    let message = {
      ...options,
      [buffer ? "caption" : "text"]: text || "",
      footer,
      templateButtons,
      ...(buffer
        ? options.asLocation && /image/.test(type.mime)
          ? {
              location: {
                ...options,
                jpegThumbnail: buffer,
              },
            }
          : {
              [/video/.test(type.mime)
                ? "video"
                : /image/.test(type.mime)
                ? "image"
                : "document"]: buffer,
            }
        : {}),
    };
    return await this.sendMessage(jid, message, {
      quoted,
      upload: this.waUploadToServer,
      ...options,
    });
  }

  async sendHydrated2(
    jid,
    text = "",
    footer = "",
    buffer,
    url,
    urlText,
    url2,
    urlText2,
    buttons,
    quoted,
    options
  ) {
    let type;
    if (buffer)
      try {
        (type = await this.getFile(buffer)), (buffer = type.data);
      } catch {
        buffer = buffer;
      }
    if (
      buffer &&
      !Buffer.isBuffer(buffer) &&
      (typeof buffer === "string" || Array.isArray(buffer))
    )
      (options = quoted),
        (quoted = buttons),
        (buttons = callText),
        (callText = call),
        (call = urlText),
        (urlText = url),
        (url = buffer),
        (buffer = null);
    if (!options) options = {};
    let templateButtons = [];
    if (url || urlText) {
      if (!Array.isArray(url)) url = [url];
      if (!Array.isArray(urlText)) urlText = [urlText];
      templateButtons.push(
        ...(url
          .map((v, i) => [v, urlText[i]])
          .map(([url, urlText], i) => ({
            index: templateButtons.length + i + 1,
            urlButton: {
              displayText:
                (!nullish(urlText) && urlText) || (!nullish(url) && url) || "",
              url:
                (!nullish(url) && url) || (!nullish(urlText) && urlText) || "",
            },
          })) || [])
      );
    }
    if (url2 || urlText2) {
      if (!Array.isArray(url2)) url2 = [url2];
      if (!Array.isArray(urlText2)) urlText2 = [urlText2];
      templateButtons.push(
        ...(url2
          .map((v, i) => [v, urlText2[i]])
          .map(([url2, urlText2], i) => ({
            index: templateButtons.length + i + 1,
            urlButton: {
              displayText:
                (!nullish(urlText2) && urlText2) ||
                (!nullish(url2) && url2) ||
                "",
              url:
                (!nullish(url2) && url2) ||
                (!nullish(urlText2) && urlText2) ||
                "",
            },
          })) || [])
      );
    }
    if (buttons.length) {
      if (!Array.isArray(buttons[0])) buttons = [buttons];
      templateButtons.push(
        ...(buttons.map(([text, id], index) => ({
          index: templateButtons.length + index + 1,
          quickReplyButton: {
            displayText: (!nullish(text) && text) || (!nullish(id) && id) || "",
            id: (!nullish(id) && id) || (!nullish(text) && text) || "",
          },
        })) || [])
      );
    }
    let message = {
      ...options,
      [buffer ? "caption" : "text"]: text || "",
      footer,
      templateButtons,
      ...(buffer
        ? options.asLocation && /image/.test(type.mime)
          ? {
              location: {
                ...options,
                jpegThumbnail: buffer,
              },
            }
          : {
              [/video/.test(type.mime)
                ? "video"
                : /image/.test(type.mime)
                ? "image"
                : "document"]: buffer,
            }
        : {}),
    };
    return await this.sendMessage(jid, message, {
      quoted,
      upload: this.waUploadToServer,
      ...options,
    });
  }

  async cMod(jid, message, text = "", sender = this.user.jid, options = {}) {
    if (options.mentions && !Array.isArray(options.mentions))
      options.mentions = [options.mentions];
    let copy = message.toJSON();
    delete copy.message.messageContextInfo;
    delete copy.message.senderKeyDistributionMessage;
    let mtype = Object.keys(copy.message)[0];
    let msg = copy.message;
    let content = msg[mtype];
    if (typeof content === "string") msg[mtype] = text || content;
    else if (content.caption) content.caption = text || content.caption;
    else if (content.text) content.text = text || content.text;
    if (typeof content !== "string") {
      msg[mtype] = { ...content, ...options };
      msg[mtype].contextInfo = {
        ...(content.contextInfo || {}),
        mentionedJid:
          options.mentions || content.contextInfo?.mentionedJid || [],
      };
    }
    if (copy.participant)
      sender = copy.participant = sender || copy.participant;
    else if (copy.key.participant)
      sender = copy.key.participant = sender || copy.key.participant;
    if (copy.key.remoteJid.includes("@s.whatsapp.net"))
      sender = sender || copy.key.remoteJid;
    else if (copy.key.remoteJid.includes("@broadcast"))
      sender = sender || copy.key.remoteJid;
    copy.key.remoteJid = jid;
    copy.key.fromMe = areJidsSameUser(sender, this.user.id) || false;
    return proto.WebMessageInfo.fromObject(copy);
  }

  async copyNforward(jid, message, forwardingScore = true, options = {}) {
    let vtype;
    if (options.readViewOnce && message.message.viewOnceMessage?.message) {
      vtype = Object.keys(message.message.viewOnceMessage.message)[0];
      delete message.message.viewOnceMessage.message[vtype].viewOnce;
      message.message = proto.Message.fromObject(
        JSON.parse(JSON.stringify(message.message.viewOnceMessage.message))
      );
      message.message[vtype].contextInfo =
        message.message.viewOnceMessage.contextInfo;
    }
    let mtype = Object.keys(message.message)[0];
    let m = generateForwardMessageContent(message, !!forwardingScore);
    let ctype = Object.keys(m)[0];
    if (
      forwardingScore &&
      typeof forwardingScore === "number" &&
      forwardingScore > 1
    )
      m[ctype].contextInfo.forwardingScore += forwardingScore;
    m[ctype].contextInfo = {
      ...(message.message[mtype].contextInfo || {}),
      ...(m[ctype].contextInfo || {}),
    };
    m = generateWAMessageFromContent(jid, m, {
      ...options,
      userJid: this.user.jid,
    });
    await this.relayMessage(jid, m.message, {
      messageId: m.key.id,
      additionalAttributes: { ...options },
    });
    return m;
  }

  async fakeReply(
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

  async downloadM(m, type, saveToFile) {
    let filename;
    if (!m || !(m.url || m.directPath)) return Buffer.alloc(0);
    const stream = await downloadContentFromMessage(m, type);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }
    if (saveToFile) ({ filename } = await this.getFile(buffer, true));
    return saveToFile && fs.existsSync(filename) ? filename : buffer;
  }

  async parseMention(text = "") {
    return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(
      (v) => v[1] + "@s.whatsapp.net"
    );
  }

  async getName(jid = "", withoutContact = false) {
    jid = this.decodeJid(jid);
    withoutContact = this.withoutContact || withoutContact;
    let v;
    if (jid.endsWith("@g.us"))
      return new Promise(async (resolve) => {
        v = this.chats[jid] || {};
        if (!(v.name || v.subject)) v = (await this.group.metadata(jid)) || {};
        resolve(
          v.name ||
            v.subject ||
            PhoneNumber("+" + jid.replace("@s.whatsapp.net", "")).getNumber(
              "international"
            )
        );
      });
    else
      v =
        jid === "0@s.whatsapp.net"
          ? {
              jid,
              vname: "WhatsApp",
            }
          : areJidsSameUser(jid, this.user.id)
          ? this.user
          : this.chats[jid] || {};
    return (
      (withoutContact ? "" : v.name) ||
      v.subject ||
      v.vname ||
      v.notify ||
      v.verifiedName ||
      PhoneNumber("+" + jid.replace("@s.whatsapp.net", "")).getNumber(
        "international"
      )
    );
  }

  async loadMessage(messageID) {
    return Object.entries(this.chats)
      .filter(([_, { messages }]) => typeof messages === "object")
      .find(([_, { messages }]) =>
        Object.entries(messages).find(
          ([k, v]) => k === messageID || v.key?.id === messageID
        )
      )?.[1].messages?.[messageID];
  }

  async sendGroupV4Invite(
    jid,
    participant,
    inviteCode,
    inviteExpiration,
    groupName = "unknown subject",
    caption = "Invitation to join my WhatsApp group",
    jpegThumbnail,
    options = {}
  ) {
    const msg = proto.Message.fromObject({
      groupInviteMessage: proto.GroupInviteMessage.fromObject({
        inviteCode,
        inviteExpiration:
          parseInt(inviteExpiration) || +new Date(new Date() + 3 * 86400000),
        groupJid: jid,
        groupName: (groupName ? groupName : await this.getName(jid)) || null,
        jpegThumbnail: Buffer.isBuffer(jpegThumbnail) ? jpegThumbnail : null,
        caption,
      }),
    });
    const message = generateWAMessageFromContent(participant, msg, options);
    await this.relayMessage(participant, message.message, {
      messageId: message.key.id,
      additionalAttributes: { ...options },
    });
    return message;
  }

  async processMessageStubType(m) {
    if (!m.messageStubType) return;
    const chat = this.decodeJid(
      m.key.remoteJid || m.message?.senderKeyDistributionMessage?.groupId || ""
    );
    if (!chat || chat === "status@broadcast") return;
    const emitGroupUpdate = (update) => {
      this.ev.emit("groups.update", [{ id: chat, ...update }]);
    };
    switch (m.messageStubType) {
      case WAMessageStubType.REVOKE:
      case WAMessageStubType.GROUP_CHANGE_INVITE_LINK:
        emitGroupUpdate({ revoke: m.messageStubParameters[0] });
        break;
      case WAMessageStubType.GROUP_CHANGE_ICON:
        emitGroupUpdate({ icon: m.messageStubParameters[0] });
        break;
      default: {
        console.log({
          messageStubType: m.messageStubType,
          messageStubParameters: m.messageStubParameters,
          type: WAMessageStubType[m.messageStubType],
        });
        break;
      }
    }
    const isGroup = chat?.endsWith("@g.us");
    if (!isGroup) return;
    let chats = this.chats[chat];
    if (!chats) chats = this.chats[chat] = { id: chat };
    chats.isChats = true;
    const metadata = await this.group.metadata(chat).catch((_) => null);
    if (!metadata) return;
    chats.subject = metadata.subject;
    chats.metadata = metadata;
  }

  async insertAllGroup() {
    const groups =
      (await this.group.fetch.allParticipating().catch((_) => null)) || {};
    for (const group in groups)
      this.chats[group] = {
        ...(this.chats[group] || {}),
        id: group,
        subject: groups[group].subject,
        isChats: true,
        metadata: groups[group],
      };
    return this.chats;
  }

  async pushMessage(m) {
    if (!m) return;
    if (!Array.isArray(m)) m = [m];
    for (const message of m) {
      try {
        // if (!(message instanceof proto.WebMessageInfo)) continue // https://github.com/adiwajshing/Baileys/pull/696/commits/6a2cb5a4139d8eb0a75c4c4ea7ed52adc0aec20f
        if (!message) continue;
        if (
          message.messageStubType &&
          message.messageStubType != WAMessageStubType.CIPHERTEXT
        )
          this.processMessageStubType(message).catch(console.error);
        const _mtype = Object.keys(message.message || {});
        const mtype =
          (!["senderKeyDistributionMessage", "messageContextInfo"].includes(
            _mtype[0]
          ) &&
            _mtype[0]) ||
          (_mtype.length >= 3 &&
            _mtype[1] !== "messageContextInfo" &&
            _mtype[1]) ||
          _mtype[_mtype.length - 1];
        const chat = this.decodeJid(
          message.key.remoteJid ||
            message.message?.senderKeyDistributionMessage?.groupId ||
            ""
        );
        if (message.message?.[mtype]?.contextInfo?.quotedMessage) {
          let context = message.message[mtype].contextInfo;
          let participant = this.decodeJid(context.participant);
          const remoteJid = this.decodeJid(context.remoteJid || participant);

          let quoted = message.message[mtype].contextInfo.quotedMessage;
          if (remoteJid && remoteJid !== "status@broadcast" && quoted) {
            let qMtype = Object.keys(quoted)[0];
            if (qMtype == "conversation") {
              quoted.extendedTextMessage = { text: quoted[qMtype] };
              delete quoted.conversation;
              qMtype = "extendedTextMessage";
            }
            if (!quoted[qMtype].contextInfo) quoted[qMtype].contextInfo = {};
            quoted[qMtype].contextInfo.mentionedJid =
              context.mentionedJid ||
              quoted[qMtype].contextInfo.mentionedJid ||
              [];
            const isGroup = remoteJid?.endsWith("g.us");
            if (isGroup && !participant) participant = remoteJid;
            const qM = {
              key: {
                remoteJid,
                fromMe: areJidsSameUser(this.user.jid, remoteJid),
                id: context.stanzaId,
                participant,
              },
              message: JSON.parse(JSON.stringify(quoted)),
              ...(isGroup ? { participant } : {}),
            };
            let qChats = this.chats[participant];
            if (!qChats)
              qChats = this.chats[participant] = {
                id: participant,
                isChats: !isGroup,
              };
            if (!qChats.messages) qChats.messages = {};
            if (!qChats.messages[context.stanzaId] && !qM.key.fromMe)
              qChats.messages[context.stanzaId] = qM;
            let qChatsMessages;
            if ((qChatsMessages = Object.entries(qChats.messages)).length > 40)
              qChats.messages = Object.fromEntries(
                qChatsMessages.slice(30, qChatsMessages.length)
              ); // maybe avoid memory leak
          }
        }
        if (!chat || chat === "status@broadcast") continue;
        const isGroup = chat?.endsWith("@g.us");
        let chats = this.chats[chat];
        if (!chats) {
          if (isGroup) await this.insertAllGroup().catch(console.error);
          chats = this.chats[chat] = {
            id: chat,
            isChats: true,
            ...(this.chats[chat] || {}),
          };
        }
        let metadata, sender;
        if (isGroup) {
          if (!chats.subject || !chats.metadata) {
            metadata =
              (await this.group.metadata(chat).catch((_) => ({}))) || {};
            if (!chats.subject) chats.subject = metadata.subject || "";
            if (!chats.metadata) chats.metadata = metadata;
          }
          sender = this.decodeJid(
            (message.key?.fromMe && this.user.id) ||
              message.participant ||
              message.key?.participant ||
              chat ||
              ""
          );
          if (sender !== chat) {
            let chats = this.chats[sender];
            if (!chats) chats = this.chats[sender] = { id: sender };
            if (!chats.name) chats.name = message.pushName || chats.name || "";
          }
        } else if (!chats.name)
          chats.name = message.pushName || chats.name || "";
        if (
          ["senderKeyDistributionMessage", "messageContextInfo"].includes(mtype)
        )
          continue;
        chats.isChats = true;
        if (!chats.messages) chats.messages = {};
        const fromMe =
          message.key.fromMe || areJidsSameUser(sender || chat, this.user.id);
        if (
          !["protocolMessage"].includes(mtype) &&
          !fromMe &&
          message.messageStubType != WAMessageStubType.CIPHERTEXT &&
          message.message
        ) {
          delete message.message.messageContextInfo;
          delete message.message.senderKeyDistributionMessage;
          chats.messages[message.key.id] = JSON.parse(
            JSON.stringify(message, null, 2)
          );
          let chatsMessages;
          if ((chatsMessages = Object.entries(chats.messages)).length > 40)
            chats.messages = Object.fromEntries(
              chatsMessages.slice(30, chatsMessages.length)
            );
        }
      } catch (e) {
        console.error(e);
      }
    }
  }

  async chatRead(jid, participant = this.user.jid, messageID) {
    return this.sendReadReceipt(jid, participant, [messageID]);
  }

  async setStatus(status) {
    return this.query({
      tag: "iq",
      attrs: {
        to: S_WHATSAPP_NET,
        type: "set",
        xmlns: "status",
      },
      content: [
        {
          tag: "status",
          attrs: {},
          content: Buffer.from(status, "utf-8"),
        },
      ],
    });
  }

  async serializeM(m) {
    return smsg(this, m);
  }
}

Buffer.prototype.toArrayBufferV2 = function toArrayBuffer() {
  return this.buffer.slice(this.byteOffset, this.byteOffset + this.byteLength);
};
/**
 * @returns {Buffer}
 */
ArrayBuffer.prototype.toBuffer = function toBuffer() {
  return Buffer.from(new Uint8Array(this));
};
// /**
//  * @returns {String}
//  */
// Buffer.prototype.toUtilFormat = ArrayBuffer.prototype.toUtilFormat = Object.prototype.toUtilFormat = Array.prototype.toUtilFormat = function toUtilFormat() {
//     return util.format(this)
// }
Uint8Array.prototype.getFileType =
  ArrayBuffer.prototype.getFileType =
  Buffer.prototype.getFileType =
    async function getFileType() {
      return await fileTypeFromBuffer(this);
    };
/**
 * @returns {Boolean}
 */
String.prototype.isNumber = Number.prototype.isNumber = isNumber;
/**
 *
 * @returns {String}
 */
String.prototype.capitalize = function capitalize() {
  return this.charAt(0).toUpperCase() + this.slice(1, this.length);
};
/**
 * @returns {String}
 */
String.prototype.capitalizeV2 = function capitalizeV2() {
  const str = this.split(" ");
  return str.map((v) => v.capitalize()).join(" ");
};
String.prototype.decodeJid = function decodeJid() {
  if (/:\d+@/gi.test(this)) {
    const decode = jidDecode(this) || {};
    return (
      (decode.user && decode.server && decode.user + "@" + decode.server) ||
      this
    ).trim();
  } else return this.trim();
};
/**
 * number must be milliseconds
 * @returns {string}
 */
Number.prototype.toTimeString = function toTimeString() {
  // const milliseconds = this % 1000
  const seconds = Math.floor((this / 1000) % 60);
  const minutes = Math.floor((this / (60 * 1000)) % 60);
  const hours = Math.floor((this / (60 * 60 * 1000)) % 24);
  const days = Math.floor(this / (24 * 60 * 60 * 1000));
  return (
    (days ? `${days} day(s) ` : "") +
    (hours ? `${hours} hour(s) ` : "") +
    (minutes ? `${minutes} minute(s) ` : "") +
    (seconds ? `${seconds} second(s)` : "")
  ).trim();
};
Number.prototype.getRandom =
  String.prototype.getRandom =
  Array.prototype.getRandom =
    getRandom;
