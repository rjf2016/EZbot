import { Player, Queue, Track } from 'discord-player'
import { MessageEmbed, TextChannel } from 'discord.js'
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
        .setColor(colors.main)
      return await queue.metadata.channel.send({ embeds: [nowPlayingEmbed] })
    }
  )
  player.on('trackAdd', async (queue: Queue<{ channel: TextChannel }>, { title }: Track) => {
    return await queue.metadata.channel.send({ content: `**Added** ⏱️ \`${title}\` - to the **queue**!` })
  })

  player.on('error', async (queue: Queue<{ channel: TextChannel }>, error: Error) => {
    console.log(`[${queue.guild.name}] Error emitted from the queue: ${error.message}`)
  })

  player.on('connectionError', (queue, error) => {
    console.log(`[${queue.guild.name}] Error emitted from the connection: ${error.message}`)
  })

  player.on('botDisconnect', () => {
    console.log('❌ | I was manually disconnected from the voice channel, clearing queue!')
  })

  player.on('channelEmpty', () => {
    console.log('❌ | Nobody is in the voice channel, leaving...')
  })

  player.on('queueEnd', () => {
    console.log('✅ | Queue finished!')
  })
}
