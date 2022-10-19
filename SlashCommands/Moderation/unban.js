module.exports = {
  name: "unban",
  description: "Unban member yang telah kebanned di server ini",
  userPermissions: ["BAN_MEMBERS"],
  options: [
    {
      name: "userid",
      description: "User Id yang mau di unban",
      type: "STRING",
      required: "true",
    },
  ],
  run: async ({ interaction }) => {
    const target = interaction.options.getString("userid");
    interaction.guild.members
      .unban(target)
      .then((user) => {
        interaction.reply({
          content: `Telah mengunban ${user.tag} dari Server ini!!`,
        });
      })
      .catch(() => {
        interaction.reply({ content: "Tolong kasih User Id yang Valid!" });
      });
  },
};
