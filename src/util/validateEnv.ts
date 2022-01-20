/**
 *
 * *true* if running production env
 */
export const isProd: boolean = process.env.NODE_ENV === 'production'

/**
 *
 * dev_token *or*  prod_token
 */
export const botToken: string = process.env.NODE_ENV === 'production' ? process.env.PROD_TOKEN : process.env.DEV_TOKEN
