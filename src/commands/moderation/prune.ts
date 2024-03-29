import { ApplicationCommandOptionType, ApplicationCommandType } from 'discord.js'
import { Logger } from '../../structures'
import { ExtendedCommand } from '../../structures/Command'

export default new ExtendedCommand({
  name: 'prune',
  category: 'moderation',
  description: 'Deletes previous messages in current text channel',
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: 'amount',
      description: 'Amount of messages to delete',
      type: ApplicationCommandOptionType.Number,
      required: true,
    },
  ],

  run: async ({ interaction }) => {
    const amount = interaction.options.getNumber('amount')
    await interaction.deferReply()
    if (isNaN(amount)) return await interaction.reply('Thats not a number!')
    if (amount < 1 || amount > 99) {
      await interaction.reply(
        "The number of messages must be between 1 and 99! (These are Discord's rules, not mine😅)"
      )
      return
    }
    try {
      await interaction.channel.bulkDelete(amount)
    } catch (err) {
      Logger.error(err)
    }
  },
})
