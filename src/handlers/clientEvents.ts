import { Event, ExtendedClient, logger } from '../structures'
import { ClientEvents } from 'discord.js'
import { promisify } from 'util'
import glob from 'glob'

const globPromise = promisify(glob)

export const registerClientEvents = async (client: ExtendedClient, dir: string) => {
  const eventFiles = await globPromise(`${dir}/../events/client/*{.ts,.js}`)

  eventFiles.forEach(async (filePath: string) => {
    const event: Event<keyof ClientEvents> = (await import(filePath))?.default
    client.on(event.event, event.run)
  })

  logger.info('Registered client events')
}
