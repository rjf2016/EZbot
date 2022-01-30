import { PlayerEvents, Queue, Track } from 'discord-player'
import { GuildTextBasedChannel } from 'discord.js'

export class PlayerEvent<Key extends keyof PlayerEvents> {
  constructor(public event: Key, public run: (queue: Queue<{ channel: GuildTextBasedChannel }>, track: Track) => any) {}
}
