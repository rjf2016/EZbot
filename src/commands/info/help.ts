import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js'
import { ExtendedCommand } from '../../structures/Command'
import { prettyCategories } from '../../util/helpers'

export default new ExtendedCommand({
  name: 'help',
  category: 'info',
  description: 'View all of my commands',
  options: [
    {
      name: 'command',
      description: 'Get info about a specific command',
      type: 3,
      required: false,
    },
  ],
  run: async ({ client, interaction }) => {
    const helpCommand = interaction.options.getString('command')
    const embed = new EmbedBuilder().setColor('Purple').setURL('https://github.com/rjf2016/EZbot#features')
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
					**Category**\n ${prettyCategories[category]}
					`
      )
      embed.setFooter({ text: 'Use /help to see all of my commands' })

      // else: /help or /help <invalid command>
    } else {
      embed.setTitle('EZbots commands')
      const embedCommands = [...client.commands.values()].reduce((acc, cmd) => {
        const category = prettyCategories[cmd.category]
        if (!acc[category]) {
          acc[category] = []
        }
        acc[category].push(cmd.name)
        return acc
      }, [])

      const embedDescription = Object.keys(embedCommands).reduce((total, key) => {
        return `${total}\n**__${key}__**\n\`${embedCommands[key].join('`\n`')}\`\n`
      }, ``)
      embed.setDescription(embedDescription)
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
