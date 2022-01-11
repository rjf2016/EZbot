require('dotenv').config()
import ExtendedClient from './structures/Client'
import process from 'process'
import { yellow, red } from 'chalk'

export const client = new ExtendedClient()

client.start()

process.on('warning', (warning) => {
  console.warn(yellow('Warning: '))
  console.warn(warning.name)
  console.warn(warning.message)
  console.warn(warning.stack)
})
