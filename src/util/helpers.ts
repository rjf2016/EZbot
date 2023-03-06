/**
 * Helper dictionary to pretty print category names
 * eg `prettyCategories.music` = '🎵 Music',
 */
import prettyMilliseconds from 'pretty-ms'

export const prettyCategories = {
  music: '🎵 Music',
  info: '😎 Info',
  moderation: '📛 Moderation',
  utility: '🔨 Utility',
}

export const trimText = (text: string, maxLength = 25): string => text.substring(0, maxLength)

export const prettifyMS = (ms: number): string => prettyMilliseconds(ms)
