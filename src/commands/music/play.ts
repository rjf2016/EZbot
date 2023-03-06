import { ExtendedCommand, Logger } from '../../structures'
import { useMasterPlayer } from 'discord-player'

export default new ExtendedCommand({
  name: 'play',
  category: 'music',
  description: 'Play a song',
  options: [
    {
      name: 'song',
      description: 'Title or URL of a song',
      type: 3,
      required: true,
    },
  ],

  run: async ({ interaction }) => {
    const query = interaction.options.getString('song')
    const channel = interaction.member.voice.channel
    const player = useMasterPlayer()

    if (!channel) {
      return interaction.reply({
        content: 'You are not in a voice channel!',
        ephemeral: true,
      })
    }

    await interaction.reply({ content: 'Loading your song 🎵', ephemeral: true })

    try {
      return await player.play(channel, query, {
        nodeOptions: {
          metadata: interaction,
          leaveOnEmptyCooldown: 300000,
          leaveOnEmpty: true,
          leaveOnEnd: false,
          bufferingTimeout: 0,
          selfDeaf: true,
        },
        requestedBy: interaction.user,
      })
    } catch (e) {
      Logger.error(e)
      return interaction.followUp({ content: `Uh oh, something went wrong🥲`, ephemeral: true })
    }
  },
})
