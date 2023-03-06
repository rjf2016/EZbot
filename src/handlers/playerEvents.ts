import { PlayerEvent, Logger } from '../structures'
import { promisify } from 'util'
import glob from 'glob'
import { GuildQueueEvents, Player } from 'discord-player'
import { ExtendedInteraction } from '../types/Command'

const globPromise = promisify(glob)

export const registerPlayerEvents = async (player: Player, dir: string) => {
  const eventFiles = await globPromise(`${dir}/../events/player/*{.ts,.js}`)

  eventFiles.forEach(async (filePath: string) => {
    const event: PlayerEvent<keyof GuildQueueEvents<ExtendedInteraction>> = (await import(filePath))?.default
    player.events.on(event.event, event.run)
  })

  Logger.info('Registered player events')
}
