import { Command } from '../../structures/Command'

export default new Command({
  name: 'rmcommands',
  category: 'devel',
  description: 'Deletes commands',
  options: [
    {
      name: 'guild',
      description: 'The guild to wipe commands from',
      type: 'ROLE',
    },
  ],
  run: async ({ client, interaction }) => {
    const INPUT_GUILD = interaction.options.getString('guild')

    client.guilds
      .fetch(INPUT_GUILD)
      .then((guild) => {
        guild.commands.set([])
        client.logger.info(`Wiped commands from ${guild.name}`)
      })
      .catch((err) => {
        client.logger.fatal('Failed to wipe commands ', err)
      })
  },
})
