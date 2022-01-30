import { ClientEvents } from 'discord.js'

export class ClientEvent<Key extends keyof ClientEvents> {
  constructor(public event: Key, public run: (...args: ClientEvents[Key]) => any) {}
}
