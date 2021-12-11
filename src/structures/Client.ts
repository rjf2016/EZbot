import { ApplicationCommandDataResolvable, Client, ClientEvents, Collection } from 'discord.js'
import { CommandType } from '../typings/Command'
import glob from 'glob'
import { promisify } from 'util'
import { validateEnv } from '../util/validateEnv'
import { Event } from './Event'
import { cyanBright, gray, green, dim } from 'chalk'
import { Table } from 'console-table-printer'
import { RegisterCommandOptions } from '../typings/Client'
import mongoose, { ConnectOptions } from 'mongoose'
import { table } from 'console'

const globPromise = promisify(glob)

export class ExtendedClient extends Client {
  commands: Collection<string, CommandType> = new Collection()

  constructor() {
    // Note: I'm setting the client.intents to include all available intents
    //       This is useful for developing/testing, but should be set accurately when the bot is live
    //       This adds a lot of useless overhead & increased memory footprint
    super({ intents: 32767 })
  }

  start() {
    if (!validateEnv()) return
    this.login(process.env.BOT_TOKEN)
    console.log(cyanBright('EZbot has logged in!'))
    console.log(dim('Loading commands...'))
    this.registerModules()
    this.connectDB()
  }

  async importFile(filePath: string) {
    return (await import(filePath))?.default
  }

  async registerCommands({ commands, guildId }: RegisterCommandOptions) {
    if (guildId) {
      // Then bots commands will be registered to a Guild; Useful for testing
      this.guilds.cache.get(guildId)?.commands.set(commands)
      console.log(gray(`Successfully registered commands to guild id: <${guildId}>`))
    } else {
      // Then bots commands will be globally registered
      this.application?.commands.set(commands)
    }
  }

  async registerModules() {
    // Commands
    const slashCommands: ApplicationCommandDataResolvable[] = []
    const commandFiles = await globPromise(`${__dirname}/../commands/*/*{.ts,.js}`)
    const table = new Table({
      columns: [
        { name: 'status', alignment: 'center' },
        { name: 'command', alignment: 'center' },
      ],
    })

    commandFiles.forEach(async (filePath: string) => {
      const command: CommandType = await this.importFile(filePath)
      if (!command.name) return
      this.commands.set(command.name, command)
      slashCommands.push(command)
      table.addRow({ status: '✅', command: `${command.name}` })
    })

    this.on('ready', () => {
      this.registerCommands({
        commands: slashCommands,
        guildId: process.env.GUILD_ID,
      })
    })

    // Events
    const eventFiles = await globPromise(`${__dirname}/../events/*{.ts,.js}`)
    eventFiles.forEach(async (filePath) => {
      const event: Event<keyof ClientEvents> = await this.importFile(filePath)
      this.on(event.event, event.run)
    })
  }

  private async connectDB(): Promise<void> {
    mongoose
      .connect(process.env.EZDB, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      } as ConnectOptions)
      .then(() => console.log(green('Connected to database')))
  }
}
