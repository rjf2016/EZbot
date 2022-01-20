// Warning this file is temporary, will be moved to DB soon

import { ColorResolvable } from 'discord.js'

/**
 * @returns array of channel names that should not be able to be deleted by `/clean` command
 * */
export const protectedChannels: string[] = ['General', 'Voice Channels', 'safe', 'general']

/**
 * Array of Command categories
 */
export const commandCategories: string[] = []

export const colors: Record<string, ColorResolvable> = {
  main: '#4551f0',
}
