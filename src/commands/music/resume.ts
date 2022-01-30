import { Command } from '../../structures/Command'

export default new Command({
  name: 'resume',
  category: 'music',
  description: 'Resume the currently paused song',

  run: async ({ client, interaction }) => {
    const queue = client.player.getQueue(interaction.guildId)
    if (!queue || !queue.playing) return
    queue.setPaused(false)
    return interaction.reply({ content: `**Resume** :arrow_forward: \`${queue.current.title}\`` })
  },
})
