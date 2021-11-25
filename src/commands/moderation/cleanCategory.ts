import { Command } from '../../structures/Command'
import { protectedChannels } from '../../../config.json'

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
					name: 'channelname',
					description: 'The channel to delete',
					type: 'CHANNEL',
					required: true,
					channelTypes: [ 'GUILD_TEXT','GUILD_VOICE' ],
				}
			]
		},
		{
			name: 'category',
			description: 'Delete a category',
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
		const CHANNEL = interaction.options.getChannel('channel')
		console.log(CHANNEL)

	}
})