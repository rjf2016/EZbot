import { ApplicationCommandOptionType } from 'discord.js'
import { ExtendedCommand } from '../../structures/Command'

export default new ExtendedCommand({
  name: 'seek',
  category: 'music',
  description: 'Jump to a time in current song',
  options: [
    {
      name: 'time',
      description: 'The time to jump to (in seconds)',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  run: async ({ client, interaction }) => {
    const seconds = interaction.options.getInteger('time')

    const queue = client.player.getQueue(interaction.guild)
    if (!queue || !queue.playing) {
      client.logger.error('Unable to find queue', queue)
    }

    const ms = seconds * 1000

    try {
      await queue.seek(ms)
    } catch (error) {
      client.logger.error('Failed to seek given time', error)
    }

    const date = new Date(ms)

    await interaction.reply({ content: `**Seek** :fast_forward: \`${date.getMinutes()}:${date.getSeconds()}\`` })
    return
  },
})
