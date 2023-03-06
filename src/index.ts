import { ExtendedClient } from './structures/Client'
import { Player as DiscordPlayer } from 'discord-player'

const client = ExtendedClient.getInstance()
const player = DiscordPlayer.singleton(client, {
  ytdlOptions: {
    filter: 'audioonly',
    highWaterMark: 1 << 30,
    dlChunkSize: 0,
  },
})

client.start()

export { client, player }
