import pino, { BaseLogger } from 'pino'

const logger: BaseLogger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:h:MM:ss TT',
      ignore: 'pid,hostname',
    },
  },
})

export default logger
