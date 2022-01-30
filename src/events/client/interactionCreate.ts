import { CommandInteractionOptionResolver } from 'discord.js'
import { client } from '../..'
import EZclient from '../../structures/Client'
import { ClientEvent } from '../../structures/ClientEvent'
import { EZinteraction } from '../../types/Command'

export default new ClientEvent('interactionCreate', async (interaction) => {
  if (interaction.user.bot) return

  if (interaction.isCommand()) {
    const command = client.commands.get(interaction.commandName)
    if (!command)
      return await interaction.reply({
        content: 'That command does not exist',
      })

    console.log(`${interaction.user.username} ran /${command.name}`)

    try {
      await command.run({
        args: interaction.options as CommandInteractionOptionResolver,
        client: client as EZclient,
        interaction: interaction as EZinteraction,
      })
    } catch (error) {
      console.error(error)
      return await interaction.reply({
        content: "❌ Uh oh, I've encountered an unexpected error 🤕",
      })
    }
  }
})
