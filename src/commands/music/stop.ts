import { ExtendedCommand } from '../../structures'
import { useQueue } from 'discord-player'

export default new ExtendedCommand({
  name: 'stop',
  category: 'music',
  description: 'Stop playing and delete the queue',

  run: async ({ interaction }) => {
    const channel = interaction.member.voice.channel
    if (!channel)
      return interaction.reply({
        content: 'You are not in a voice channel!',
        ephemeral: true,
      })

    const queue = useQueue(interaction.guild.id)

    if (!queue || !queue.currentTrack) {
      return interaction.reply({ content: `:confused: Nothing is currently playing`, ephemeral: true })
    }

    queue.delete()

    return interaction.reply({ content: `The **queue** has been **cleared**!` })
  },
})
