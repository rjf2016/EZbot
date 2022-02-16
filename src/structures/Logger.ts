import winston from 'winston'
import { isProd } from '../util/validateEnv'

const customLevels = {
  levels: {
    trace: 5,
    debug: 4,
    info: 3,
    warn: 2,
    error: 1,
    fatal: 0,
  },
}

class Logger {
  private logger: winston.Logger

  constructor() {
    const { combine, colorize, align, timestamp, printf, json } = winston.format

    const prodTransport = new winston.transports.File({
      filename: `${__dirname}/../logs/error.log`,
      level: 'error',
      format: json(),
    })
    const devTransport = new winston.transports.Console({
      level: 'trace',
      format: combine(
        colorize(),
        align(),
        timestamp({ format: 'hh:mm:ss' }),
        printf(
          ({ timestamp, level, message, ...meta }) =>
            `${timestamp} ${level}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`
        )
      ),
    })
    this.logger = winston.createLogger({
      levels: customLevels.levels,
      transports: isProd ? prodTransport : devTransport,
    })
  }

  trace(msg: string, meta?: any) {
    this.logger.log('trace', msg, meta)
  }

  debug(msg: string, meta?: any) {
    this.logger.debug(msg, meta)
  }

  info(msg: string, meta?: any) {
    this.logger.info(msg, meta)
  }

  warn(msg: string, meta?: any) {
    this.logger.warn(msg, meta)
  }

  error(msg: string, meta?: any) {
    this.logger.error(msg, meta)
  }

  fatal(msg: string, meta?: any) {
    this.logger.log('fatal', msg, meta)
  }
}

export default Logger
