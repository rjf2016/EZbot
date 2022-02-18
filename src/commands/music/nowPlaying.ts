import { MessageEmbed } from 'discord.js'
import { player } from '../..'
import { colors } from '../../config'
import { Command } from '../../structures/Command'

export default new Command({
  name: 'nowplaying',
  category: 'music',
  description: 'View the currently playing song',

  run: async ({ interaction }) => {
    const queue = player.getQueue(interaction.guild)
    if (!queue || !queue.playing) return await interaction.reply(':cricket:')

    const progress = queue.createProgressBar({ timecodes: true, length: 8 })

    const embed = new MessageEmbed()
      .setDescription(`**[${queue.current.title}](${queue.current.url})**`)
      .setThumbnail(queue.current.thumbnail)
      .setFields([
        {
          name: '\u200b',
          value: progress.replace(/ 0:00/g, ' ◉ LIVE'),
        },
      ])
      .setColor(colors.main)

    return await interaction.reply({ embeds: [embed] })
  },
})
