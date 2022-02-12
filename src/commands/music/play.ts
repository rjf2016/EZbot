import { Command } from '../../structures/Command'
import { QueryType } from 'discord-player'
import { TextChannel } from 'discord.js'

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

  run: async ({ client, interaction }) => {
    const song = interaction.options.getString('song')
    const guild = client.guilds.cache.get(interaction.guildId)
    const channel = guild.channels.cache.get(interaction.channelId) as TextChannel

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

    const queue = client.player.createQueue(guild, {
      disableVolume: true,
      leaveOnEmptyCooldown: 1000,
      metadata: {
        channel: channel,
      },
    })

    await interaction.reply({ content: `**Searching** 🔎 \`${song}\`` })

    const searchResult = await client.player
      .search(song, {
        requestedBy: interaction.user,
        searchEngine: QueryType.YOUTUBE_SEARCH,
      })
      .catch((err) => {
        client.logger.error('Failed to get song(s)', err)
      })

    if (!searchResult || !searchResult.tracks.length) {
      return await interaction.followUp({
        content: `🤮 No results were found, try changing the search`,
        ephemeral: true,
      })
    }

    const member = guild.members.cache.get(interaction.user.id) ?? (await guild.members.fetch(interaction.user.id))

    if (!queue.connection) {
      await queue.connect(member.voice.channel).catch((err) => {
        client.logger.error('Failed to join voice chat', err)
        return interaction.followUp({
          content: 'Could not join your voice channel!',
          ephemeral: true,
        })
      })
    }

    searchResult.playlist ? queue.addTracks(searchResult.tracks) : queue.addTrack(searchResult.tracks[0])
    if (!queue.playing) {
      queue.play().catch((err) => {
        client.logger.error(`Encountered an error trying to play song`, err)
        queue.skip()
        return
      })
    }
  },
})
