module.exports = async (client, globPromise, Ascii) => {
  const eLoad = new Ascii("Events Loaded Status")
    .setStyle("unicode-single")
    .setHeading("Events", "Status", "Description");
  const eventFiles = await globPromise(`${process.cwd()}/src/Events/*.js`);
  eventFiles.map(async (value) => {
    require(value);
    await eLoad.addRow(
      value.split("/")[value.split("/").length - 1],
      "✅",
      "   "
    );
  });
  console.log(eLoad.toString());
};
