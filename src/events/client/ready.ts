import { ActivityType } from 'discord.js'
import { client } from '../..'
import { Event, Logger } from '../../structures'
import { isProd, serverId } from '../../util/validateEnv'

export default new Event('ready', async () => {
  client.user.setPresence({
    status: 'online',
    activities: [
      {
        name: 'Music',
        type: ActivityType.Playing,
      },
    ],
  })

  Logger.info(`Started ${client.user.username}`)
  if (isProd) {
    try {
      await client.application.commands.set(client.slashCommands)
    } catch (error) {
      Logger.error(`Failed to register global commands! ${error}`)
      return
    }
    Logger.info('Registered commands globally! 🌎')
  } else {
    await client.guilds.cache.get(serverId).commands.set(client.slashCommands)
    Logger.info(`Registered ${[...client.slashCommands].length} commands`)
  }
})
