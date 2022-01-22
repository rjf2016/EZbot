require('dotenv').config({ silent: true })

import ExtendedClient from './structures/Client'

export const client = new ExtendedClient()

client.start()
