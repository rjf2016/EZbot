import { ExtendedCommand } from '../../structures/Command'

export default new ExtendedCommand({
  name: 'seek',
  category: 'music',
  description: 'Jump to a time in current song',
  options: [
    {
      name: 'minutes',
      description: 'Timestamp (minutes)',
      type: 4,
      required: true,
      min_value: 0,
      max_value: 120,
    },
    {
      name: 'seconds',
      description: 'Timestamp (seconds)',
      type: 4,
      required: true,
      min_value: 0,
      max_value: 59,
    },
  ],
  run: async ({ client, interaction }) => {
    const input = {
      minutes: interaction.options.getInteger('minutes'),
      seconds: interaction.options.getInteger('seconds'),
    }

    const timestamp = input.minutes * 60000 + input.seconds * 1000

    const queue = client.player.getQueue(interaction.guild)
    if (!queue || !queue.playing) {
      client.logger.error('Unable to find queue')
      await interaction.reply({
        content: '👁️',
        ephemeral: true,
      })
      return
    }

    try {
      await queue.seek(timestamp)
    } catch (error) {
      client.logger.error('Failed to seek given time', error)
    }

    const prettySeconds = input.seconds.toString().length < 2 ? `0${input.seconds}` : input.seconds

    await interaction.reply({ content: `:fast_forward:  \`${input.minutes}:${prettySeconds}\`` })
    return
  },
})
