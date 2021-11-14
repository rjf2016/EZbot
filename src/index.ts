import { Client, Intents } from 'discord.js'
import 'dotenv/config'

const intents = new Intents(32767)
const client = new Client({ intents: intents})

client.login(process.env.EZ_BOT_TOKEN)

client.on('ready', () => {
	console.log(`${client.user?.tag} has logged in`)
})

client.login(process.env.TOKEN)
