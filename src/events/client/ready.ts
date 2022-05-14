import { client } from '../..'
import { Event, logger } from '../../structures'
import { isProd, serverId } from '../../util/validateEnv'

export default new Event('ready', async () => {
  logger.info(`Started ${client.user.username}`)
  if (isProd) {
    try {
      await client.application.commands.set(client.slashCommands)
    } catch (error) {
      logger.error(`Failed to register global commands! ${error}`)
      return
    }
    logger.info('Registered commands globally! 🌎')
  } else {
    await client.guilds.cache.get(serverId).commands.set(client.slashCommands)
    logger.info(`Registered ${[...client.slashCommands].length} commands to ${client.guilds.cache.get(serverId).name}`)
  }
})
