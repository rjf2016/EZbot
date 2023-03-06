import { Logger, ExtendedCommand } from '../../structures'

export default new ExtendedCommand({
  name: 'pause',
  category: 'music',
  description: 'Pause currently playing song',

  run: async ({ client, interaction }) => {
    const queue = client.player.nodes.get(interaction.guild)

    if (!queue || !queue.node.isPlaying()) {
      Logger.warn('Attempted to pause a song that was not playing')
      await interaction.reply({ content: `:confused: Nothing is currently playing`, ephemeral: true })
      return
    }

    const current = queue.currentTrack
    queue.node.pause()

    await interaction.reply({ content: `**Paused** :pause_button: \`${current.title}\`` })
  },
})
