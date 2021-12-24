import { BaseGuildEmojiManager, Emoji } from 'discord.js'
import { resolve } from 'path/posix'
import { client } from '../..'
import { Command } from '../../structures/Command'
import { emoji } from '../../util/emojiChar'

export default new Command({
  name: 'poll',
  category: 'utility',
  description: 'A poll/voting system',
  options: [
    {
      name: 'create',
      description: 'Start a new poll',
      type: 'SUB_COMMAND',
      options: [
        {
          name: 'question',
          description: 'The question people will vote on',
          required: true,
          type: 'STRING',
        },
        {
          name: 'choice-a',
          description: 'The first choice a user can pick. Should start with an emoji followed by a space',
          required: true,
          type: 'STRING',
        },
        {
          name: 'choice-b',
          description: 'The second choice a user can pick',
          required: true,
          type: 'STRING',
        },
        {
          name: 'choice-c',
          description: 'The third choice a user can pick',
          required: false,
          type: 'STRING',
        },
        {
          name: 'choice-d',
          description: 'The fourth choice a user can pick',
          required: false,
          type: 'STRING',
        },
        {
          name: 'choice-e',
          description: 'The fifth choice a user can pick',
          required: false,
          type: 'STRING',
        },
      ],
    },
  ],

  run: async ({ interaction }) => {
    const SUBCOMMAND = interaction.options.getSubcommand()
    if (SUBCOMMAND === 'create') {
      const [question, ...answers] = interaction.options.data[0]?.options.map(({ value }) => value as string)
      const defaultEmoji = ['a', 'b', 'c', 'd', 'e']
      console.log('QUESTION: ', question)
      console.log('ANSWERS: ', answers)

      // const wtf = interaction.guild.emojis.resolve('nope')
      // console.log(wtf)

      // Create dictionary for answers & while checking if they start with emoji
      const dict = answers.reduce((acc, answer, i) => {
        // Then answer starts with an emoji
        const startsWith = answer.split(' ').shift()
        console.log(`Starts with: ${startsWith}`)
        const answerEmoji = interaction.guild.emojis.resolve(startsWith) ? startsWith : emoji[defaultEmoji[i]]
        return { ...acc, [answer]: answerEmoji }
      }, {})
      console.log(dict)
    }
  },
})
