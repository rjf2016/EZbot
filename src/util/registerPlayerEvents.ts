import { Player, Queue, Track } from 'discord-player'
import { ColorResolvable, MessageEmbed, TextBasedChannels } from 'discord.js'
import { colors } from '../config'

export const registerPlayerEvents = async (player: Player) => {
  player.on(
    'trackStart',
    async (queue: Queue<{ channel: TextBasedChannels }>, { title, url, thumbnail, requestedBy, duration }: Track) => {
      const nowPlayingEmbed = new MessageEmbed()
        .setAuthor(`Now Playing`)
        .setThumbnail(`${thumbnail}`)
        .setDescription(`[${title}](${url})\n\n \`\` ${duration} \`\` \t\t\u200b${requestedBy}`)
        .setColor(colors.main as ColorResolvable)
      return await queue.metadata.channel.send({ embeds: [nowPlayingEmbed] })
    }
  )
  player.on(
    'trackAdd',
    async (queue: Queue<{ channel: TextBasedChannels }>, { title, url, thumbnail, requestedBy, duration }: Track) => {
      const nowPlayingEmbed = new MessageEmbed()
        .setAuthor(`Added to queue`)
        .setThumbnail(`${thumbnail}`)
        .setDescription(`[${title}](${url})\n\n \`\` ${duration} \`\` \t\t\u200b${requestedBy}`)
        .setColor(colors.main)
      return await queue.metadata.channel.send({ embeds: [nowPlayingEmbed] })
    }
  )
}
