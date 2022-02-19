import { Command } from '../../structures/Command'
import logger from '../../structures/Logger'

export default new Command({
  name: 'wipe',
  category: 'devel',
  description: 'Deletes commands',
  options: [
    {
      name: 'server',
      description: 'The guild to wipe commands from',
      type: 'STRING',
      required: true,
    },
  ],
  run: async ({ client, interaction }) => {
    const TARGET = interaction.options.getString('server')

    client.guilds
      .fetch(TARGET)
      .then((guild) => {
        guild.commands.set([])
        logger.info(`Wiped commands from ${guild.name}`)
      })
      .catch((err) => {
        logger.fatal('Failed to wipe commands ', err)
      })
    return await interaction.reply({
      content: `Commands have been wiped`,
    })
  },
})
