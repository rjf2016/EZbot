import { Logger, ExtendedCommand } from '../../structures'

export default new ExtendedCommand({
  name: 'skip',
  category: 'music',
  description: 'Skip current song',

  run: async ({ client, interaction }) => {
    const queue = client.player.nodes.get(interaction.guildId)

    if (!interaction.member.voice.channel) {
      return interaction.reply({
        content: 'You are not in my voice channel!',
        ephemeral: true,
      })
    }

    if (!queue || !queue.isPlaying) {
      return interaction.reply({
        content: 'No songs are currently playing',
        ephemeral: true,
      })
    }

    const current = queue.currentTrack

    try {
      queue.node.skip()
    } catch (error) {
      Logger.error(error)
    }

    await interaction.reply({ content: ` **Skipped** ⏩ ~~\`${current}\`~~` })
  },
})
