import { Command } from '../../structures/Command'
import { QueryType } from 'discord-player'
import { default as player } from '../../structures/player'
import { MessageEmbed } from 'discord.js'

export default new Command({
  name: 'play',
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

    if (!interaction.member.voice.channel)
      return await interaction.reply('Please join a voice channel first!')

    if (
      interaction.guild.me.voice.channelId &&
      interaction.member.voice.channelId !== interaction.guild.me.voice.channelId
    )
      return await interaction.reply({
        content: 'You are not in my voice channel!',
        ephemeral: true,
      })

    const queue = await player.createQueue(interaction.guild, {
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

    const track = await player.search(song, {
      requestedBy: interaction.user,
      searchEngine: QueryType.AUTO,
    })

    if (!track || !track.tracks.length)
      return await interaction.followUp({
        content: `❌ | No Video/Song/Playlist was found when searching for : ${track}`,
        ephemeral: true,
      })

    const playEmbed = new MessageEmbed()
      .setColor(`RANDOM`)
      .setTitle(`🎶   New ${track.playlist ? 'playlist' : 'song'} Added to queue`)
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
