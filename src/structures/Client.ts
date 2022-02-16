import { ApplicationCommandDataResolvable, Client, ClientEvents, Collection } from 'discord.js'
import { CommandType } from '../types/Command'
import { Player } from 'discord-player'
import { promisify } from 'util'
import { botToken, isProd, serverId } from '../util/validateEnv'
import { ClientEvent } from './ClientEvent'
import { registerPlayerEvents } from '../util/registerPlayerEvents'
import Logger from './Logger'
import glob from 'glob'

const globPromise = promisify(glob)

export default class EZclient extends Client {
  commands: Collection<string, CommandType> = new Collection()
  logger: Logger = new Logger()
  player: Player = new Player(this, {
    ytdlOptions: {
      filter: 'audioonly',
      highWaterMark: 1 << 30,
      dlChunkSize: 0,
    },
  })

  constructor() {
    super({ intents: 1665 })
  }

  async start() {
    await this.registerClientEvents()
    await registerPlayerEvents(this.player)
    await this.login(botToken)
    await this.registerCommands(isProd)
  }

  async registerClientEvents() {
    const clientEventFiles = await globPromise(`${__dirname}/../events/client/*{.ts,.js}`)
    clientEventFiles.forEach(async (filePath: string) => {
      const event: ClientEvent<keyof ClientEvents> = (await import(filePath))?.default
      this.on(event.event, event.run)
    })
  }

  async registerCommands(global?: boolean) {
    const slashCommands: ApplicationCommandDataResolvable[] = []
    const commandFolders = !global ? '*' : '(info|moderation|music|utility)'
    const commandFiles = await globPromise(`${__dirname}/../commands/${commandFolders}/*{.ts,.js}`)
    commandFiles.forEach(async (filePath: string) => {
      const command: CommandType = (await import(filePath))?.default
      if (!command.name) return
      this.commands.set(command.name, command)
      slashCommands.push(command)
    })

    if (global) {
      this.application.commands.set(slashCommands).catch((err) => {
        this.logger.fatal('Failed to register global commands! ', err)
        return
      })
      this.logger.info('Registered commands globally! 🌎')
    } else {
      const guild = this.guilds.cache.get(serverId)
      guild.commands.set(slashCommands).catch((err) => {
        this.logger.fatal(`Failed to register commands to guild! `, err)
        return
      })
      const cmd = await guild.commands.fetch()
      this.logger.info(`Registered `, [...cmd])
    }
  }
}
