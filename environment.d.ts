declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'production' | 'development'
      GUILD_ID: string
      EZDB: string
      TEST_SERVER: string
      PROD_TOKEN: string
      DEV_TOKEN: string
      EZBOT_ID: string
      EZBETA_ID: string
    }
  }
}

export {}
