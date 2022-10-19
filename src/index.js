require("module-alias/register");
const { Spider } = require("./Structures/Client/spy");
const client = new Spider();
module.exports = client;
(async () => await client.login(client.config.token));
