import { APIMessage } from 'discord-api-types'
import {
  ChatInputApplicationCommandData,
  CommandInteraction,
  CommandInteractionOptionResolver,
  GuildMember,
  GuildTextBasedChannel,
  Message,
  PermissionResolvable,
} from 'discord.js'

import ExtendedClient from '../structures/Client'

export interface ExtendedInteraction extends CommandInteraction {
  member: GuildMember
  channel: GuildTextBasedChannel
}

interface RunOptions {
  client: ExtendedClient
  interaction: ExtendedInteraction
  args: CommandInteractionOptionResolver
}

type RunFunction = (options: RunOptions) => Promise<void | APIMessage | Message<boolean>>

type CommandCategory = 'music' | 'info' | 'utility' | 'moderation'

export type CommandType = {
  userPermissions?: PermissionResolvable[]
  category?: CommandCategory
  run: RunFunction
} & ChatInputApplicationCommandData
