import { MessageEmbedOptions } from 'discord.js'
import { Command } from '../../structures/Command'
import { emoji } from '../../util/emojiChar'

export default new Command({
  name: 'poll',
  category: 'utility',
  description: 'A poll voting system',
  options: [
    {
      name: 'create',
      description: 'Create a new poll',
      type: 'SUB_COMMAND_GROUP',
      options: [
        {
          name: 'yes-no',
          description: 'Create a simple yes or no poll',
          type: 'SUB_COMMAND',
          options: [
            {
              name: 'question',
              description: 'The question on the poll',
              required: true,
              type: 'STRING',
            },
          ],
        },
        {
          name: 'multiplechoice',
          description: 'Create a multiple choice poll',
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
              description: 'The first choice a user can pick.',
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
    },
    // {
    //   name: 'close',
    //   description: 'Close current poll',
    //   type: 'SUB_COMMAND_GROUP',
    //   options: [
    //     {
    //       name: 'byid',
    //       description: 'Find an open poll by ID',
    //       type: 'SUB_COMMAND',
    //       options: [
    //         {
    //           name: 'id',
    //           description: 'The ID of the poll you want to close',
    //           type: 'STRING',
    //           required: true,
    //         },
    //       ],
    //     },
    //     {
    //       name: 'find',
    //       description: 'Find the poll you want to close',
    //       type: 'SUB_COMMAND',
    //       options: [
    //         {
    //           name: 'view',
    //           description: 'View open polls',
    //           type: 'BOOLEAN',
    //           required: true,
    //         },
    //       ],
    //     },
    //   ],
    // },
  ],

  run: async ({ interaction }) => {
    const subCommandGroup = interaction.options.getSubcommandGroup()
    const subCommand = interaction.options.getSubcommand()

    if (subCommandGroup === 'create') {
      const [question, ...answers] = interaction.options.data[0].options[0].options.map(({ value }) => value as string)
      const answerEmojis: string[] = []
      let pollEmbed: MessageEmbedOptions

      if (subCommand === 'yes-no') {
        // const footer = 'YES | NO = 👍 | 👎'
        pollEmbed = pollBuilder({ question })
        answerEmojis.push('👍', '👎')
      } else if (subCommand === 'multiplechoice') {
        const multiEmojis = ['a', 'b', 'c', 'd', 'e']
        const description = answers.reduce(function (acc, answer, i) {
          let currentEmoji = emoji[multiEmojis[i]]
          answerEmojis.push(currentEmoji)
          return acc + `${currentEmoji} - ${answer}\n\n`
        }, '')
        pollEmbed = pollBuilder({ question, description })
      }
      const poll: any = await interaction.reply({ embeds: [pollEmbed], fetchReply: true })
      for (const answerEmoji of answerEmojis) {
        poll.react(answerEmoji)
      }
    }

    function pollBuilder({
      question,
      description = '',
    }: {
      question: string
      description?: string
      // footer?: string
    }): MessageEmbedOptions {
      return {
        title: question,
        author: {
          name: '\t New Poll',
          icon_url: interaction.user.displayAvatarURL({ format: 'png' }),
        },
        color: 'PURPLE',
        description: description,
        timestamp: new Date(),
        footer: {
          text: 'EZpolls',
        },
      }
    }
  },
})
