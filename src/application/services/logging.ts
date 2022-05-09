import winston, { format } from 'winston'

class Logger {
  private logger: winston.Logger
  public meta: Record<string, any>
  
  constructor(meta: Record<string, any>) {
    this.logger = winston.createLogger({
      level: 'info',
      format: format.combine(format.splat(), format.json()),
      defaultMeta: { service: 'auth-service' },
      transports: new winston.transports.Console({}),
    })

    this.meta = meta
  }

  error(message: string | object, meta?: Record<string, any>) {
    this.logger.error(typeof message !== 'string' ? JSON.stringify(message) : String(message), this.merged(meta))
  }

  warn(message: string, meta?: Record<string, any>) {
    this.logger.warn(typeof message !== 'string' ? JSON.stringify(message) : String(message), this.merged(meta))
  }

  info(message: string | object, meta?: Record<string, any>) {
    this.logger.info(typeof message !== 'string' ? JSON.stringify(message) : String(message), this.merged(meta))
  }

  debug(message: string, meta?: Record<string, any>) {
    this.logger.debug(typeof message !== 'string' ? JSON.stringify(message) : String(message), this.merged(meta))
  }

  private merged(extra: Record<string, any> | undefined) {
    if (!extra) {
      return this.meta
    }

    return Object.assign(this.meta, extra)
  }
}

const logger = new Logger({})

export default logger
