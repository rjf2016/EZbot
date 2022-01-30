import { Command } from '../../structures/Command'

export default new Command({
  name: 'pause',
  category: 'music',
  description: 'Pause currently playing song',

  run: async ({ client, interaction }) => {
    const queue = client.player.getQueue(interaction.guildId)
    if (!queue || !queue.playing) return
    queue.setPaused(true)
    return interaction.reply({ content: `**Paused** :pause_button: \`${queue.current.title}\`` })
  },
})
