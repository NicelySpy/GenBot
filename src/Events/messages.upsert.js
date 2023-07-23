import { conn } from "../../index.js";

export default {
  name: "messages.upsert",
  run: async (chatUpdate) => {
    try {
      //console.log(this);
      if (!chatUpdate) return;
      conn.pushMessage(chatUpdate.messages).catch(console.error);
      let m = chatUpdate.messages[chatUpdate.messages.length - 1];

      m = conn.smsg(conn, m) || m;
      let [c, ...args] = m.text
        .toLowerCase()
        .slice(".".length)
        .trim()
        .split(" ");
      args = args || [];
      m.args = args;
      //console.log(c, args)

      if (m.text == "p") m.reply("whag");
      //conn.loadPlugin()
      for (let p in conn.plugin) {
        let plugin = conn.plugin[p];
        //console.log(plugin)
        if (typeof plugin.runAll === "function") {
          try {
            await plugin.runAll({ conn, m });
          } catch (e) {
            conn.logger.error(e);
          }
        }
        if (typeof plugin.runBefore === "function") {
          if (await plugin.runBefore({ conn, m })) continue;
        }
        if (typeof plugin.run !== "function") continue;

        try {
          await plugin.run({ conn, m });
        } catch (e) {
          m.error = e;
          conn.logger.error(e);
          if (e) {
            let text = format(e);
            for (let key of Object.values(global.APIKeys))
              text = text.replace(new RegExp(key, "g"), "#HIDDEN#");
            m.reply(text);
          }
        } finally {
          if (typeof plugin.runAfter == 'function') {
            try {
              await plugin.runAfter({ conn, m });
            } catch (e) {
              conn.logger.error(e);
            }
          }
        }
        break;
      }
      //console.log(m);
    } catch (e) {
      conn.logger.error(e);
    }
  },
};
