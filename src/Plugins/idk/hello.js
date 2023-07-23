export default {
  command: {
    name: "hello",
  },
  run: async({ conn, m }) => {
    m.reply(`idk why would i do this (${m.args[0]}`);
    //return m.reply('.hello what')
  },
};
