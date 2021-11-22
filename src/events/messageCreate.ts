import { Message } from 'discord.js';
import { client } from '..'
import { Event } from "../structures/Event";

export default new Event('messageCreate', async (message: Message) => {
	console.log(`${message.author.tag} just sent a message`)
})