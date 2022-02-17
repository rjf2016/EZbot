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
    ) {
      return await interaction.reply({
        content: 'You are not even listening to it!😤',
        ephemeral: true,
      })
    }

    const queue = client.player.getQueue(interaction.guild)

    if (!queue.playing) {
      return await interaction.reply({
        content: 'No songs are currently playing',
        ephemeral: true,
      })
    }

    queue.skip()

    return await interaction.reply({ content: ` **Skipped** ⏩ ~~\`${queue.current.title}\`~~` })
  },
})
