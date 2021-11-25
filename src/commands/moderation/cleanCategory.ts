import { Command } from '../../structures/Command'
import { protectedChannels } from '../../../config.json'
import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';

export default new Command({
	name: 'clean',
	description: 'Delete a channel or category',
	options: [
		{
			name: 'channel',
			description: 'Delete a channel',
			type: 'SUB_COMMAND',
			options: [
				{
					name: 'channel',
					description: 'The channel to delete',
					type: 'CHANNEL',
					required: true,
					channelTypes: [ 'GUILD_TEXT','GUILD_VOICE' ],
				}
			]
		},
		{
			name: 'category',
			description: 'Delete all channels within a category',
			type: 'SUB_COMMAND',
			options: [
				{
					name: 'category',
					description: 'The channel to delete',
					type: 'CHANNEL',
					required: true,
					channelTypes: [ 'GUILD_CATEGORY' ],
				}
			]
		}
	],

	run: async ({ interaction }) => {
		const subCommand: string = interaction.options.getSubcommand();
		const deletable: string[] = []

		const row = new MessageActionRow()
		.addComponents(
			new MessageButton()
				.setCustomId('confirm')
				.setLabel('Just do it')
				.setStyle('SUCCESS'),
			new MessageButton()
				.setCustomId('cancel')
				.setLabel('Marty Im scared')
				.setStyle('DANGER'),
		);
		const confirmDelete = target => interaction.reply({ content: `Are you sure you want to delete the channel: <#${target}> ?\n This action is __not__ reversible`, components: [row], ephemeral: true })

		if (subCommand === 'channel') {
			const CHANNEL = interaction.options.getChannel('channel')
			if (protectedChannels.includes(CHANNEL.name)) {
				return interaction.reply({ content: `❌ Can't delete the channel: **${CHANNEL.name}** because it's listed as a protected channel`, ephemeral: true })
			}
			await confirmDelete(CHANNEL.id)


		}


	}
})