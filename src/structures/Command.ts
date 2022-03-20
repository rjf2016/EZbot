import { CommandType } from '../types/Command'

export class ExtendedCommand {
  constructor(commandOptions: CommandType) {
    Object.assign(this, commandOptions)
  }
}
