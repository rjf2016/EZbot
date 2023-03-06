import { ExtendedClient, Logger } from '../structures'
import { promisify } from 'util'
import { CommandType } from '../types/Command'
import glob from 'glob'

const globPromise = promisify(glob)

export const loadCommands = async (client: ExtendedClient, dir: string) => {
  const commandFiles = await globPromise(`${dir}/../commands/*/*{.ts,.js}`)
  commandFiles.forEach(async (filePath: string) => {
    const command: CommandType = (await import(filePath))?.default
    if (!command.name) {
      Logger.error(`Failed to load command from ${command}`)
      return
    }
    client.commands.set(command.name, command)
    client.slashCommands.push(command)
  })
  Logger.info(`Loaded ${commandFiles.length} commands`)
}
