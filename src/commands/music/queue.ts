import { ExtendedCommand } from '../../structures'
import { trimText } from '../../util/helpers'
import { useQueue } from 'discord-player'

export default new ExtendedCommand({
  name: 'queue',
  category: 'music',
  description: 'Display the current queue',

  run: async ({ interaction }) => {
    const channel = interaction.member.voice.channel
    if (!channel) return interaction.reply({ content: 'You are not connected to a voice channel!' })

    const queue = useQueue(interaction.guild.id)
    if (!queue) {
      return interaction.reply({
        content: 'No songs are currently playing',
      })
    }

    const currentTrack = queue.currentTrack
    const queueTracks = queue.tracks

    const tracks = queueTracks.map((track, i) => {
      const safeTitle = trimText(track.title)
      return `${i + 1}. [**${safeTitle}**](${track.url}) - ${track.requestedBy}`
    })

    return await interaction.reply({
      embeds: [
        {
          fields: [
            {
              name: 'Now Playing',
              value: `🎵 | [**${currentTrack.title}**](${currentTrack.url}) - ${currentTrack.requestedBy}`,
            },
            {
              name: 'Next Up',
              value: tracks.join('\n'),
            },
          ],
        },
      ],
    })
  },
})
