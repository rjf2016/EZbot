import { MessageEmbedOptions } from 'discord.js'
import { Track } from 'discord-player'
import { colors, isCompactEnabled } from '../config'

import { client } from '..'

interface IMusicMessage {
  trackStart(track: Track): { embeds: [MessageEmbedOptions] } | { content: string }
  trackAdd(track: Track): { embeds: [MessageEmbedOptions] } | { content: string }
}

const Cozy = (): IMusicMessage => ({
  trackStart({ title, url, thumbnail, requestedBy, duration }) {
    return {
      embeds: [
        {
          author: { name: 'Now Playing' },
          thumbnail: { url: thumbnail },
          description: `**[${
            title.length > 25 ? title.substring(0, 25) + '...' : title
          }](${url})**\n\n \`\` ${duration} \`\`\t\u200b\t\u200b\t${requestedBy}`,
          color: colors.main,
        },
      ],
    }
  },

  trackAdd({ title, url, thumbnail, requestedBy, duration }) {
    return {
      embeds: [
        {
          author: { name: 'Added to queue' },
          thumbnail: { url: `${thumbnail}` },
          description: `**[${
            title.length > 25 ? title.substring(0, 25) + '...' : title
          }](${url})**\n\n \`\` ${duration} \`\`\t\u200b\t\u200b\t${requestedBy}`,
          color: colors.main,
        },
      ],
    }
  },
})

const Compact = (): IMusicMessage => ({
  trackStart({ title }) {
    return {
      content: `**Playing** 🎵 \`${title}\` - Now!`,
    }
  },

  trackAdd({ title }: Track) {
    return {
      content: `**Added** ⏱️ \`${title}\` - to the **queue**!`,
    }
  },
})

export const musicMessage = (): IMusicMessage => {
  if (isCompactEnabled === true) {
    return Compact()
  } else {
    return Cozy()
  }
}
