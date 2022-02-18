if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

import EZclient from './structures/Client'
import { Player } from 'discord-player'
import { registerPlayerEvents } from './util/registerPlayerEvents'

const client = new EZclient()
const player = new Player(client, {
  ytdlOptions: {
    filter: 'audioonly',
    highWaterMark: 1 << 30,
    dlChunkSize: 0,
  },
})

client.start()
registerPlayerEvents(player)

export { client, player }
