module.exports = {
  name: "kick",
  description: "Kick Member Di Server Ini",
  userPermissions: ["KICK_MEMBERS"],
  options: [
    {
      name: "user",
      description: "User yang ingin dikick",
      type: "USER",
      required: true,
    },
    {
      name: "alasan",
      description: "Alasannya apa?",
      type: "STRING",
      required: false,
    },
  ],
  run: async ({ interaction }) => {
    // const aku = interaction.user;
    const target = interaction.options.getMember("user");
    const reason = interaction.options.getString("alasan") || "Tanpa alasan";
    const dia = interaction.member;
    // if(target.roles.highest.position >= aku.roles.highest.position)
    //         return interaction.followUp({ content: `Maaf, Role \`\`\`${target.tag}\`\`\` terlalu tinggi daripada Role Saya` })
    if (
      target.roles.highest.position >= interaction.member.roles.highest.position
    ) {
      return interaction.reply({
        content: `Maaf, Role \`\`\`${target.user.tag}\`\`\` terlalu tinggi daripada Role Anda`,
      });
    }
    await target.send(
      `Hai, Kamu telah dikick dari server ${interaction.guild.name}\n Yang mengkick Anda: ${dia.tag}\nDengan alasan: ${reason}`
    );
    target.kick(reason);
    interaction.reply({
      content: `Kicked ${target.user.tag} Sukses!, Alasan: ${reason}`,
    });
  },
};
