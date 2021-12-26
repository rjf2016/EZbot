import { ApplicationCommandDataResolvable, Guild, GuildResolvable } from 'discord.js'

export interface RegisterCommandOptions {
  guildId: string
  commands: ApplicationCommandDataResolvable[]
}
