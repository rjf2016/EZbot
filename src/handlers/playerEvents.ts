import { Player, Queue, Track } from 'discord-player'
import { EmbedBuilder, TextChannel } from 'discord.js'
import { colors } from '../config'
import { client } from '..'

export const registerPlayerEvents = (player: Player) => {
  player.on(
    'trackStart',
    (queue: Queue<{ channel: TextChannel }>, { title, url, thumbnail, requestedBy, duration }: Track) => {
      const nowPlayingEmbed = new EmbedBuilder()
        .setAuthor({ name: 'Now Playing' })
        .setThumbnail(thumbnail)
        .setDescription(
          `**[${
            title.length > 50 ? title.substring(0, 50) + '...' : title
          }](${url})**\n\n \`\` ${duration} \`\`\t\u200b\t\u200b\t${requestedBy}`
        )
        .setColor(colors.ezRed)
      queue.metadata.channel.send({ embeds: [nowPlayingEmbed] })
    }
  )
  player.on('trackAdd', (queue: Queue<{ channel: TextChannel }>, track: Track) => {
    const current = queue.nowPlaying()
    if (current !== track) {
      client.logger.info('Track added to queue ')
      queue?.metadata.channel.send({
        content: `**Added** ⏱️ \`${track.title}\` - to the **queue**!`,
      })
    }
  })

  player.on('error', (queue: Queue<{ channel: TextChannel }>, error) => {
    client.logger.error(error, `PLAYER ERROR emitted from: ${queue.guild.name} `)
    queue.metadata.channel.send({
      content: `🤮 I ran into an error trying to play that song`,
    })
  })

  player.on('connectionError', (queue, error) => {
    client.logger.error(error, `PLAYER CONNECTION ERROR emitted from: ${queue.guild.name} `)
  })

  player.on('botDisconnect', async () => {
    client.logger.info('❌ | I was manually disconnected from the voice channel, clearing queue! ')
  })

  player.on('channelEmpty', () => {
    client.logger.info('❌ | Nobody is in the voice channel, leaving... ')
  })

  player.on('queueEnd', () => {
    client.logger.info('✅ | Queue finished! ')
  })
}
