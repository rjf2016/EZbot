/**
 * Helper dictionary to pretty print category names
 * eg `prettyCategories.music` = '🎵 Music',
 */
export const prettyCategories = {
  music: '🎵 Music',
  info: '😎 Info',
  moderation: '📛 Moderation',
  utility: '🔨 Utility',
}

export const trimText = (text: string): string => {
  if (text.length > 20) return `${text.substring(0, 20)}...`
}
