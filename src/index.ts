if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

import EZclient from './structures/Client'

export const client = new EZclient()

client.start()
