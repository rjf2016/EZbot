import { ApplicationCommandDataResolvable, Client, ClientEvents, Collection } from 'discord.js'
import { CommandType } from '../types/Command'
import { Player } from 'discord-player'
import glob from 'glob'
import { promisify } from 'util'
import { botToken } from '../util/validateEnv'
import { ClientEvent } from './ClientEvent'
import { RegisterCommandOptions } from '../types/Client'
import Logger from './Logger'
import { registerPlayerEvents } from '../util/registerPlayerEvents'

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
    await this.registerModules()
    await registerPlayerEvents(this.player)
    await this.login(botToken)
  }

  async registerCommands({ commands, guildId }: RegisterCommandOptions) {
    // if (guildId !== null && !isProd) {
    // Then bots commands will be registered to a Guild; Useful for testing
    const singleGuild = this.guilds.cache.get(guildId)
    singleGuild?.commands.set(commands)
    console.log(`Registering commands to guild: ${singleGuild.name}`)
    // } else {
    //   // Then bots commands will be globally registered
    //   this.application?.commands.set(commands)
    //   console.log('Registering commands globally 🌎')
    // }
  }

  async registerModules() {
    const slashCommands: ApplicationCommandDataResolvable[] = []
    const commandFiles = await globPromise(`${__dirname}/../commands/*/*{.ts,.js}`)
    commandFiles.forEach(async (filePath: string) => {
      const command: CommandType = (await import(filePath))?.default
      if (!command.name) return
      this.commands.set(command.name, command)
      slashCommands.push(command)
    })

    const clientEventFiles = await globPromise(`${__dirname}/../events/client/*{.ts,.js}`)
    clientEventFiles.forEach(async (filePath: string) => {
      const event: ClientEvent<keyof ClientEvents> = (await import(filePath))?.default
      this.on(event.event, event.run)
    })
  }
}
