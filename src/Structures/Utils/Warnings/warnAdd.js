const model = require("../../Models/warnModel");
const { MessageEmbed } = require("discord.js");
async function warningAdd(options = {}, message) {
  if (!options.reason) options.reason = "No Reason";
  if (!message)
    throw new TypeError(
      ":MISSING: You must fill the message with a message object"
    );
  if (typeof message !== "object")
    throw new TypeError(":INVALID: The message is not an object!");
  if (!options.target)
    throw new TypeError(
      ":MISSING: You must fill the target with a target object"
    );
  if (typeof options.target !== "object")
    throw new TypeError(":INVALID: The target is not an object!");
  if (options.moderator && typeof options.moderator !== "object")
    throw new TypeError(":INVALID: The moderator is not an object");
  if (options.reason && typeof options.reason !== "string")
    throw new TypeError(":INVALID: The reason is not a string");
  if (!options.dmEmbed) options.dmEmbed = {};
  if (options.dmEmbed.title && typeof options.dmEmbed.title !== "string")
    throw new TypeError(":INVALID: The title of dmEmbed is not a string!");
  if (
    options.dmEmbed.description &&
    typeof options.dmEmbed.description !== "string"
  )
    throw new TypeError(
      ":INVALID: The description of dmEmbed is not a string!"
    );
  if (!options.reason) options.reason = "No Reason";

  if (!options.dmEmbed.title) options.dmEmbed.title = "You has been Warned!";
  if (!options.dmEmbed.description)
    options.dmEmbed.description = `You has been Warned on ${message.guild.name}`;
  if (!options.dmEmbed.color) options.dmEmbed.color = "ORANGE";
  if (!options.dmEmbed.fields)
    options.dmEmbed.fields = [
      {
        name: "Guild",
        value: `\`${message.guild.name}\``,
        inline: true,
      },
      { name: "Reason", value: `\`${options.reason}\``, inline: true },
    ];
  options.dmEmbed.title = options.dmEmbed.title
    .replace("{guild}", message.guild.name)
    .replace("{reason}", options.reason)
    .replace("{moderator}", options.moderator.tag);
  options.dmEmbed.description = options.dmEmbed.description
    .replace("{guild}", message.guild.name)
    .replace("{reason}", options.reason)
    .replace("{moderator}", options.moderator.tag);
  options.dmEmbed.fields.name = options.dmEmbed.fields
    .replace("{guild}", message.guild.name)
    .replace("{reason}", options.reason)
    .replace("{moderator}", options.moderator.tag);
  options.dmEmbed.fields.value = options.dmEmbed.fields.value
    .replace("{guild}", message.guild.name)
    .replace("{reason}", options.reason)
    .replace("{moderator}", options.moderator.tag);

  new model({
    userId: options.target.id,
    guildId: options.message.guild.id,
    moderatorId: options.moderator.id,
    reason: options.reason,
    timestamp: Date.now(),
  }).save();
  const embed = new MessageEmbed()
    .setTitle(options.dmEmbed.title)
    .setColor(options.dmEmbed.color)
    .setDescription(options.dmEmbed.description)
    .addFields(options.dmEmbed.fields);
  options.target.send({ embeds: [embed] });
}
module.exports = { warningAdd };
