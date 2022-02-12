import chalk from 'chalk'
import { CommandInteractionOptionResolver } from 'discord.js'
import { client } from '../..'
import { ClientEvent } from '../../structures/ClientEvent'
import { EZinteraction } from '../../types/Command'

export default new ClientEvent('interactionCreate', async (interaction) => {
  if (interaction.user.bot || !interaction.isCommand()) return
  const command = client.commands.get(interaction.commandName)
  if (!command)
    return await interaction.reply({
      content: 'That command does not exist',
    })

  client.logger.info(`${chalk.cyan(interaction.user.username)} ran ${interaction}`)

  await command
    .run({
      args: interaction.options as CommandInteractionOptionResolver,
      client,
      interaction: interaction as EZinteraction,
    })
    .catch((err) => {
      client.logger.error(`Unexpected error while running ${interaction}`, err)
    })
})
