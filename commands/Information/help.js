const {
  EmbedBuilder,
  MessageActionRow,
  MessageSelectMenu,
} = require("discord.js");

module.exports = {
  name: "help",
  description: "Help Menu",
  usage: ["[cmd | aliases]"],
  run: async (client, message, args) => {
    const tt = args.join(" ");

    const directories = [
      ...new Set(client.commands.map((cmd) => cmd.directory)),
    ];
    const formatString = (str) =>
      `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;
    const categories = directories.map((dir) => {
      const getCommands = client.commands
        .filter((cmd) => cmd.directory === dir)
        .filter((cmd) => !cmd.ownerOnly)
        .map((cmd) => {
          return {
            name: cmd.name || "No name provided",
            description: cmd.description || "No description provided",
            aliases: cmd.aliases?.join(", ") || "",
            usage: cmd.usage || "",
            ownerOnly: cmd.ownerOnly || "false",
            userPermissions: cmd.userPermissions || "No Permissions",
            moderatorOnly: cmd.moderatorOnly || "false",
            nfsw: cmd.nfsw || "false",
          };
        });
      return {
        directory: formatString(dir),
        commands: getCommands,
      };
    });
    if (tt) {
      const cmds =
        client.commands.get(tt.toLowerCase()) ||
        client.commands.find((c) => c.aliases?.includes(tt.toLowerCase()));
      if (!cmds || cmds.ownerOnly) {
        return message.reply(`${tt} is an invalid commands!`).then((msg) => {
          setTimeout(() => msg.delete(), 3000);
        });
      } else if (cmds) {
        const hh = new EmbedBuilder()
          .setTitle(`${formatString(cmds.name)} commands`)
          .setDescription(
            `Information about ${formatString(
              cmds.name
            )} command!\n\n<> = Required, \n[] = Optional, \n| = Or`
          )
          .addFields([
            {
              name: "**Name**",
              value: `\`${cmds.name}\``,
            },
            {
              name: "**Description**",
              value: `\`${cmds.description || "No description provided"}\``,
              inline: true,
            },
            {
              name: "**Category**",
              value: `\`${formatString(cmds.directory)}\``,
            },
            {
              name: "**Usages**",
              value: `\`${cmds.name} ${cmds.usage || ""}\``,
              inline: true,
            },
            {
              name: "**Aliases**",
              value: `\`${cmds.aliases?.join(", ") || "No aliases provided"}\``,
              inline: true,
            },
            {
              name: "**Nfsw**",
              value: `\`${cmds.nfsw ? "Yes" : "No"}\``,
              inline: true,
            },
            {
              name: "**Permission**",
              value: `\`${
                cmds.userPermissions
                  ? formatString(cmds.userPermissions)
                  : "No permissions provided"
              }\``,
              inline: true,
            },
          ]);
        message.channel.send({ embeds: [hh] });
      }
    } else {
      const embed = new EmbedBuilder().setDescription(
        "**Hello!**,\nType ```help [cmd | aliases]``` to know more detail of that command\nMentions me if you didn't know my prefix!"
      );

      const components = (state) => [
        new MessageActionRow().addComponents(
          new MessageSelectMenu()
            .setCustomId("help-menu")
            .setPlaceholder("Select a category!")
            .setDisabled(state)
            .addOptions(
              categories.map((cmd) => {
                return {
                  label: cmd.directory,
                  value: cmd.directory.toLowerCase(),
                  description: `Commands from category ${cmd.directory}`,
                };
              })
            )
        ),
      ];
      const initialMessage = await message.channel.send({
        embeds: [embed],
        components: components(false),
      });
      const filter = (interaction) => interaction.user.id === message.author.id;
      const collector = message.channel.createMessageComponentCollector({
        filter,
        componentType: "SELECT_MENU",
        time: 60000,
      });
      collector.on("collect", (interaction) => {
        const [directory] = interaction.values;
        const category = categories.find(
          (x) => x.directory.toLowerCase() === directory
        );
        const categoryEmbed = new EmbedBuilder()
          .setTitle(`${formatString(directory)} Commands`)
          .setDescription(
            `This is an all commands of ${formatString(directory)}! \n`
          )
          .addFields(
            category.commands.map((cmd) => {
              return {
                name: `\`\n${cmd.name} [${cmd.aliases}]\``,
                value: `${cmd.description}`,
                inline: true,
              };
            })
          )
          .setTimestamp();
        interaction.update({ embeds: [categoryEmbed] });
      });
      collector.on("end", () => {
        initialMessage.edit({ components: components(true) });
      });
    }
  },
};
