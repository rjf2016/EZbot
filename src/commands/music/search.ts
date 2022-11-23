import { ExtendedCommand } from '../../structures/Command'
import { QueryType } from 'discord-player'
import { trimText } from '../../util/helpers'
import {
  ApplicationCommandOptionType,
  ActionRowBuilder,
  SelectMenuBuilder,
  ComponentType,
  TextChannel,
} from 'discord.js'
import { isProd } from '../../util/validateEnv'
import mockSearch from '../../util/mockSearchResults'

export default new ExtendedCommand({
  name: 'search',
  category: 'music',
  description: 'Search a track',
  options: [
    {
      name: 'song',
      description: 'the song you want to search',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  run: async ({ client, interaction }) => {
    const song = interaction.options.getString('song')
    const player = client.player
    const member = interaction.member

    if (!member.voice.channelId) {
      await interaction.reply({
        content: 'You are not in my voice channel!',
        ephemeral: true,
      })
      return
    }

    const res = isProd
      ? await player.search(song, {
          requestedBy: interaction.member,
          searchEngine: QueryType.AUTO,
        })
      : mockSearch

    if (!res || !res.tracks.length)
      return interaction.reply({ content: `No results found ${interaction.member}... try again ? ❌`, ephemeral: true })

    const maxTracks = res.tracks.slice(0, 10)

    const mapped = maxTracks.map(({ title, author, url, source, views }) => {
      const safeLabel = trimText(`${title} | ${author}`, 50)
      const emoji = views > 1000000 ? '🔥' : '💠'
      return {
        label: safeLabel,
        description: source,
        value: url,
        emoji: emoji,
      }
    })

    const row = new ActionRowBuilder<SelectMenuBuilder>().addComponents(
      new SelectMenuBuilder().setCustomId('select-search').setPlaceholder('Nothing selected').addOptions(mapped)
    )

    const searchResultResponse = await interaction.reply({
      content: `Search results for \`${song}\``,
      components: [row],
      ephemeral: true,
      fetchReply: true,
    })

    searchResultResponse
      .awaitMessageComponent({ componentType: ComponentType.SelectMenu, time: 60000 })
      .then(async (interaction) => {
        const channel = interaction.channel as TextChannel
        const trackURL = interaction.values[0]

        interaction.update({ content: 'Loading your song 🎵', components: [] })

        const queue = client.player.createQueue(interaction.guild, {
          disableVolume: true,
          leaveOnEnd: true,
          metadata: {
            channel: channel,
          },
        })

        if (!queue.connection) {
          try {
            await queue.connect(member.voice.channel)
          } catch (error) {
            client.logger.error('Failed to join voice chat', error)
            await interaction.reply({
              content: 'Could not join your voice channel!',
              ephemeral: true,
            })
            queue.destroy(true)
            return
          }
        }

        const searchResult = await client.player
          .search(trackURL, {
            requestedBy: interaction.user,
            searchEngine: QueryType.AUTO,
          })
          .catch((err) => {
            client.logger.error('Failed to get song(s)', err)
          })
        if (!searchResult) return
        queue.addTrack(searchResult.tracks[0])

        if (!queue.playing) {
          try {
            await queue.play()
          } catch (error) {
            client.logger.error(`Encountered an error trying to play song`, error)
            await interaction.update({
              content: '🤮 Uh oh, I ran into an error trying to play that song.',
            })
            return
          }
        }
      })
      .catch((err) => {
        client.logger.error(err)
        interaction.editReply({ content: '🐌 You took too long', components: [] })
      })
  },
})
