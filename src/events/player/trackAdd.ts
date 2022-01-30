import { PlayerEvent } from '../../structures/PlayerEvent'

export default new PlayerEvent('trackAdd', async (queue, track) => {
  return await queue.metadata.channel.send({ content: `**Added** ⏱️ \`${track.title}\` - to the **queue**!` })
})
