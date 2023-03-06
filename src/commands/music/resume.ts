import { ExtendedCommand, Logger } from '../../structures'
import { useQueue } from 'discord-player'

export default new ExtendedCommand({
  name: 'resume',
  category: 'music',
  description: 'Resume the currently paused song',

  run: async ({ interaction }) => {
    const channel = interaction.member.voice.channel
    if (!channel)
      return interaction.reply({
        content: 'You are not in a voice channel!',
        ephemeral: true,
      })

    const queue = useQueue(interaction.guild.id)

    if (!queue || !queue.isPlaying() || !queue.node.isPaused) {
      return interaction.reply({ content: `:confused: You can't resume what isn't paused`, ephemeral: true })
    }

    try {
      queue.node.resume()
      return interaction.reply({ content: `**Resume** :arrow_forward: \`${queue.currentTrack}\`` })
    } catch (error) {
      Logger.error(error)
      return interaction.reply({ content: `❌ Failed to resume song` })
    }
  },
})
