import { logger } from '../../structures'
import { ExtendedCommand } from '../../structures/Command'

export default new ExtendedCommand({
  name: 'skip',
  category: 'music',
  description: 'skip current song',

  run: async ({ client, interaction }) => {
    // @TODO : Extract this check into a helper, as every music command will require it
    // 	 			 or put it as a requirement of /music/ commands if possible?
    if (
      interaction.guild.me.voice.channelId &&
      interaction.member.voice.channelId !== interaction.guild.me.voice.channelId
    ) {
      await interaction.reply({
        content: 'You are not even listening to it!😤',
        ephemeral: true,
      })
      return
    }

    const queue = client.player.getQueue(interaction.guild)

    if (!queue || !queue.playing) {
      await interaction.reply({
        content: 'No songs are currently playing',
        ephemeral: true,
      })
      return
    }

    const current = queue.current.title

    try {
      queue.skip()
    } catch (error) {
      logger.error(error)
    }

    await interaction.reply({ content: ` **Skipped** ⏩ ~~\`${current}\`~~` })
  },
})
