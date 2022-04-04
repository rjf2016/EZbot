import { ExtendedClient } from '../structures'
import { promisify } from 'util'
import { CommandType } from '../types/Command'
import glob from 'glob'
import { isProd } from '../util/validateEnv'

const globPromise = promisify(glob)

export const loadCommands = async (client: ExtendedClient, dir: string) => {
  const commandFolders = !isProd ? '*' : '!(devel)'
  const commandFiles = await globPromise(`${dir}/../commands/${commandFolders}/*{.ts,.js}`)
  commandFiles.forEach(async (filePath: string) => {
    const command: CommandType = (await import(filePath))?.default
    if (!command.name) {
      client.logger.error(`Failed to load command from ${command}`)
      return
    }
    client.commands.set(command.name, command)
    client.slashCommands.push(command)
  })
  client.logger.info(`Loaded ${commandFiles.length} commands`)
}