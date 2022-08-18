import { ExtendedCommand } from '../../structures/Command'
import { QueryType } from 'discord-player'
import { TextChannel } from 'discord.js'

export default new ExtendedCommand({
  name: 'play',
  category: 'music',
  description: 'Play a song',
  options: [
    {
      name: 'song',
      description: 'Title of the song',
      type: 'STRING',
      required: true,
    },
  ],

  run: async ({ client, interaction }) => {
    const song = interaction.options.getString('song')
    const channel = interaction.channel as TextChannel

    if (!interaction.member.voice.channel) return await interaction.reply('Please join a voice channel first!')

    if (
      interaction.guild.available.voice.channelId &&
      interaction.member.voice.channelId !== interaction.guild.me.voice.channelId
    ) {
      await interaction.reply({
        content: 'You are not in my voice channel!',
        ephemeral: true,
      })
      return
    }

    const queue = client.player.createQueue(interaction.guild, {
      disableVolume: true,
      leaveOnEnd: true,
      metadata: {
        channel: channel,
      },
    })

    await interaction.reply({ content: `**Searching** 🔎 \`${song}\`` })

    const searchResult = await client.player
      .search(song, {
        requestedBy: interaction.user,
        searchEngine: QueryType.AUTO,
      })
      .catch((err) => {
        client.logger.error('Failed to get song(s)', err)
      })

    if (!searchResult || !searchResult.tracks.length) {
      await interaction.followUp({
        content: `🤮 No results were found, try changing the search`,
        ephemeral: true,
      })
      return
    }

    if (!queue.connection) {
      try {
        await queue.connect(interaction.member.voice.channel)
      } catch (error) {
        client.logger.error('Failed to join voice chat', error)
        await interaction.followUp({
          content: 'Could not join your voice channel!',
          ephemeral: true,
        })
        queue.destroy(true)
        return
      }
    }

    searchResult.playlist ? queue.addTracks(searchResult.tracks) : queue.addTrack(searchResult.tracks[0])
    if (!queue.playing) {
      try {
        await queue.play()
      } catch (error) {
        client.logger.error(`Encountered an error trying to play song`, error)
        await interaction.followUp({
          content: '🤮 Uh oh, I ran into an error trying to play that song.',
        })
        return
      }
    }
  },
})
