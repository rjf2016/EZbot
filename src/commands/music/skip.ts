import { ExtendedCommand } from '../../structures/Command'

export default new ExtendedCommand({
  name: 'skip',
  category: 'music',
  description: 'skip current song',

  run: async ({ client, interaction }) => {
    if (!interaction.member.voice.channelId) {
      await interaction.reply({
        content: 'You are not in my voice channel!',
        ephemeral: true,
      })
      return
    }

    const queue = client.player.getQueue(interaction.guild)

    if (!queue || !queue.playing) {
      await interaction.reply({
        content: 'No songs are currently playing',
        ephemeral: true,
      })
      return
    }

    const current = queue.current.title

    try {
      queue.skip()
    } catch (error) {
      client.logger.error(error)
    }

    await interaction.reply({ content: ` **Skipped** ⏩ ~~\`${current}\`~~` })
  },
})
