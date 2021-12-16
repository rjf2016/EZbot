import { Command } from '../../structures/Command'
import { QueryType } from 'discord-player'
import { ColorResolvable, MessageEmbed } from 'discord.js'
import { colors } from '../../../config.json'

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

    if (!interaction.member.voice.channel) return await interaction.reply('Please join a voice channel first!')

    if (
      interaction.guild.me.voice.channelId &&
      interaction.member.voice.channelId !== interaction.guild.me.voice.channelId
    )
      return await interaction.reply({
        content: 'You are not in my voice channel!',
        ephemeral: true,
      })

    const queue = client.player.createQueue(interaction.guild, {
      metadata: {
        channel: interaction.channel,
      },
    })

    try {
      if (!queue.connection) await queue.connect(interaction.member.voice.channel)
    } catch {
      queue.destroy()
      return await interaction.reply({
        content: 'Could not join your voice channel!',
        ephemeral: true,
      })
    }

    await interaction.deferReply()

    const track = await client.player.search(song, {
      requestedBy: interaction.user,
      searchEngine: QueryType.YOUTUBE,
    })

    if (!track || !track.tracks.length)
      return await interaction.followUp({
        content: `❌  No Video/Song/Playlist was found when searching for : ${track}. Try adding/removing some words.`,
        ephemeral: true,
      })

    const playEmbed = new MessageEmbed()
      .setColor(`${colors.default}` as ColorResolvable)
      .setTitle(`🎵  New ${track.playlist ? 'playlist' : 'song'} added to queue`)
    if (!track.playlist) {
      const tr = track.tracks[0]
      playEmbed.setThumbnail(tr.thumbnail)
      playEmbed.setDescription(`${tr.title}`)
    }

    if (!queue.playing) {
      track.playlist ? queue.addTracks(track.tracks) : queue.play(track.tracks[0])
      return await interaction.editReply({ embeds: [playEmbed] })
    } else if (queue.playing) {
      track.playlist ? queue.addTracks(track.tracks) : queue.addTrack(track.tracks[0])
      return await interaction.editReply({
        embeds: [playEmbed],
      })
    }
  },
})
