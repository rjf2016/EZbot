import { Command } from '../../structures/Command'
import { QueryType, PlayerOptions } from 'discord-player'

export default new Command({
  name: 'play',
  category: '🎵 Music',
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
      disableVolume: true,
      leaveOnEnd: true,
      leaveOnEmptyCooldown: 60000,
    } as PlayerOptions)

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

    const track = await client.player
      .search(song, {
        requestedBy: interaction.user,
        searchEngine: QueryType.AUTO,
      })
      .then((x: { tracks: any[] }) => x.tracks[0])

    if (!track)
      return await interaction.followUp({
        content: `❌  No Video/Song/Playlist was found when searching for : ${song}. Try adding/removing some words.`,
      })

    queue.play(track)

    return await interaction.followUp({ content: `⏱️ | Loading **${track.title}**!` })
  },
})
