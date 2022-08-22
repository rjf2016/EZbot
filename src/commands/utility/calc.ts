import { ExtendedCommand } from '../../structures/Command'
import {
  ButtonBuilder,
  Message,
  Formatters,
  ButtonInteraction,
  ActionRowBuilder,
  ButtonStyle,
  ComponentType,
} from 'discord.js'
import { evaluate } from 'mathjs'

export default new ExtendedCommand({
  name: 'calc',
  category: 'utility',
  description: 'open up a calculator',
  run: async ({ interaction }) => {
    const botMessage = (await interaction.deferReply({ fetchReply: true })) as Message

    let data = ''
    let content: string = Formatters.codeBlock('fix', ' ')

    const generateComponents = () => {
      const row1 = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder().setCustomId('clear').setLabel('C').setStyle(ButtonStyle.Danger),
        new ButtonBuilder().setCustomId('(').setLabel('(').setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId(')').setLabel(')').setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId('^').setLabel('^').setStyle(ButtonStyle.Primary)
      )
      const row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder().setCustomId('7').setLabel('7').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('8').setLabel('8').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('9').setLabel('9').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('/').setLabel('/').setStyle(ButtonStyle.Primary)
      )
      const row3 = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder().setCustomId('4').setLabel('4').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('5').setLabel('5').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('6').setLabel('6').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('*').setLabel('*').setStyle(ButtonStyle.Primary)
      )
      const row4 = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder().setCustomId('1').setLabel('1').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('2').setLabel('2').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('3').setLabel('3').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('-').setLabel('-').setStyle(ButtonStyle.Primary)
      )
      const row5 = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder().setCustomId('0').setLabel('0').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('.').setLabel('.').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('=').setLabel('=').setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId('+').setLabel('+').setStyle(ButtonStyle.Primary)
      )
      return [row1, row2, row3, row4, row5]
    }

    const formatContent = (data: string) => {
      return Formatters.codeBlock('fix', data.length ? data : ' ')
    }

    await interaction.editReply({ components: generateComponents(), content })

    const filter = (i: ButtonInteraction) => i.user.id === interaction.user.id
    const collector = botMessage.createMessageComponentCollector({
      filter,
      time: 20e3,
      componentType: ComponentType.Button,
    })

    collector.on('collect', (btn) => {
      const value: string = btn.customId

      switch (value) {
        case 'clear':
          data = ''
          content = formatContent(data)
          break

        case '=':
          try {
            const result = evaluate(data)
            content = formatContent(result ? `${data} = ${result}` : ' ')
            data = result ? result : ''
          } catch (error) {
            console.error(error)
            content = formatContent(
              'Something went wrong while trying to evaluate this expression. Make sure your math expression is valid!'
            )
            data = ''
          }
          break

        default:
          data += value
          content = formatContent(data)
          break
      }
      collector.resetTimer()
      btn.update({ content })
    })

    collector.on('end', async () => {
      botMessage.edit({
        content: content + `*This session has timed out. You can start a new one with \`/calc\`.*`,
        components: [],
      })
    })
  },
})
