/**
 * Helper dictionary to pretty print category names
 * eg `prettyCategories.music` = '🎵 Music',
 */
import prettyMilliseconds from 'pretty-ms'

export const prettyCategories = {
  devel: '👨‍💻 Developer',
  music: '🎵 Music',
  info: '😎 Info',
  moderation: '📛 Moderation',
  utility: '🔨 Utility',
}

export const trimText = (text: string): string => {
  if (text.length > 20) return `${text.substring(0, 20)}...`
}

export const prettifyMS = (ms: number): string => prettyMilliseconds(ms)
