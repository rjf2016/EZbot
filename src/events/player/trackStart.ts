import { MessageEmbed } from 'discord.js'
import { colors } from '../../config'
import { PlayerEvent } from '../../structures/PlayerEvent'

export default new PlayerEvent('trackStart', async (queue, track) => {
  const { title, url, thumbnail, requestedBy, duration } = track
  const embed = new MessageEmbed()
    .setAuthor({ name: 'Now Playing' })
    .setThumbnail(thumbnail)
    .setDescription(
      `**[${
        title.length > 25 ? title.substring(0, 25) + '...' : title
      }](${url})**\n\n \`\` ${duration} \`\`\t\u200b\t\u200b\t${requestedBy}`
    )
    .setColor(colors.main)

  return await queue.metadata.channel.send({ embeds: [embed] })
})
