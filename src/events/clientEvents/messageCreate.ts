import { Message } from 'discord.js'
import { Event } from '../../structures/Event'
import { cyan } from 'chalk'
import { emoji } from '../../util/emojiChar'

export default new Event('messageCreate', async (message: Message) => {
  if (message.author.id === '282859044593598464') {
    await message.react(emoji.s)
    await message.react(emoji.t)
    await message.react(emoji.i)
    await message.react(emoji.n)
    await message.react(emoji.k)
    await message.react(emoji.e)
    await message.react(emoji.r)
    return
  }
  if (message.author.bot || !message.guild) return
  console.log(cyan(message.author.username) + ':', message.content)
})
