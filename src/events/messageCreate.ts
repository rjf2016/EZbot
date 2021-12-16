import { Message } from 'discord.js'
import { Event } from '../structures/Event'
import { cyan } from 'chalk'

export default new Event('messageCreate', async (message: Message) => {
  if (message.author.bot || !message.guild) return
  console.log(cyan(message.author.username) + ':', message.content)
})
