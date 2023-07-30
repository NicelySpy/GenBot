export function logic(check, inp, out) {
  if (inp.length !== out.length)
    throw new Error("Input and Output must have same length");
  for (let i in inp) if (util.isDeepStrictEqual(check, inp[i])) return out[i];
  return null;
}

export function protoType() {
  Buffer.prototype.toArrayBuffer = function toArrayBufferV2() {
    const ab = new ArrayBuffer(this.length);
    const view = new Uint8Array(ab);
    for (let i = 0; i < this.length; ++i) {
      view[i] = this[i];
    }
    return ab;
  };
}

export function isNumber() {
  const int = parseInt(this);
  return typeof int === "number" && !isNaN(int);
}

export function getRandom() {
  if (Array.isArray(this) || this instanceof String)
    return this[Math.floor(Math.random() * this.length)];
  return Math.floor(Math.random() * this);
}

/**
 * ??
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator
 * @returns {boolean}
 */
export function nullish(args) {
  return !(args !== null && args !== undefined);
}

//let defaultBaileys = (import('baileys')).default

export * from "./builder/whatsapp.js";
export * from "./builder/store.js";
export * from "./builder/serializeM.js";
export * from "./genbot.js";
export * from "@whiskeysockets/baileys";

// TypeError: Cannot read properties of null (reading 'user')
//     at WebMessageInfo.get (file:///home/container/lib/simple.js:888:70)
//     at Object.value (file:///home/container/lib/simple.js:731:61)
//     at Object.handler (file:///home/container/handler.js?update=1646537086773:18:10)
//     at EventEmitter.emit (node:events:532:35)
//     at Object.all (file:///home/container/plugins/_templateResponse.js?update=1646538543307:79:13)
//     at async Object.handler (file:///home/container/handler.js?update=1646537086773:346:21)
