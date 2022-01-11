import { Player, Queue, Track } from 'discord-player'
import { ColorResolvable, MessageEmbed, TextChannel } from 'discord.js'
import { colors } from '../config'

export const registerPlayerEvents = async (player: Player) => {
  player.on(
    'trackStart',
    async (queue: Queue<{ channel: TextChannel }>, { title, url, thumbnail, requestedBy, duration }: Track) => {
      const nowPlayingEmbed = new MessageEmbed()
        .setAuthor({ name: 'Now Playing' })
        .setThumbnail(`${thumbnail}`)
        .setDescription(`[${title}](${url})\n\n \`\` ${duration} \`\` \t\t\u200b${requestedBy}`)
        .setColor(colors.main as ColorResolvable)
      return await queue.metadata.channel.send({ embeds: [nowPlayingEmbed] })
    }
  )
  player.on(
    'trackAdd',
    async (queue: Queue<{ channel: TextChannel }>, { title, url, thumbnail, requestedBy, duration }: Track) => {
      const nowPlayingEmbed = new MessageEmbed()
        .setAuthor({ name: 'Added to queue' })
        .setThumbnail(`${thumbnail}`)
        .setDescription(`[${title}](${url})\n\n \`\` ${duration} \`\` \t\t\u200b${requestedBy}`)
        .setColor(colors.main)
      return await queue.metadata.channel.send({ embeds: [nowPlayingEmbed] })
    }
  )
}
