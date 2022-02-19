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
    },
    {
      name: 'global',
      description: 'Deletes application level commands, note this may take an hour to take effect',
      type: 'BOOLEAN',
    },
  ],
  run: async ({ client, interaction }) => {
    const TARGET = interaction.options.getString('server')
    const GLOBAL = interaction.options.getBoolean('global')

    if (GLOBAL) {
      client.application.commands
        .set([])
        .then(() => {
          logger.info(`Wiped application commands`)
        })
        .catch((err) => {
          logger.fatal(`Failed to wipe commands from application ${err}`)
          return
        })
      return await interaction.reply({
        content: `💣 \`Commands have been wiped from the application\` 💣`,
      })
    } else {
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
        content: `💣 \`Commands have been wiped from guild\` 💣`,
      })
    }
  },
})
