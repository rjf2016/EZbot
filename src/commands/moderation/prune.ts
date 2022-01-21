import { Command } from '../../structures/Command'

export default new Command({
  name: 'prune',
  category: 'moderation',
  description: 'Deletes previous messages in current text channel',
  type: 1,
  options: [
    {
      name: 'amount',
      description: 'Amount of messages to delete',
      type: 'NUMBER',
      required: true,
    },
  ],

  run: async ({ interaction }) => {
    const amount = interaction.options.getNumber('amount')
    await interaction.deferReply()
    if (isNaN(amount)) return await interaction.reply('Thats not a number!')
    if (amount < 1 || amount > 99)
      return await interaction.reply(
        "The number of messages must be between 1 and 99! (These are Discord's rules, not mine😅)"
      )
    try {
      await interaction.channel.bulkDelete(amount)
    } catch (err) {
      console.error(err)
    }
  },
})
