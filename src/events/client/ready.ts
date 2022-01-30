import { ClientEvent } from '../../structures/ClientEvent'
import { isProd } from '../../util/validateEnv'

export default new ClientEvent('ready', async () => {
  if (isProd) {
    console.log('EZbot is ready')
  } else {
    console.log('Ez-BETA has logged in')
  }
  return
})
