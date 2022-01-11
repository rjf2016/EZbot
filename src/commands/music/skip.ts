import { Command } from '../../structures/Command'

export default new Command({
  name: 'skip',
  category: '🎵 Music',
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

    const current = queue.current

    try {
      queue.skip()
    } catch (error) {
      console.error(`❌ Failed to skip ${current}`)
      return await interaction.reply({
        content: `❌ Failed to skip ${current}`,
        ephemeral: true,
      })
    }

    return await interaction.reply(`⏩ Skipped ~~**${current.title}**~~`)
  },
})
