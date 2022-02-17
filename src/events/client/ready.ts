import { ClientEvent } from '../../structures/ClientEvent'
import logger from '../../structures/Logger'
import { isProd } from '../../util/validateEnv'

export default new ClientEvent('ready', () => {
  if (isProd) {
    logger.info('EZbot has logged in & is ready!')
  } else {
    logger.info('Ez-BETA has logged in & is ready!')
  }
  return
})
