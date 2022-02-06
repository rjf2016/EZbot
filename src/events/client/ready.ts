import { client } from '../..'
import { ClientEvent } from '../../structures/ClientEvent'
import { isProd } from '../../util/validateEnv'

export default new ClientEvent('ready', async () => {
  if (isProd) {
    client.logger.info('EZbot has logged in & is ready!\n', { 'CLIENT: ': client })
  } else {
    console.clear()
    client.logger.info('Ez-BETA has logged in & is ready!')
  }
  return
})
