import { CommandInteractionOptionResolver } from 'discord.js'
import { client } from '..'
import { Event } from '../structures/Event'
import { ExtendedInteraction } from '../types/Command'
import { isProd } from '../util/validateEnv'

export default new Event('interactionCreate', async (interaction) => {
  if (interaction.isCommand()) {
    if (interaction.user.bot) return
    if (interaction.channel.type === 'DM' && isProd) return await interaction.reply(`Sorry, I don't do DM's 🤷‍♂️`)

    const command = client.commands.get(interaction.commandName)
    if (!command)
      return await interaction.reply({
        content: 'That command does not exist',
      })

    console.log(`${(interaction.user.username)} ran /${(command.name)}`)

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
      })
    }
  }
})
