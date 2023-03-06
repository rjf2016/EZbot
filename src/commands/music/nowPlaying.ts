import { EmbedBuilder } from 'discord.js'
import { colors } from '../../config'
import { ExtendedCommand } from '../../structures'
import { useQueue } from 'discord-player'

export default new ExtendedCommand({
  name: 'nowplaying',
  category: 'music',
  description: 'View the currently playing song',

  run: async ({ interaction }) => {
    const queue = useQueue(interaction.guild.id)
    if (!queue || !queue.isPlaying) return interaction.reply(':cricket:')

    const progress = queue.node.createProgressBar({ timecodes: true, length: 8 })
    const track = queue.currentTrack

    const embed = new EmbedBuilder()
      .setDescription(`**[${track.title}](${track.url})**`)
      .setThumbnail(track.thumbnail)
      .setFields([
        {
          name: '\u200b',
          value: progress.replace(/ 0:00/g, ' ◉ LIVE'),
        },
      ])
      .setColor(colors.main)

    return interaction.reply({ embeds: [embed] })
  },
})
