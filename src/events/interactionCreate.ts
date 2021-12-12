import { CommandInteractionOptionResolver } from 'discord.js'
import { client } from '..'
import { Event } from '../structures/Event'
import { ExtendedInteraction } from '../typings/Command'
import { isProd } from '../util/validateEnv'

export default new Event('interactionCreate', async (interaction) => {
  if (interaction.isCommand()) {
    const command = client.commands.get(interaction.commandName)
    if (!command)
      return await interaction.reply({
        content: 'That command does not exist',
        ephemeral: isProd(),
      })

    try {
      command.run({
        args: interaction.options as CommandInteractionOptionResolver,
        client,
        interaction: interaction as ExtendedInteraction,
      })
    } catch (error) {
      console.error(error)
      return await interaction.reply({
        content: "❌ Uh oh, I've encountered an unexpected error 🤕",
        ephemeral: isProd(),
      })
    }
  }
})
