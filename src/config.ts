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
  main: '#0079ea',
}

/**
 * Gives ability to change bot's message "style"..
 *
 * If compactSetting = **true** => bot's messages will be compact/mostly text
 *
 * If compactSetting = **false** => bot will use more embeds/more verbose
 *
 * *This will be a user-defined setting that gets stored in DB*
 */
const isCompact = false
export const isCompactEnabled: boolean = isCompact
