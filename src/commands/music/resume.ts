import { Command } from '../../structures/Command'

export default new Command({
  name: 'resume',
  category: 'music',
  description: 'Resume the currently paused song',

  run: async ({ client, interaction }) => {
    const queue = client.player.getQueue(interaction.guildId)

    if (
      interaction.guild.me.voice.channelId &&
      interaction.member.voice.channelId !== interaction.guild.me.voice.channelId
    )
      return await interaction.reply({
        content: 'You are not in my voice channel!',
        ephemeral: true,
      })

    if (!queue || !queue.playing || !queue.setPaused) {
      await interaction.reply({ content: `:confused: You can't resume what isn't paused`, ephemeral: true })
      client.logger.error('Attempted to resume player that was not paused', queue)
    }

    const paused = queue.setPaused(false)

    function handleError() {
      client.logger.error('Failed to resume song', queue)
      return `❌ Failed to resume song`
    }

    return await interaction.reply({
      content: paused ? `**Resume** :arrow_forward: \`${queue.current.title}\`` : handleError(),
    })
  },
})
