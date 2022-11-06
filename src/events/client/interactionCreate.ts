import { QueryType } from 'discord-player'
import { CommandInteractionOptionResolver, GuildMember, InteractionType, TextChannel } from 'discord.js'
import { client } from '../..'
import { Event } from '../../structures'
import { ExtendedInteraction } from '../../types/Command'

export default new Event('interactionCreate', async (interaction) => {
  if (interaction.user.bot) return

  if (interaction.isSelectMenu()) {
    if (interaction.customId === 'select-search') {
      const member = interaction.member as GuildMember
      const channel = interaction.channel as TextChannel

      if (!member.voice.channelId) {
        await interaction.reply({
          content: 'You are not in my voice channel!',
          ephemeral: true,
        })
        return
      }

      const queue = client.player.createQueue(interaction.guild, {
        disableVolume: true,
        leaveOnEnd: true,
        metadata: {
          channel: channel,
        },
      })

      if (!queue.connection) {
        try {
          await queue.connect(member.voice.channel)
        } catch (error) {
          client.logger.error('Failed to join voice chat', error)
          await interaction.followUp({
            content: 'Could not join your voice channel!',
            ephemeral: true,
          })
          queue.destroy(true)
          return
        }
      }

      await interaction.update({ content: 'Loading your song 🎵', components: [] })
      const trackURL = interaction.values[0]
      const searchResult = await client.player
        .search(trackURL, {
          requestedBy: interaction.user,
          searchEngine: QueryType.AUTO,
        })
        .catch((err) => {
          client.logger.error('Failed to get song(s)', err)
        })
      if (!searchResult) return
      queue.addTrack(searchResult.tracks[0])
      if (!queue.playing) {
        try {
          await queue.play()
        } catch (error) {
          client.logger.error(`Encountered an error trying to play song`, error)
          await interaction.reply({
            content: '🤮 Uh oh, I ran into an error trying to play that song.',
          })
          return
        }
      }
    }
  }

  if (interaction.type !== InteractionType.ApplicationCommand) return
  const command = client.commands.get(interaction.commandName)

  if (!command) {
    interaction.reply({
      content: 'That command does not exist',
    })
    return
  }

  client.logger.info(`${interaction.user.username} ran /${command.name}`)

  command.run({
    args: interaction.options as CommandInteractionOptionResolver,
    client,
    interaction: interaction as ExtendedInteraction,
  })
})
