import { Message } from 'discord.js'
import { Event } from '../structures/Event'

export default new Event('messageCreate', async (message: Message) => {
  if (message.author.bot || !message.guild) return
  console.log(message.author.username + ':', message.content)
})
