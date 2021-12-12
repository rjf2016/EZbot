import { ApplicationCommandDataResolvable, Client, ClientEvents, Collection } from 'discord.js'
import { CommandType } from '../types/Command'
import glob from 'glob'
import { promisify } from 'util'
import { validateEnv } from '../util/validateEnv'
import { Event } from './Event'
import { cyanBright, gray, green } from 'chalk'
import { Table } from 'console-table-printer'
import { RegisterCommandOptions } from '../types/Client'
import mongoose, { ConnectOptions } from 'mongoose'
import { Player } from 'discord-player'

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

  async start() {
    if (!validateEnv()) return
    console.clear()
    this.login(process.env.BOT_TOKEN)
    console.log(cyanBright('EZbot has logged in 🚀'))
    this.connectDB()
    this.registerModules()
  }

  async importFile(filePath: string) {
    return (await import(filePath))?.default
  }

  async registerCommands({ commands, guildId }: RegisterCommandOptions) {
    if (guildId) {
      // Then bots commands will be registered to a Guild; Useful for testing
      this.guilds.cache.get(guildId)?.commands.set(commands)
    } else {
      // Then bots commands will be globally registered
      this.application?.commands.set(commands)
    }
  }

  async registerModules(): Promise<void> {
    // Commands
    const slashCommands: ApplicationCommandDataResolvable[] = []
    const commandFiles = await globPromise(`${__dirname}/../commands/*/*{.ts,.js}`)
    const table: Table = new Table({
      columns: [{ name: 'command', alignment: 'left', title: 'Commands' }],
    })

    commandFiles.forEach(async (filePath: string) => {
      const command: CommandType = await this.importFile(filePath)
      if (!command.name) return
      this.commands.set(command.name, command)
      slashCommands.push(command)
      table.addRow({ command: `🟢 /${command.name}` })
    })

    this.on('ready', () => {
      this.registerCommands({
        commands: slashCommands,
        guildId: process.env.GUILD_ID,
      })
      table.printTable()
      console.log(gray(`Successfully registered commands to guild id: <${process.env.GUILD_ID}>`))
    })

    // Events
    const eventFiles = await globPromise(`${__dirname}/../events/*{.ts,.js}`)
    eventFiles.forEach(async (filePath: string) => {
      const event: Event<keyof ClientEvents> = await this.importFile(filePath)
      this.on(event.event, event.run)
    })
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
