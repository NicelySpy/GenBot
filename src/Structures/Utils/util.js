module.exports = class Util {
  constructor(client) {
    client = client;
  }
  trimArray(arr, maxLen = 10) {
    if (arr.length > maxLen) {
      const len = arr.length - maxLen;
      arr = arr.slice(0, maxLen);

      arr.push(`\n And ${len} more....`);
    }
    return arr;
  }

  formatBytes(bytes) {
    if (bytes === 0) return "0 Bytes";
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
  }

  removeDuplicates(arr) {
    return [...new Set(arr)];
  }

  capitalise(string) {
    return string
      .split(" ")
      .map((str) => str.slice(0, 1).toUpperCase() + str.slice(1))
      .join(" ");
  }

  formatPerms(perm) {
    return perm
      .toLowerCase()
      .replace(/(^|"|_)(\S)/g, (s) => s.toUpperCase())
      .replace(/_/g, " ")
      .replace(/Guild/g, "Server")
      .replace(/Use Vad/g, "Use Voice Acitvity");
  }

  formatArray(array, type = "conjunction") {
    return new Intl.ListFormat("en-GB", { style: "short", type: type }).format(
      array
    );
  }
};
