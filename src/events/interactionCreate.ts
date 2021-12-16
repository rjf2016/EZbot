import { CommandInteractionOptionResolver } from 'discord.js'
import { client } from '..'
import { Event } from '../structures/Event'
import { ExtendedInteraction } from '../types/Command'
import { isProd } from '../util/validateEnv'
import chalk from 'chalk'

export default new Event('interactionCreate', async (interaction) => {
  if (interaction.isCommand()) {
    if (interaction.user.bot) return

    const command = client.commands.get(interaction.commandName)
    if (!command)
      return await interaction.reply({
        content: 'That command does not exist',
        ephemeral: isProd(),
      })

    console.log(`${chalk.cyan(interaction.user.username)} ran ${chalk.yellow('/' + command.name)}`)

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
