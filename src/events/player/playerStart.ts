import { GuildQueue } from 'discord-player'
import { EmbedBuilder } from 'discord.js'
import { colors } from '../../config'
import { PlayerEvent } from '../../structures'
import { ExtendedInteraction } from '../../types/Command'

export default new PlayerEvent('playerStart', async (queue: GuildQueue<ExtendedInteraction>, track) => {
  const nowPlayingEmbed = new EmbedBuilder()
    .setAuthor({ name: 'Now Playing' })
    .setThumbnail(track.thumbnail)
    .setDescription(
      `**[${track.title.length > 50 ? track.title.substring(0, 50) + '...' : track.title}](${track.url})**\n\n \`\` ${
        track.duration
      } \`\`\t\u200b\t\u200b\t${track.requestedBy}`
    )
    .setColor(colors.main)

  queue.metadata.channel.send({ embeds: [nowPlayingEmbed] })
})
