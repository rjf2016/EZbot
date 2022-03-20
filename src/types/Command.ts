import {
  ChatInputApplicationCommandData,
  CommandInteraction,
  CommandInteractionOptionResolver,
  GuildMember,
  GuildTextBasedChannel,
  PermissionResolvable,
} from 'discord.js'

import { ExtendedClient } from '../structures/Client'

export interface ExtendedInteraction extends CommandInteraction {
  member: GuildMember
  channel: GuildTextBasedChannel
}

interface RunOptions {
  client: ExtendedClient
  interaction: ExtendedInteraction
  args: CommandInteractionOptionResolver
}

type RunFunction = (options: RunOptions) => Promise<void>

type CommandCategory = 'music' | 'info' | 'utility' | 'moderation' | 'devel'

export type CommandType = {
  userPermissions?: PermissionResolvable[]
  category: CommandCategory
  run: RunFunction
} & ChatInputApplicationCommandData
