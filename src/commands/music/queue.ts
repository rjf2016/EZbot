import { ExtendedCommand } from '../../structures/Command'
import { colors } from '../../config'
import { ColorResolvable } from 'discord.js'

export default new ExtendedCommand({
  name: 'queue',
  category: 'music',
  description: 'Display the current queue',

  run: async ({ client, interaction }) => {
    const queue = client.player.getQueue(interaction.guild)
    if (!queue?.playing) {
      await interaction.reply({
        content: 'No songs are currently playing',
      })
      return
    }

    const currentTrack = queue.current
    const tracks = queue.tracks.slice(0, 10).map((m, i) => {
      return `${i + 1}. [**${m.title}**](${m.url}) - ${m.requestedBy.tag}`
    })

    await interaction.reply({
      embeds: [
        {
          title: 'Song Queue',
          description: `${tracks.join('\n')}${
            queue.tracks.length > tracks.length
              ? `\n...${
                  queue.tracks.length - tracks.length === 1
                    ? `${queue.tracks.length - tracks.length} more track`
                    : `${queue.tracks.length - tracks.length} more tracks`
                }`
              : ''
          }`,
          color: 282828,
          fields: [
            {
              name: 'Now Playing',
              value: `🎵 | [**${currentTrack.title}**](${currentTrack.url}) - ${currentTrack.requestedBy.tag}`,
            },
          ],
        },
      ],
    })
  },
})
