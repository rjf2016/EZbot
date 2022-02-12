import { Command } from '../../structures/Command'

export default new Command({
  name: 'skip',
  category: 'music',
  description: 'skip current song',

  run: async ({ client, interaction }) => {
    // @TODO : Extract this check into a helper, as every music command will require it
    // 	 			 or put it as a requirement of /music/ commands if possible?
    if (
      interaction.guild.me.voice.channelId &&
      interaction.member.voice.channelId !== interaction.guild.me.voice.channelId
    )
      return await interaction.reply({
        content: 'You are not even listening to it!😤',
        ephemeral: true,
      })

    const queue = client.player.getQueue(interaction.guildId)

    if (!queue?.playing)
      return await interaction.reply({
        content: 'No songs are currently playing',
        ephemeral: true,
      })

    // This line is a little hacky - fixes bug that would occur by skipping a track when the player was paused
    // by forcing the player to resume just before skip.. Probly a better solution out there
    queue.setPaused(false)

    const skipped = queue.skip()

    if (!skipped) client.logger.error('Failed to skip track')

    return await interaction.reply({
      content: skipped ? ` **Skipped** ⏩ ~~\`${queue.current.title}\`~~` : ' ❌ Failed to skip song',
    })
  },
})
