import pino, { LoggerOptions } from 'pino'
import { isProd } from '../util/validateEnv'

const devTransport: LoggerOptions = pino.transport({
  target: 'pino-pretty',
  options: {
    colorize: true,
    translateTime: 'SYS:h:MM:ss TT',
    ignore: 'pid,hostname',
  },
})

const prodTransport: LoggerOptions = pino.transport({
  target: 'pino/file',
  options: { destination: '../logs.json' },
})

const logger = pino(isProd ? prodTransport : devTransport)
export { logger }
