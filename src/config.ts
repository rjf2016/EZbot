// @Warning - most of (if not all) will be moved to database soon
//            they are only in here for developing

import { ColorResolvable } from 'discord.js'

/**
 * Array of channel names that should not be able to be deleted by `/clean` command
 * */
export const protectedChannels: string[] = ['General', 'Voice Channels', 'safe', 'general']

/**
 * Array of Command categories
 */
export const commandCategories: string[] = []

export const colors: Record<string, ColorResolvable> = {
  main: '#4551f0',
}
