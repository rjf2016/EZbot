import { CommandInteractionOptionResolver, InteractionType } from 'discord.js'
import { client } from '../..'
import { Event } from '../../structures'
import { ExtendedInteraction } from '../../types/Command'

export default new Event('interactionCreate', async (interaction) => {
  if (interaction.user.bot || interaction.type !== InteractionType.ApplicationCommand) return
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
