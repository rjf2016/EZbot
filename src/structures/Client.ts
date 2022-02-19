import { ApplicationCommandDataResolvable, Client, ClientEvents, Collection } from 'discord.js'
import { CommandType } from '../types/Command'
import { promisify } from 'util'
import { botToken, isProd, serverId } from '../util/validateEnv'
import { ClientEvent } from './ClientEvent'
import glob from 'glob'
import logger from './Logger'

const globPromise = promisify(glob)

export default class EZclient extends Client {
  commands: Collection<string, CommandType> = new Collection()

  constructor() {
    super({ intents: 1665 })
  }

  start() {
    this.login(botToken)
    this.registerModules(isProd)
    this.registerClientEvents()
  }

  async registerClientEvents() {
    const clientEventFiles = await globPromise(`${__dirname}/../events/client/*{.ts,.js}`)
    clientEventFiles.forEach(async (filePath: string) => {
      const event: ClientEvent<keyof ClientEvents> = (await import(filePath))?.default
      this.on(event.event, event.run)
    })
  }

  async registerModules(global: boolean) {
    const slashCommands: ApplicationCommandDataResolvable[] = []
    const commandFolders = !global ? '*' : '!(devel)'
    const commandFiles = await globPromise(`${__dirname}/../commands/${commandFolders}/*{.ts,.js}`)
    commandFiles.forEach(async (filePath: string) => {
      const command: CommandType = (await import(filePath))?.default
      if (!command.name) {
        logger.error(`Failed to load command from ${command}`)
        return
      }
      this.commands.set(command.name, command)
      slashCommands.push(command)
    })

    this.on('ready', async () => {
      logger.info(`Started ${this.user.username}`)
      if (global) {
        await this.application.commands.set(slashCommands).catch((error) => {
          logger.error(`Failed to register global commands! ${error}`)
          return
        })
        logger.info('Registered commands globally! 🌎')
      } else {
        this.guilds.cache.get(serverId).commands.set(slashCommands)
        logger.info(`Registered ${[...slashCommands].length} commands to guild`)
      }
    })
  }
}
