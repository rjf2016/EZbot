import { CommandInteractionOptionResolver } from 'discord.js'
import { client } from '../..'
import { Event, Logger } from '../../structures'
import { ExtendedInteraction } from '../../types/Command'

export default new Event('interactionCreate', async (interaction) => {
  if (interaction.user.bot) return
  if (!interaction.isChatInputCommand()) return

  const command = client.commands.get(interaction.commandName)

  if (!command) {
    interaction.reply({
      content: 'That command does not exist',
    })
    return
  }

  Logger.info(`${interaction.user.username} ran /${command.name}`)

  await command.run({
    args: interaction.options as CommandInteractionOptionResolver,
    client,
    interaction: interaction as ExtendedInteraction,
  })
})
