import { MessageEmbed } from 'discord.js'
import { Command } from '../../structures/Command'

export default new Command({
  name: 'help',
  category: '😎 Info',
  description: 'View all of my commands',
  options: [
    {
      name: 'command',
      description: 'Get info about a specific command',
      type: 'STRING',
      required: false,
    },
  ],
  run: async ({ client, interaction }) => {
    const helpCommand = interaction.options.getString('command')
    const embed = new MessageEmbed().setColor('PURPLE').setURL('https://github.com/rjf2016/EZbot#features')
    const isValidCommand = helpCommand !== null && client.commands.get(helpCommand)
    // if: /help <valid command>
    if (isValidCommand) {
      const { name, category, description, options } = client.commands.get(helpCommand)
      const embedOptions = `${
        !options
          ? ''
          : '\n**Options**\n ' + options.map(({ name, description }) => `\`<${name}>\` *${description}* \n`).join('\n')
      }`

      embed.setTitle(`/${name}`)
      embed.setDescription(
        `> *${description}*
					${embedOptions}
					**Category**\n ${category}
					`
      )
      embed.setFooter({ text: 'Use /help to see all of my commands' })

      // else: /help or /help <invalid command>
    } else {
      embed.setTitle('EZbots commands')
    }
    return await interaction.reply({
      embeds: [embed],
      content: `${
        !isValidCommand && helpCommand !== null
          ? "🤔 Hmm.. I don't know that command. Here are all of the commands I do know"
          : '\t'
      }`,
    })
  },
})
