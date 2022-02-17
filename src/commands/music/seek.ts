import { Command } from '../../structures/Command'
import logger from '../../structures/Logger'

export default new Command({
  name: 'seek',
  category: 'music',
  description: 'Jump to a time in current song',
  options: [
    {
      name: 'time',
      description: 'The time to jump to (in seconds)',
      type: 'INTEGER',
      required: true,
    },
  ],
  run: async ({ client, interaction }) => {
    const seconds = interaction.options.getInteger('time')

    const queue = client.player.getQueue(interaction.guild.id)
    if (!queue || !queue.playing) {
      logger.error('Unable to find queue', queue)
    }

    const ms = seconds * 1000
    await queue.seek(ms)
    const date = new Date(ms)

    return await interaction.reply({ content: `**Seek** :fast_forward: \`${date.getMinutes()}:${date.getSeconds()}\`` })
  },
})
