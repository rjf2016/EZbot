import { Player } from 'discord-player'
import { client } from '..'

export default new Player(client, {
  ytdlOptions: {
    quality: 'highestaudio',
    highWaterMark: 1 << 25,
  },
})
