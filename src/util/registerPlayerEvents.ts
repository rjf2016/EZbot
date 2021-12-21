import { Player, Queue, Track } from 'discord-player'
import { ColorResolvable, MessageEmbed, TextBasedChannels } from 'discord.js'
import { colors } from '../../config.json'

export const registerPlayerEvents = async (player: Player) => {
  player.on(
    'trackStart',
    async (queue: Queue<{ channel: TextBasedChannels }>, { title, url, thumbnail, requestedBy, duration }: Track) => {
      const nowPlayingEmbed = new MessageEmbed()
        .setTitle(`Now Playing`)
        .setThumbnail(`${thumbnail}`)
        .setDescription(`[${title}](${url})`)
        .addFields(
          { name: '\u200b', value: `\`\`${duration}\`\`\t\t`, inline: true },
          { name: '\u200b', value: `\t\t${requestedBy}`, inline: true }
        )
        .setColor(colors.default as ColorResolvable)
      return await queue.metadata.channel.send({ embeds: [nowPlayingEmbed] })
    }
  )
  player.on(
    'trackAdd',
    async (queue: Queue<{ channel: TextBasedChannels }>, { title, url, thumbnail, requestedBy, duration }: Track) => {
      const nowPlayingEmbed = new MessageEmbed()
        .setTitle(`Added to queue`)
        .setThumbnail(`${thumbnail}`)
        .setDescription(`\`\`${duration}\`\` \u200b - \u200b ${requestedBy}`)
        .setColor(colors.default as ColorResolvable)
      return await queue.metadata.channel.send({ embeds: [nowPlayingEmbed] })
    }
  )
}
