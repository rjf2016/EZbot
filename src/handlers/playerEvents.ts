import { Player, Queue, Track } from 'discord-player'
import { MessageEmbed, TextChannel } from 'discord.js'
import { colors } from '../config'
import { logger } from '../structures'

export const registerPlayerEvents = (player: Player) => {
  player.on(
    'trackStart',
    (queue: Queue<{ channel: TextChannel }>, { title, url, thumbnail, requestedBy, duration }: Track) => {
      const nowPlayingEmbed = new MessageEmbed()
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
      logger.info('Track added to queue ')
      queue?.metadata.channel.send({
        content: `**Added** ⏱️ \`${track.title}\` - to the **queue**!`,
      })
    }
  })

  player.on('error', (queue: Queue<{ channel: TextChannel }>, error: Error) => {
    logger.error(`PLAYER ERROR emitted from: ${queue.guild.name} `, error)
    const message = queue.tracks.length > 1 ? 'skip it' : 'end the concert'
    queue.metadata.channel.send({
      content: `🤮 I ran into an error trying to play that song, so I had to ${message}.
    Feel free to try playing that song again, but if it fails again - I may just be incapable of playing it`,
    })
  })

  player.on('connectionError', (queue, error) => {
    logger.error(`PLAYER CONNECTION ERROR emitted from: ${queue.guild.name} `, error)
  })

  player.on('botDisconnect', (queue) => {
    logger.info('❌ | I was manually disconnected from the voice channel, clearing queue! ')
  })

  player.on('channelEmpty', () => {
    logger.info('❌ | Nobody is in the voice channel, leaving... ')
  })

  player.on('queueEnd', (queue) => {
    logger.info('✅ | Queue finished! ')
  })
}
