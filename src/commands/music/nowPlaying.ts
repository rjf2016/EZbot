import { EmbedBuilder } from 'discord.js'
import { colors } from '../../config'
import { ExtendedCommand } from '../../structures/Command'

export default new ExtendedCommand({
  name: 'nowplaying',
  category: 'music',
  description: 'View the currently playing song',

  run: async ({ client, interaction }) => {
    const queue = client.player.getQueue(interaction.guild)
    if (!queue || !queue.playing) return await interaction.reply(':cricket:')

    const progress = queue.createProgressBar({ timecodes: true, length: 8 })

    const embed = new EmbedBuilder()
      .setDescription(`**[${queue.current.title}](${queue.current.url})**`)
      .setThumbnail(queue.current.thumbnail)
      .setFields([
        {
          name: '\u200b',
          value: progress.replace(/ 0:00/g, ' ◉ LIVE'),
        },
      ])
      .setColor(colors.main)

    await interaction.reply({ embeds: [embed] })
  },
})
