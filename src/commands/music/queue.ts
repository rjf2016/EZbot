import { Command } from '../../structures/Command'
import { colors } from '../../../config.json'
import { ColorResolvable } from 'discord.js'

export default new Command({
  name: 'queue',
  description: 'description',
  run: async ({ client, interaction }) => {
    const queue = client.player.getQueue(interaction.guildId)
    if (!queue?.playing)
      return interaction.followUp({
        content: 'No songs are currently playing',
      })

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
          color: `${colors.default}` as ColorResolvable,
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
