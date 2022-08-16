import pino, { LoggerOptions } from 'pino'

const devTransport: LoggerOptions = pino.transport({
  target: 'pino-pretty',
  options: {
    colorize: true,
    translateTime: 'SYS:h:MM:ss TT',
    ignore: 'pid,hostname',
  },
})

const logger = pino(devTransport)
export { logger }
