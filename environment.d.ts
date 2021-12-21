declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BOT_TOKEN: string
      GUILD_ID: string
      ENVIRONMENT: 'dev' | 'prod' | 'debug'
      EZDB: string
      TEST_SERVER: string
    }
  }
}

export {}
