const { EmbedBuilder } = require("discord.js");
const moment = require("moment");
const axios = require("axios");

const capitalizeFirstLetter = (string) =>
  string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();

module.exports = {
  name: "userinfo",
  aliases: ["user", "ui"],
  description:
    "Displays information about a provided user or the message author.",
  // args: true,
  usage: ["[user]"],
  run: async (client, message, args) => {
    const user =
      message.guild.members.cache.get(message.mentions.members.first()?.id) ||
      message.guild.members.cache.get(args[0]) ||
      message.guild.members.cache.get(message.author.id);

    let userRoles = user.roles.cache
      .map((x) => x)
      .filter((z) => z.name !== "@everyone");
    if (userRoles.length > 100) userRoles = "More than 100";

    let safe = user.user.createdTimestamp;
    if (safe < Date.now() - 2629746000) {
      safe = "`Not Suspicious` <:online:925993330779779102>";
    } else {
      safe = "`Suspicious` <:dnd:925993514536431676>";
    }

    const nitroBadge = user.user.avatarURL({ dynamic: true });
    let flags = user?.user?.flags?.toArray().join("");
    if (!flags) flags = "None";

    flags = flags.replace(
      "HOUSE_BRAVERY",
      "**•** <:hypesquad_bravery:925989755743789086> `HypeSquad Bravery`"
    );
    flags = flags.replace(
      "HOUSE_BRILLIANCE",
      "**•** <:hypesquad_brilliance:925989913944543263> `HypeSquad Brilliance`"
    );
    flags = flags.replace(
      "HOUSE_BALANCE",
      "**•** <:hypesquad_balance:925989859984826379> `HypeSquad Balance`"
    );
    flags = flags.replace(
      "HOUSE_BALANCE",
      "**•** <:hypesquad_balance:925989859984826379> `HypeSquad Balance`"
    );
    flags = flags.replace(
      "HYPESQUAD_EVENTS",
      "**•** <:events:925990000993128488> `HypeSquad Events`"
    );
    flags = flags.replace(
      "EARLY_SUPPORTER",
      "**•** <:earlysupporter:925990123462606898> `Early Supporter`"
    );
    flags = flags.replace(
      "VERIFIED_DEVELOPER",
      "**•** <:verified:925990083331522570> `Verified Bot Developer`"
    );
    flags = flags.replace(
      "EARLY_VERIFIED_DEVELOPER",
      "**•** <:verified:925990083331522570> `Verified Bot Developer`"
    );
    flags = flags.replace(
      "DISCORD_PARTNER",
      "**•** <:partnerbadge:925990057880469544> `Partner`"
    );
    flags = flags.replace(
      "DISCORD_CLASSIC",
      "**•** <:partnerbadge:925990057880469544> `Discord Classic`"
    );
    const PERM_FLAGS_MAP = {
      ADMINISTRATOR: "Administrator",
      MANAGE_GUILD: "Manage Server",
      MANAGE_ROLES: "Manage Roles",
      MANAGE_CHANNELS: "Manage Channels",
      MANAGE_MESSAGES: "Manage Messages",
      MANAGE_WEBHOOKS: "Manage Webhooks",
      MANAGE_NICKNAMES: "Manage Nicknames",
      MANAGE_EMOJIS: "Manage Emojis",
      KICK_MEMBERS: "Kick Members",
      BAN_MEMBERS: "Ban Members",
      MENTION_EVERYONE: "Mention Everyone",
    };
    const keyPerms = [];
    const totalPerms = user?.permissions?.toArray();
    for (i in totalPerms) {
      if (PERM_FLAGS_MAP.hasOwnProperty(totalPerms[i])) {
        keyPerms.push(PERM_FLAGS_MAP[totalPerms[i]]);
      }
    }
    keyPerms.sort();

    const activities = [];
    user?.presence?.activities.forEach((a) => {
      if (a.id !== "custom") {
        if (a.name === "Spotify") {
          activities.push(
            `**•** Listening to **${a.details}** by **${a.state}**`
          );
        } else {
          activities.push(
            `**•** ${capitalizeFirstLetter(a.type)} **${a.name}**`
          );
        }
      }
    });

    const embed = new EmbedBuilder()
      .setColor("GREEN")
      .setAuthor({
        name: user.user.tag,
        iconURL: user.user.displayAvatarURL({ dynamic: true }),
      })
      .setThumbnail(user.user.displayAvatarURL({ dynamic: true }))
      .setDescription(
        `__**User Info:**__
**•** Account Created: \`${moment(user.user.createdAt).format(
          "MMMM Do YYYY, H:mm:ss"
        )}\`
**•** Joined Server: \`${moment(user.joinedAt).format(
          "MMMM Do YYYY, H:mm:ss"
        )}\`
**•** ID: \`${user.id}\`
**•** Tag: \`${user.user.tag}\`
**•** Nickname: \`${user.displayName ? user.displayName : user.user.username}\`
**•** Bot: \`${user.user.bot ? "Yes" : "No"}\`
${
  activities.length > 0
    ? `\n__**Activity:**__ \n${activities.join("\n")}\n`
    : ""
}
__**Badges:**__
${flags}

__**Suspicious Check:**__
**•** ${safe}
${
  keyPerms.length > 0
    ? `\n__**Key Permissions:**__\n${keyPerms.join(", ")}`
    : ""
}${
          userRoles.length > 0
            ? `\n\n__**Roles:**__ **[${userRoles.length}]**\n${userRoles.join(
                ", "
              )}`
            : ""
        }
`
      )
      .setTimestamp();

    // Get data from api
    axios
      .get(`https://discord.com/api/users/${user.id}`, {
        headers: {
          Authorization: `Bot ${client.config.token}`,
        },
      })
      .then((res) => {
        // Get banner and accent color from api data
        const { banner } = res.data;

        // Check if user has a banner
        if (banner) {
          // Set image to .png or .gif and create banner url
          const extension = banner.startsWith("a_") ? ".gif" : ".png";
          const url = `https://cdn.discordapp.com/banners/${user.id}/${banner}${extension}?size=1024`;

          // Set thumbnail to banner url
          embed.setImage(url);
        }
        message.reply({
          embeds: [embed],
          allowedMentions: { repliedUser: false },
        });
      });
  },
};
