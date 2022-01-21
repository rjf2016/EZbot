import { Command } from '../../structures/Command'

export default new Command({
	name: 'seek',
	category: 'music',
	description: 'Jump to a time in current song',
	options: [
		{
			name: 'time',
			description: 'The time to jump to (in seconds)',
			type: 'INTEGER',
		},
	]
,
	run: async ({ client, interaction }) => {
		const seconds = interaction.options.getInteger('time')

		await interaction.deferReply();

		const queue = client.player.getQueue(interaction.guildId);
		if (!queue || !queue.playing) return await interaction.followUp({ content: '❌ | No music is being played!' });

		const ms = seconds * 1000;
		await queue.seek(ms);

		interaction.followUp({ content: `✅ | Seeked to ${ms / 1000} seconds` });
	},
})