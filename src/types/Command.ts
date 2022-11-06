import {
  ChatInputApplicationCommandData,
  ChatInputCommandInteraction,
  CommandInteractionOptionResolver,
  GuildMember,
  GuildTextBasedChannel,
  PermissionResolvable,
} from 'discord.js'

import { ExtendedClient } from '../structures/Client'

export interface ExtendedInteraction extends ChatInputCommandInteraction {
  member: GuildMember
  channel: GuildTextBasedChannel
}

interface RunOptions {
  client: ExtendedClient
  interaction: ExtendedInteraction
  args: CommandInteractionOptionResolver
}

type RunFunction = (options: RunOptions) => any

type CommandCategory = 'music' | 'info' | 'utility' | 'moderation' | 'devel'

export type CommandType = {
  userPermissions?: PermissionResolvable[]
  category: CommandCategory
  run: RunFunction
} & ChatInputApplicationCommandData
