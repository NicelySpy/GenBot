const d = require('discord.js');
const translate = require('@iamtraction/google-translate');
module.exports = {
	data: new d.ContextMenuCommandBuilder()
		.setName('translate')
		.setType(d.ApplicationCommandType.Message),
	run: async ({ client, interaction }) => {
		const query = (await interaction.channel.messages.fetch(
			interaction.targetId
		)).content;
		try {
			const translated = await translate(query, { to: 'en' });
			const e = new d.EmbedBuilder().setColor('Purple').addFields([
				{
					name: 'Content',
					value: query,
					inline: true
				},
				{
					name: 'Result',
					value: translated.text,
					inline: true
				},
			]);
			interaction.reply({ embeds: [e] });
		} catch (err) {
			client.errLogger("CommandError", err)
			//console.error('translate:' + err);
		}
	}
};
