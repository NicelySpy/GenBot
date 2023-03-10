const client = require("../../../index");

function binaryToText(binary) {
  binary = binary.split(" ");
  return binary.map((elem) => String.fromCharCode(parseInt(elem, 2))).join("");
}
function clean(text) {
  if (typeof text === "string")
    return text
      .replace(/`/g, `\` ${String.fromCharCode(8203)}`)
      .replace(/@/g, `@${String.fromCharCode(8203)}`);
  else return text;
}
function save(text) {
  return (text = String(text)
    .replace(
      new RegExp(
        client.config.token.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&"),
        "gi"
      ),
      "*****"
    )
    .replace(
      new RegExp(client.mongoURI.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&"), "gi"),
      "*****"
    )
    .replace(
      new RegExp(client.secret.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&"), "gi"),
      "*****"
    ));
}
function randomCode() {
  return btoa(~~(Math.random() * Date.now()));
}
module.exports = {
  clean,
  binaryToText,
  randomCode,
  save,
};
