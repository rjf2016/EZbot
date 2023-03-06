import { GuildQueue } from 'discord-player'
import { Logger, PlayerEvent } from '../../structures'
import { ExtendedInteraction } from '../../types/Command'

export default new PlayerEvent('audioTrackAdd', (queue: GuildQueue<ExtendedInteraction>, track) => {
  Logger.info('Track added to queue')
  const current = queue.currentTrack
  if (current && current.id !== track.id) queue.metadata.channel.send({ content: `**${track.title}** added to queue!` })
})
