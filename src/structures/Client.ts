import { ApplicationCommandDataResolvable, Client, Collection, GatewayIntentBits, IntentsBitField } from 'discord.js'
import { loadCommands, registerClientEvents, registerPlayerEvents } from '../handlers'
import { CommandType } from '../types/Command'
import { botToken } from '../util/validateEnv'
import { Player } from 'discord-player'
import { logger } from '.'
import { Logger, LoggerOptions } from 'pino'

export class ExtendedClient extends Client {
  static instance: ExtendedClient
  commands: Collection<string, CommandType> = new Collection()
  slashCommands: ApplicationCommandDataResolvable[] = []
  player: Player = new Player(this, {
    ytdlOptions: {
      filter: 'audioonly',
      highWaterMark: 1 << 30,
      dlChunkSize: 0,
    },
  })
  logger: Logger<LoggerOptions> = logger

  private constructor() {
    super({
      intents: ['Guilds', 'GuildVoiceStates', 'GuildMessageReactions', 'GuildMembers'],
    })
  }

  public static getInstance(): ExtendedClient {
    if (!ExtendedClient.instance) {
      ExtendedClient.instance = new ExtendedClient()
    }

    return ExtendedClient.instance
  }

  async start() {
    await registerClientEvents(this, __dirname)
    await loadCommands(this, __dirname)
    registerPlayerEvents(this.player)
    await this.login(botToken)
  }
}
