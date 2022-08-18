import { ApplicationCommandDataResolvable, Client, Collection, IntentsBitField } from 'discord.js'
import { loadCommands, registerClientEvents, registerPlayerEvents } from '../handlers'
import { CommandType } from '../types/Command'
import { botToken } from '../util/validateEnv'
import { Player } from 'discord-player'
import { logger } from '.'
import { Logger, LoggerOptions } from 'pino'

const intents = new IntentsBitField()

export class ExtendedClient extends Client {
  commands: Collection<string, CommandType> = new Collection()
  slashCommands: ApplicationCommandDataResolvable[] = []
  player: Player = new Player(this, {
    ytdlOptions: {
      quality: 'highestaudio',
      highWaterMark: 1 << 30,
      dlChunkSize: 0,
    },
  })
  logger: Logger<LoggerOptions> = logger

  constructor() {
    super({ intents })
  }

  async start() {
    await registerClientEvents(this, __dirname)
    await loadCommands(this, __dirname)
    registerPlayerEvents(this.player)
    await this.login(botToken)
  }
}
