import { ExtendedCommand } from '../../structures/Command'

export default new ExtendedCommand({
  name: 'pause',
  category: 'music',
  description: 'Pause currently playing song',

  run: async ({ client, interaction }) => {
    const queue = client.player.getQueue(interaction.guild)

    if (!queue || !queue.playing) {
      await interaction.reply({ content: `:confused: Nothing is currently playing`, ephemeral: true })
      client.logger.warn('Attempted to pause a song that was not playing')
    }

    queue.setPaused(true)

    await interaction.reply({ content: `**Paused** :pause_button: \`${queue.current.title}\`` })
    return
  },
})
