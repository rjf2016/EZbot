import { Command } from '../../structures/Command'

export default new Command({
  name: 'poll',
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
          description: 'The first choice a user can pick',
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
      const data = interaction.options.data[0].options
      const question = data.shift().value
      console.log(question)

      console.log(data)
    }
  },
})
