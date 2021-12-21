import { ApplicationCommandDataResolvable, Client, ClientEvents, Collection } from 'discord.js'
import { CommandType } from '../types/Command'
import glob from 'glob'
import { promisify } from 'util'
import { validateEnv } from '../util/validateEnv'
import { Event } from './Event'
import { cyanBright, green } from 'chalk'
import { RegisterCommandOptions } from '../types/Client'
import mongoose, { ConnectOptions } from 'mongoose'
import { Player } from 'discord-player'
import { registerPlayerEvents } from '../util/registerPlayerEvents'

const globPromise = promisify(glob)

export default class ExtendedClient extends Client {
  commands: Collection<string, CommandType> = new Collection()
  player: Player = new Player(this, {
    ytdlOptions: {
      quality: 'highestaudio',
      highWaterMark: 1 << 25,
    },
  })

  constructor() {
    // Note: I'm setting the client.intents to include all available intents
    //       This is useful for developing/testing, but should be set accurately when the bot is live
    //       This adds a lot of useless overhead & increased memory footprint
    super({ intents: 32767 })
  }

  protected async start() {
    if (!validateEnv()) return
    console.clear()
    console.log(cyanBright('EZbot has logged in 🚀'))
    await this.connectDB()
    await this.registerCommands({
      commands: await this.registerModules(),
      guildId: process.env.GUILD_ID,
    })
    this.login(process.env.BOT_TOKEN)
    await registerPlayerEvents(this.player)
  }

  private async importFile(filePath: string) {
    return (await import(filePath))?.default
  }

  private async registerCommands({ commands, guildId }: RegisterCommandOptions) {
    if (guildId) {
      // Then bots commands will be registered to a Guild; Useful for testing
      this.guilds.cache.get(guildId)?.commands.set(commands)
    } else {
      // Then bots commands will be globally registered
      this.application?.commands.set(commands)
    }
  }

  private async registerModules(): Promise<ApplicationCommandDataResolvable[]> {
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
    return slashCommands
  }

  private async connectDB() {
    try {
      await mongoose
        .connect(process.env.EZDB, {
          useUnifiedTopology: true,
          useNewUrlParser: true,
        } as ConnectOptions)
        .then(() => console.log(green('Connected to EZDB')))
    } catch (error) {
      return console.error('❌ Failed to connect to EZDB')
    }
  }
}
