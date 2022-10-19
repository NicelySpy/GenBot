const { model, Schema } = require("mongoose");
const pft = model(
  "AntiLink",
  new Schema({
    Guild: String,
    Channel: Array,
  })
);
module.exports = pft;
