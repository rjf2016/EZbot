import { Player, Queue, Track } from 'discord-player'
import { GuildTextBasedChannel } from 'discord.js'
import { musicMessage } from '../builders/musicEmbed'

const msg = musicMessage()

export const registerPlayerEvents = async (player: Player) => {
  player.on('trackStart', async (queue: Queue<{ channel: GuildTextBasedChannel }>, track: Track) => {
    return await queue.metadata.channel.send(msg.trackStart(track))
  })
  player.on('trackAdd', async (queue: Queue<{ channel: GuildTextBasedChannel }>, track: Track) => {
    return await queue.metadata.channel.send(msg.trackAdd(track))
  })
}
