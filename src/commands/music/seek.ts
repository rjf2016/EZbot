import { Command } from '../../structures/Command'

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

    const queue = client.player.getQueue(interaction.guildId)
    if (!queue || !queue.playing) return

    const ms = seconds * 1000
    await queue.seek(ms)
    const date = new Date(ms)

    return await interaction.reply({ content: `**Seek** :fast_forward: \`${date.getMinutes()}:${date.getSeconds()}\`` })
  },
})
