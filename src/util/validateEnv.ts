export const isProd: boolean = process.env.NODE_ENV === 'production'
/**
 * `botToken = isProd ? <PROD_TOKEN> : <DEV_TOKEN>`
 */
export const botToken: string = process.env.NODE_ENV === 'production' ? process.env.PROD_TOKEN : process.env.DEV_TOKEN

/**
 * `serverId = isProd ? <GUILD_ID> : <TEST_SERVER>`
 */
export const serverId: string = process.env.NODE_ENV === 'production' ? process.env.GUILD_ID : process.env.TEST_SERVER
