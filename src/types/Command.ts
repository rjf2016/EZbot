import {
  ChatInputApplicationCommandData,
  CommandInteraction,
  CommandInteractionOptionResolver,
  GuildMember,
  PermissionResolvable,
  TextChannel,
} from 'discord.js'

import { ExtendedClient } from '../structures/Client'

export interface ExtendedInteraction extends CommandInteraction {
  member: GuildMember
  channel: TextChannel
}

interface RunOptions {
  client: ExtendedClient
  interaction: ExtendedInteraction
  args: CommandInteractionOptionResolver
}

type RunFunction = (options: RunOptions) => any

type CommandCategory = 'info' | 'moderation' | 'music' | 'utility'

export type CommandType = {
  userPermissions?: PermissionResolvable[]
  category?: CommandCategory | 'other'
  run: RunFunction
} & ChatInputApplicationCommandData
