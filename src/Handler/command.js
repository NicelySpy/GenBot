module.exports = async (client, globPromise, Ascii) => {
  const sLoad = new Ascii("Slash Commands Loaded Status").setStyle(
    "unicode-single"
  );
  sLoad.setHeading("Command", "Status", "Description");
  const slashCommands = await globPromise(
    `${process.cwd()}/src/Commands/*/*.js`
  );

  const arrayOfSlashCommands = [];
  slashCommands.map(async (value) => {
    const file = require(value);
    const splitted = value.split("/");
    const directory = splitted[splitted.length - 1];
    if (!file?.name) {
      return sLoad.addRow(directory, "❌", "Missing a name");
    }
    client.commands.set(file.name, file);
    await sLoad.addRow(file.name, "✅", "   ");

    if (["MESSAGE", "USER"].includes(file.type)) delete file.description;
    if (file.userPermissions) file.defaultPermissions = false;
    if (!["MESSAGE", "USER"].includes(file.type) && !file.description) {
      return sLoad.addRow(file.name, "❌ Failed", "Missing a description");
    }
    arrayOfSlashCommands.push(file);
  });
  client.on("ready", async () => {
    const personalGuild = client.guilds.cache.get("1023607210149945436");
    await personalGuild.commands.set(arrayOfSlashCommands);
    await client.application.commands.set(arrayOfSlashCommands);
  });
  console.log(sLoad.toString());
};
