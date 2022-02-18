import { player } from '../..'
import { Command } from '../../structures/Command'

export default new Command({
  name: 'pause',
  category: 'music',
  description: 'Pause currently playing song',

  run: async ({ interaction }) => {
    const queue = player.getQueue(interaction.guild)

    if (
      interaction.guild.me.voice.channelId &&
      interaction.member.voice.channelId !== interaction.guild.me.voice.channelId
    )
      return await interaction.reply({
        content: 'You are not in my voice channel!',
        ephemeral: true,
      })

    if (!queue || !queue.playing) {
      await interaction.reply({ content: `:confused: Nothing is currently playing`, ephemeral: true })
      throw 'Attempted to pause while nothing was playing'
    }

    queue.setPaused(true)

    return await interaction.reply({ content: `**Paused** :pause_button: \`${queue.current.title}\`` })
  },
})
