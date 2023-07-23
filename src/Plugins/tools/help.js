export default {
  command: {
    name: "menu",
    aliases: ["help"],
  },
  run: async ({ conn }) => {
    conn.loadPlugin();
    let cate = [];
    let cat = {};
    for (let name in conn.plugin) {
      let plugin = conn.plugin[name];

      cat[plugin.command.category] = plugin.command;
    }
    cate.push(cat);
    console.log(
      cate
        .map((x) => {
          for (let cate in x) {
            let categ = x[cate];
            return `${categ.name} (${categ.aliases.join(", ")})`;
          }
        })
        .join("\n")
    );
    /*m.reply(`${cate.map((x) => {
			for(let cate in x) {
				let categ = x[cate]
				return `${categ.name} (${categ.aliases.join(', ')})`
			}
		}).join('\n')}`)*/
  },
};
