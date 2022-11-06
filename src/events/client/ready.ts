import { client } from '../..'
import { Event } from '../../structures'
import { isProd, serverId } from '../../util/validateEnv'

export default new Event('ready', async () => {
  client.logger.info(`Started ${client.user.username}`)
  if (isProd) {
    try {
      await client.application.commands.set(client.slashCommands)
    } catch (error) {
      client.logger.error(`Failed to register global commands! ${error}`)
      return
    }
    client.logger.info('Registered commands globally! 🌎')
  } else {
    await client.guilds.cache.get(serverId).commands.set(client.slashCommands)
    client.logger.info(`Registered ${[...client.slashCommands].length} commands`)
  }
})
