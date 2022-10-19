const warnModel = require("../../src/Structures/Models/warnModel");
const { MessageEmbed } = require("discord.js");
const moment = require("moment");
module.exports = {
  name: "warn",
  description: "Warn User",
  userPermissions: ["MANAGE_MESSAGES"],
  options: [
    {
      name: "add",
      description: "Add the warn to the an user",
      type: "SUB_COMMAND",
      options: [
        {
          name: "user",
          description: "User Yang Mau Di Warn",
          type: "USER",
          required: true,
        },
        {
          name: "alasan",
          description: "Alasannya??",
          type: "STRING",
          required: true,
        },
      ],
    },
    {
      name: "remove",
      type: "SUB_COMMAND",
      description: "Remove the user warn",
      options: [
        {
          name: "warn-id",
          description: "The warn id",
          type: "STRING",
          required: true,
        },
      ],
    },
    {
      name: "list",
      type: "SUB_COMMAND",
      description: "The user warn list",
      options: [
        {
          name: "target",
          type: "USER",
          description: "The user",
          required: true,
        },
      ],
    },
  ],
  run: async ({ client, interaction }) => {
    const subCommand = interaction.options.getSubcommand();
    if (subCommand === "add") {
      const user = interaction.options.getUser("user");
      const reason = interaction.options.getString("alasan");
      new warnModel({
        userId: user.id,
        guildId: interaction.guildId,
        moderatorId: interaction.user.id,
        reason,
        timestamp: Date.now(),
      }).save();
      user
        .send(
          `Kamu telah di Warn pada server ${interaction.guild.name}, Alasan: ${reason}`
        )
        .catch(console.log);
      interaction.followUp({
        content: `Sukses Warn ${user.tag}, Alasan: ${reason}`,
      });
    } else if (subCommand === "remove") {
      const warnId = interaction.options.getString("warn-id");
      const data = await warnModel.findById(warnId);
      if (!data) {
        return interaction.reply({
          content: `${warnId} Is not a valid warn id!`,
          ephemeral: true,
        });
      } /* .then((msg) => {
                       setTimeout(() => msg.deleteReply(), 3000)});*/
      data.delete();
      const user2 = interaction.guild.members.cache.get(data.userId);
      return interaction.followUp({
        content: `Menghapus 1 warn dari ${user2.tag}, Sukses!`,
      });
    } else if (subCommand === "list") {
      const userTarget = interaction.options.getUser("target");

      const userWarnings = await warnModel.find({
        userId: userTarget.id,
        guildId: interaction.guildId,
      });
      if (!userWarnings?.length) {
        return interaction.followUp({
          content: `${userTarget} tidak memiliki warn pada server ini`,
        });
      } /* .then((msg) => {
                       setTimeout(() => msg.deleteReply(), 3000)});*/
      const embedDescription = userWarnings
        .map((warn) => {
          const moderator = interaction.guild.members.cache.get(
            warn.moderatorId
          );
          return [
            `Warn ID: ${warn._id}`,
            `Moderator: ${moderator || client.user.tag}`,
            `Time: ${moment(warn.timestamp).format("MMMM Do YYYY")}`,
            `Reason: ${warn.reason}`,
          ].join("\n");
        })
        .join("\n\n");
      const embed = new MessageEmbed()
        .setTitle(`${userTarget.tag}'s Warnings`)
        .setDescription(embedDescription)
        .setColor("RANDOM")
        .setTimestamp();
      interaction.followUp({ embeds: [embed] });
    }
  },
};
