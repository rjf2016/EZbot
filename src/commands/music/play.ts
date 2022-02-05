import { Command } from '../../structures/Command'
import { QueryType, PlayerOptions } from 'discord-player'

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
      disableVolume: true,
      leaveOnEmptyCooldown: 1000,
    })

    await interaction.reply({ content: `**Searching** 🔎 \`${song}\`` })

    const track = await client.player
      .search(song, {
        requestedBy: interaction.user,
      })
      .then((x: { tracks: any[] }) => x.tracks[0])

    if (!track) {
      console.log(`❌ Failed to find song: ${song}`)
      return await interaction.followUp({
        content: `❌  No results found for: \`${song}\`. Try adding/removing some words.`,
        ephemeral: true,
      })
    }

    try {
      if (!queue.connection) await queue.connect(interaction.member.voice.channel)
    } catch {
      queue.destroy()
      return await interaction.reply({
        content: 'Could not join your voice channel!',
        ephemeral: true,
      })
    }

    try {
      queue.play(track)
    } catch (error) {
      console.log(error)
    }
    return interaction.deferReply
  },
})
