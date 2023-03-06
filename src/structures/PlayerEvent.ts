import { GuildQueueEvents } from 'discord-player'

export class PlayerEvent<Key extends keyof GuildQueueEvents> {
  constructor(public event: Key, public run: (...args: Parameters<GuildQueueEvents[Key]>) => unknown) {}
}
