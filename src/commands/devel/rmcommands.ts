import { Command } from '../../structures/Command'
import logger from '../../structures/Logger'

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
        logger.info(`Wiped commands from ${guild.name}`)
      })
      .catch((err) => {
        logger.fatal('Failed to wipe commands ', err)
      })
  },
})
