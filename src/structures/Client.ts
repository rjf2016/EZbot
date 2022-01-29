import { ApplicationCommandDataResolvable, Client, ClientEvents, Collection } from 'discord.js'
import { CommandType } from '../types/Command'
import glob from 'glob'
import { promisify } from 'util'
import { botToken, isProd, serverId } from '../util/validateEnv'
import { Event } from './Event'
import { RegisterCommandOptions } from '../types/Client'
import { Player } from 'discord-player'
import { registerPlayerEvents } from '../util/registerPlayerEvents'
import { displayProd } from '../util/startLogger'

const globPromise = promisify(glob)

export default class ExtendedClient extends Client {
  commands: Collection<string, CommandType> = new Collection()
  player: Player = new Player(this, {
    ytdlOptions: {
      quality: 'highestaudio',
      highWaterMark: 1 << 30,
      dlChunkSize: 0,
    },
  })

  constructor() {
    super({ intents: 1677 })
  }

  async start() {
    console.clear()
    console.log(`${isProd ? displayProd : 'EZ-Beta ...'}`)
    await this.registerModules()
    await registerPlayerEvents(this.player)
    await this.login(botToken)
  }

  async importFile(filePath: string) {
    return (await import(filePath))?.default
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
    // Commands
    const slashCommands: ApplicationCommandDataResolvable[] = []
    const commandFiles = await globPromise(`${__dirname}/../commands/*/*{.ts,.js}`)
    commandFiles.forEach(async (filePath: string) => {
      const command: CommandType = await this.importFile(filePath)
      if (!command.name) return
      this.commands.set(command.name, command)
      slashCommands.push(command)
    })

    // Events
    const eventFiles = await globPromise(`${__dirname}/../events/*{.ts,.js}`)
    eventFiles.forEach(async (filePath: string) => {
      const event: Event<keyof ClientEvents> = await this.importFile(filePath)
      this.on(event.event, event.run)
    })
    // return slashCommands
    this.on('ready', () => {
      this.registerCommands({
        commands: slashCommands,
        guildId: serverId,
      })
    })
  }
}
