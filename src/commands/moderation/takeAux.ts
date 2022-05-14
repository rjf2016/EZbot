import { ExtendedCommand } from '../../structures/Command'

export default new ExtendedCommand({
  name: 'takeaux',
  category: 'moderation',
  description: 'Disable any music commands for a user',
  options: [
    {
      name: 'user',
      description: 'The user to take the aux from',
      type: 'USER',
      required: true,
    },
  ],

  run: async ({ interaction }) => {
    interaction.reply('hi')
  },
})
