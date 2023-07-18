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
	nullish
} from "../myfunction.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class WhatsappBot {
	constructor(connOpts = {}, opts = {}) {
		let conn = _makeWaSocket(connOpts);
		this.connOpts = opts
  this.type = conn.type
  this.ws = conn.ws
  this.ev = conn.ev
  this.authState = conn.authState
  this.signalRepository = conn.signalRepository
  this.user = conn.user
  this.generateMessageTag = conn.generateMessageTag
  this.query = conn.query
  this.waitForMessage = conn.waitForMessage
  this.waitForSocketOpen = conn.waitForSocketOpen
  this.sendRawMessage = conn.sendRawMessage
  this.sendNode = conn.sendNode
  this.logout = conn.logout
  this.end = conn.end
  this.onUnexpectedError = conn.onUnexpectedError
  this.uploadPreKeys = conn.uploadPreKeys
  this.uploadPreKeysToServerIfRequired = conn.uploadPreKeysToServerIfRequired
  this.waitForConnectionUpdate = conn.waitForConnectionUpdate
  this.processingMutex = conn.processingMutex
  this.upsertMessage = conn.upsertMessage
  this.appPatch = conn.appPatch
  this.sendPresenceUpdate = conn.sendPresenceUpdate
  this.presenceSubscribe = conn.presenceSubscribe
  this.onWhatsApp = conn.onWhatsApp
  this.resyncAppState = conn.resyncAppState
  this.chatModify = conn.chatModify
  this.assertSessions = conn.assertSessions
  this.relayMessage = conn.relayMessage
  this.sendReceipt = conn.sendReceipt
  this.sendReceipts = conn.sendReceipts
  this.readMessages = conn.readMessages
  this.refreshMediaConn = conn.refreshMediaConn
  this.waUploadToServer = conn.waUploadToServer
  this.updateMediaMessage = conn.updateMediaMessage
  this.sendMessage = conn.sendMessage
  this.sendMessageAck = conn.sendMessageAck
  this.sendRetryRequest = conn.sendRetryRequest
  this.rejectCall = conn.rejectCall
  
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
        groupsAdd: conn.updateGroupsAddPrivacy
      },
    }
  }
  this.group = {
    metadata: conn.groupMetadata,
    create: conn.groupCreate,
    leave: conn.groupLeave,
    participantsUpdate: conn.groupParticipantsUpdate,
    settingUpdate: conn.groupSettingUpdate,
    fetch: {
      allParticipating: conn.groupFetchAllParticipating
    },
    toggle: {
      ephemeral: conn.groupToggleEphemeral,
      membershipApprovalMode: conn.groupToggleMembershipApprovalMode
    },
    invite: {
      getCode: conn.groupInviteCode,
      revoke: conn.groupRevokeInvite,
      accept: conn.groupAcceptInvite,
      acceptV4: conn.groupAcceptInviteV4,
      getInfo: conn.groupGetInviteInfo
    },
    update: {
      subject: conn.groupUpdateSubject,
      description: conn.groupUpdateDescription
    }
  }
  this.fetch = {
    blocklist: conn.fetchBlocklist,
    status: conn.fetchStatus
  }
  this.update = {
    blockStatus: conn.updateBlockStatus,
    defaultDisappearingMode: conn.updateDefaultDisappearingMode
  }
  this.business = {
    get: {
      profile: conn.getBusinessProfile,
      orderDetails: conn.getOrderDetails,
      catalog: conn.getCatalog,
      collections: conn.getCollections
    },
    product: {
      create: conn.productCreate,
      delete: conn.productDelete,
      update: conn.productUpdate
    }
  }

		this.opts = new Object(
			yargs(process.argv.slice(2)).exitProcess(false).parse()
		);
		this.chats = { ...(this.connOpts.chats || {}) };
	}

}

Buffer.prototype.toArrayBufferV2 = function toArrayBuffer() {
	return this.buffer.slice(
		this.byteOffset,
		this.byteOffset + this.byteLength
	);
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
