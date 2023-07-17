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
		conn.connOpts = opts;

		this.opts = new Object(
			yargs(process.argv.slice(2)).exitProcess(false).parse()
		);
		this.conn = conn || this
		this.chats = { ...(this.conn.connOpts.chats || {}) };
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
