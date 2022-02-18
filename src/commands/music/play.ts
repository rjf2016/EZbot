import { Command } from '../../structures/Command'
import { QueryType } from 'discord-player'
import { TextChannel } from 'discord.js'
import logger from '../../structures/Logger'
import { player } from '../..'

export default new Command({
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

  run: async ({ interaction }) => {
    const song = interaction.options.getString('song')
    const channel = interaction.channel as TextChannel

    if (!interaction.member.voice.channel) return await interaction.reply('Please join a voice channel first!')

    if (
      interaction.guild.me.voice.channelId &&
      interaction.member.voice.channelId !== interaction.guild.me.voice.channelId
    ) {
      return await interaction.reply({
        content: 'You are not in my voice channel!',
        ephemeral: true,
      })
    }

    const queue = player.createQueue(interaction.guild, {
      disableVolume: true,
      leaveOnEnd: false,
      autoSelfDeaf: false,
      metadata: {
        channel: channel,
      },
    })

    await interaction.reply({ content: `**Searching** 🔎 \`${song}\`` })

    const searchResult = await player
      .search(song, {
        requestedBy: interaction.user,
        searchEngine: QueryType.YOUTUBE_SEARCH,
      })
      .catch((err) => {
        logger.error('Failed to get song(s)', err)
      })

    if (!searchResult || !searchResult.tracks.length) {
      return await interaction.followUp({
        content: `🤮 No results were found, try changing the search`,
        ephemeral: true,
      })
    }

    if (!queue.connection) {
      await queue.connect(interaction.member.voice.channel).catch((err) => {
        logger.error('Failed to join voice chat', err)
        return interaction.followUp({
          content: 'Could not join your voice channel!',
          ephemeral: true,
        })
      })
    }

    searchResult.playlist ? queue.addTracks(searchResult.tracks) : queue.addTrack(searchResult.tracks[0])
    if (!queue.playing) {
      queue.play().catch((err) => {
        logger.error(`Encountered an error trying to play song`, err)
        return
      })
    }
  },
})
