module.exports = async (client, globPromise, Ascii) => {
  /*const bLoad = new Ascii("Buttons Loaded Status").setStyle("unicode-single").setHeading("Buttons Id", "Status", "Description");
        (await globPromise(`${process.cwd()}/src/Events/Buttons/*.js`)).map(async(value) => {
                const bFile = require(value);
                if(!bFile.id) return bLoad.addRow(value.split("/")[value.split("/").length - 1], "❌ Failed", "Missing an Id of the buttons");
                client.buttons.set(bFile.id, bFile);
                await bLoad.addRow(bFile.id, "✅ Succsesfull", "   ");
        });
        console.log(bLoad.toString());*/
};
