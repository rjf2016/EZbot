import { Player, Queue, Track } from 'discord-player'
import { MessageEmbed, TextChannel } from 'discord.js'
import { client } from '..'
import { colors } from '../config'

export const registerPlayerEvents = async (player: Player) => {
  player.on(
    'trackStart',
    async (queue: Queue<{ channel: TextChannel }>, { title, url, thumbnail, requestedBy, duration }: Track) => {
      const nowPlayingEmbed = new MessageEmbed()
        .setAuthor({ name: 'Now Playing' })
        .setThumbnail(thumbnail)
        .setDescription(
          `**[${
            title.length > 25 ? title.substring(0, 25) + '...' : title
          }](${url})**\n\n \`\` ${duration} \`\`\t\u200b\t\u200b\t${requestedBy}`
        )
        .setColor(colors.ezRed)
      await queue.metadata.channel.send({ embeds: [nowPlayingEmbed] })
    }
  )
  player.on('trackAdd', async (queue: Queue<{ channel: TextChannel }>, { title }: Track) => {
    client.logger.info('Track added to queue ', { TRACK: title, QUEUE: queue })
    await queue?.metadata.channel.send({
      content: `**Added** ⏱️ \`${title}\` - to the **queue**!`,
    })
  })

  player.on('error', async (queue: Queue<{ channel: TextChannel }>, error: Error) => {
    client.logger.error(`PLAYER ERROR emitted from: ${queue.guild.name} `, error)
    const message = queue.tracks.length > 1 ? 'skip it' : 'end the concert'
    await queue.metadata.channel.send({
      content: `🤮 I ran into an error trying to play that song, so I had to ${message}.
    Feel free to try playing that song again, but if it fails again - I may just be incapable of playing it`,
    })
  })

  player.on('connectionError', (queue, error) => {
    client.logger.error(`PLAYER CONNECTION ERROR emitted from: ${queue.guild.name} `, error)
  })

  player.on('botDisconnect', async (queue) => {
    client.logger.info('❌ | I was manually disconnected from the voice channel, clearing queue! ', queue)
  })

  player.on('channelEmpty', () => {
    client.logger.info('❌ | Nobody is in the voice channel, leaving... ', client.player)
  })

  player.on('queueEnd', (queue) => {
    client.logger.info('✅ | Queue finished! ', queue)
  })
}
