import { Command } from '../../structures/Command'
import { MessageActionRow, MessageButton, Message, Formatters, ButtonInteraction } from 'discord.js'
import { evaluate } from 'mathjs'

export default new Command({
  name: 'calc',
  category: 'utility',
  description: 'open up a calculator',
  run: async ({ interaction }) => {
    const botMessage = (await interaction.deferReply({ fetchReply: true })) as Message

    let data = ''
    let content: string = Formatters.codeBlock('fix', ' ')

    const generateComponents = () => {
      const row1 = new MessageActionRow().addComponents(
        new MessageButton().setCustomId('clear').setLabel('C').setStyle('DANGER'),
        new MessageButton().setCustomId('(').setLabel('(').setStyle('PRIMARY'),
        new MessageButton().setCustomId(')').setLabel(')').setStyle('PRIMARY'),
        new MessageButton().setCustomId('^').setLabel('^').setStyle('PRIMARY')
      )
      const row2 = new MessageActionRow().addComponents(
        new MessageButton().setCustomId('7').setLabel('7').setStyle('SECONDARY'),
        new MessageButton().setCustomId('8').setLabel('8').setStyle('SECONDARY'),
        new MessageButton().setCustomId('9').setLabel('9').setStyle('SECONDARY'),
        new MessageButton().setCustomId('/').setLabel('/').setStyle('PRIMARY')
      )
      const row3 = new MessageActionRow().addComponents(
        new MessageButton().setCustomId('4').setLabel('4').setStyle('SECONDARY'),
        new MessageButton().setCustomId('5').setLabel('5').setStyle('SECONDARY'),
        new MessageButton().setCustomId('6').setLabel('6').setStyle('SECONDARY'),
        new MessageButton().setCustomId('*').setLabel('*').setStyle('PRIMARY')
      )
      const row4 = new MessageActionRow().addComponents(
        new MessageButton().setCustomId('1').setLabel('1').setStyle('SECONDARY'),
        new MessageButton().setCustomId('2').setLabel('2').setStyle('SECONDARY'),
        new MessageButton().setCustomId('3').setLabel('3').setStyle('SECONDARY'),
        new MessageButton().setCustomId('-').setLabel('-').setStyle('PRIMARY')
      )
      const row5 = new MessageActionRow().addComponents(
        new MessageButton().setCustomId('0').setLabel('0').setStyle('SECONDARY'),
        new MessageButton().setCustomId('.').setLabel('.').setStyle('SECONDARY'),
        new MessageButton().setCustomId('=').setLabel('=').setStyle('SUCCESS'),
        new MessageButton().setCustomId('+').setLabel('+').setStyle('PRIMARY')
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
      componentType: 'BUTTON',
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
