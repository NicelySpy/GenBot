import { conn } from "../../index.js";
import { format } from "util";

export default {
  name: "messages.upsert",
  run: async (chatUpdate) => {
    try {
      //console.log(this);
      if (!chatUpdate) return;
      conn.pushMessage(chatUpdate.messages).catch(console.error);
      let m = chatUpdate.messages[chatUpdate.messages.length - 1];

      m = conn.smsg(conn, m) || m;
      if(!m) return;
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
            await plugin.runAll(m, conn);
          } catch (e) {
            conn.logger.error(e);
          }
        }
        if (typeof plugin.runBefore === "function") {
          if (await plugin.runBefore(m, conn)) continue;
        }
        if (typeof plugin.run !== "function") continue;
        if (plugin.disabled) continue;
        try {
          await plugin.run(m, conn);
        } catch (e) {
          m.error = e;
          conn.logger.error(e);
          if (e) {
            let text = format(e);
            //for (let key of Object.values(global.APIKeys))
            //  text = text.replace(new RegExp(key, "g"), "#HIDDEN#");
            m.reply(text);
          }
        } finally {
          if (typeof plugin.runAfter == 'function') {
            try {
              await plugin.runAfter(m, conn);
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
