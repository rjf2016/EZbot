import { Command } from '../../structures/Command'

export default new Command({
	name: 'prune',
	description: 'Deletes previous messages in current text channel',
	type: 1,
	options: [
		{
			name: 'amount',
			description: 'Amount of messages to delete',
			type: 'NUMBER',
			required: true,
		}
	],
	run: async ({ interaction }) => {
		const amount = interaction.options.getNumber('amount')
		if (isNaN(amount)) return interaction.followUp('Thats not a number!')
		if (amount <= 1 && amount > 500) return interaction.followUp('The number of messages must be between 1 and 500!')
		interaction.deferReply({ ephemeral: true }).catch(() => {})
		try {
			await interaction.channel.bulkDelete(amount, true)
		} catch (err) {
			console.error(err)
			await interaction.editReply(`Failed to prune messages`)
		}
		await interaction.editReply(`Successfully pruned ${amount} messages`)
		return
	}
})
