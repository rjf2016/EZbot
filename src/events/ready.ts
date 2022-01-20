import { Event } from '../structures/Event'
import { isProd } from '../util/validateEnv'

export default new Event('ready', async () => {
  if (isProd) {
    console.log('EZbot is ready')
    return
  } else {
    console.log('Ez-BETA has logged in')
  }
})
