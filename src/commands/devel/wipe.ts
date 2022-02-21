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

    if (!TARGET && !GLOBAL) return interaction.reply('No target selected')

    if (GLOBAL) {
      await client.application.commands.set([]).catch((error) => {
        logger.fatal(error, 'Failed to wipe application commands')
      })
      return await interaction.reply({
        content: `💣 \`Commands have been wiped from the application\` 💣`,
      })
    } else {
      const targetGuild = await client.guilds.fetch(TARGET)
      await targetGuild.commands.set([]).catch((error) => {
        logger.fatal(error, 'Failed to wipe commands from guild')
      })
      return await interaction.reply({
        content: `💣 \`Commands have been wiped from guild\` 💣`,
      })
    }
  },
})
