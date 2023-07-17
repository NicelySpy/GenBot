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
  this.onUxpectedError = conn.onUxpectedError
  this.uploadPreKeys = conn.uploadPreKeys
  this.uploadPreKeysToServerIfRequired = conn.uploadPreKeysToServerIfRequired
  this.waitForConnectionUpdate = conn.waitForConnectionUpdate
  this.processingMutex = conn.processingMutex
  this.fetchPrivacySetting = conn.fetchPrivacySetting
  this.upsertMessage = conn.upsertMessage
  this.appPatch = conn.appPatch
  this.sendPresenceUpdate = conn.sendPresenceUpdate
  this.presenceSubscribe = conn.presenceSubscribe
  this.profilePictureUrl = conn.profilePictureUrl
  this.onWhatsapp = conn.onWhatsapp
  this.fetchBlocklist = conn.fetchBlocklist
  this.fetchStatus = conn.fetchStatus
  this.updateProfilePicture = conn.updateProfilePicture
  this.removeProfilePicture = conn.removeProfilePicture
  this.updateProfileStatus = conn.updateProfileStatus
  this.updateProfileName = conn.updateProfileName
  this.updateBlockStatus = conn.updateBlockStatus
  this.updateLastSeenPrivacy = conn.updateLastSeenPrivacy
  this.updateOnlinePrivacy = conn.updateLastSeenPrivacy
  this.updateProfilePicturePrivacy = conn.updateProfilePicturePrivacy
  this.updateReadReceiptPrivacy = conn.updateReadReceiptPrivacy
  this.updateGroupsAddPrivacy = conn.updateGroupsAddPrivacy
  this.updateDefaultDisappearingMode = conn.updateDefaultDisappearingMode
  this.getBusinessProfile = conn.getBusinessProfile
  this.resyncAppState = conn.resyncAppState
  this.chatModify = conn.chatModify
  this.groupMetadata = conn.groupMetadata
  this.groupCreate = conn.groupCreate
  this.groupLeave = conn.groupLeave
  this.groupUpdateSubject = conn.groupUpdateSubject
  this.groupParticipantsUpdate = conn.groupParticipantsUpdate
  this.groupUpdateDescription = conn.groupUpdateDescription
  this.groupInviteCode = conn.groupInviteCode
  this.groupRevokeInvite = conn.groupRevokeInvite
  this.groupAcceptInvite = conn.groupAcceptInvite
  this.groupAcceptInviteV4 = conn.groupAcceptInviteV4
  this.groupGetInviteInfo = conn.groupGetInviteInfo
  this.groupToggleEphemeral = conn.groupToggleEphemeral
  this.groupSettingUpdate = conn.groupSettingUpdate
  this.groupToggleMembershipApprovalMode = conn.groupToggleMembershipApprovalMode
  this.groupFetchAllParticipating = conn.groupFetchAllParticipating
  this.getPrivacyToken = conn.getPrivacyToken
  this.assertSession = conn.assertSession
  this.relayMessage = conn.relayMessage
  this.sendReceipt = conn.sendReceipt
  this.sendReceipts = conn.sendReceipts
  this.readMessages = conn.readMessages
  this.refreshMediaConn = conn.refreshMediaConn
  this.waUploadToServer = conn.waUploadToServer
  this.uploadMediaMessage = conn.uploadMediaMessage
  this.sendMessage = conn.sendMessage
  this.sendMessageAck = conn.sendMessageAck
  this.sendRetryRequest = conn.sendRetryRequest
  this.rejectCall = conn.rejectCall
  this.getOrderDetails = conn.getOrderDetails
  this.getCatalog = conn.getCatalog
  this.getCollections = conn.getCollections
  this.productCreate = conn.productCreate
  this.productDelete = conn.productDelete
  this.productUpdate = conn.productUpdate

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
