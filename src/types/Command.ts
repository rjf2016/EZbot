import {
  ChatInputApplicationCommandData,
  CommandInteraction,
  CommandInteractionOptionResolver,
  GuildMember,
  GuildTextBasedChannel,
  PermissionResolvable,
} from 'discord.js'

import EZclient from '../structures/Client'

export interface EZinteraction extends CommandInteraction {
  member: GuildMember
  channel: GuildTextBasedChannel
}

interface RunOptions {
  client: EZclient
  interaction: EZinteraction
  args: CommandInteractionOptionResolver
}

type RunFunction = (options: RunOptions) => any

type CommandCategory = 'music' | 'info' | 'utility' | 'moderation' | 'devel'

export type CommandType = {
  userPermissions?: PermissionResolvable[]
  category: CommandCategory
  run: RunFunction
} & ChatInputApplicationCommandData
