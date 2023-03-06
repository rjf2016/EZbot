import { Logger, ExtendedCommand } from '../../structures'
import { useQueue } from 'discord-player'

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
    const channel = interaction.member.voice.channel
    if (!channel) {
      return interaction.reply({
        content: 'You are not in a voice channel!',
        ephemeral: true,
      })
    }

    const queue = client.player.queues.get(interaction.guild.id)
    console.log(queue.node)

    if (!queue || !queue.node.isPlaying) {
      Logger.error('Unable to find queue')
      return interaction.reply({
        content: '👁️',
        ephemeral: true,
      })
    }

    try {
      await client.player.queues.get(interaction.guild.id).node.seek(timestamp)
    } catch (error) {
      Logger.error('Failed to seek given time', error)
    }

    const prettySeconds = input.seconds.toString().length < 2 ? `0${input.seconds}` : input.seconds

    await interaction.reply({ content: `:fast_forward:  \`${input.minutes}:${prettySeconds}\`` })
  },
})
