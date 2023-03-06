import { ExtendedCommand } from '../../structures/Command'
import { QueryType } from 'discord-player'
import { trimText } from '../../util/helpers'
import { ApplicationCommandOptionType, ActionRowBuilder, ComponentType, StringSelectMenuBuilder } from 'discord.js'
import { isProd } from '../../util/validateEnv'
import mockSearch from '../../util/mockSearchResults'
import { Logger } from '../../structures'

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
    const query = interaction.options.getString('song')
    const channel = interaction.member.voice.channel

    if (!channel) {
      return interaction.reply({
        content: 'You are not in a voice channel!',
        ephemeral: true,
      })
    }

    const res = isProd
      ? await client.player.search(query, {
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

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      new StringSelectMenuBuilder().setCustomId('select-search').setPlaceholder('Nothing selected').addOptions(mapped)
    )

    const searchResultResponse = await interaction.reply({
      content: `Search results for \`${query}\``,
      components: [row],
      ephemeral: true,
      fetchReply: true,
    })

    searchResultResponse
      .awaitMessageComponent({ componentType: ComponentType.StringSelect, time: 60000 })
      .then(async (interaction) => {
        const trackURL = interaction.values[0]

        interaction.update({ content: 'Loading your song 🎵', components: [] })

        try {
          await client.player.play(channel, trackURL, {
            nodeOptions: {
              metadata: interaction,
              leaveOnEmptyCooldown: 300000,
              leaveOnEmpty: true,
              leaveOnEnd: false,
              bufferingTimeout: 0,
              selfDeaf: true,
            },
            requestedBy: interaction.user,
          })
        } catch (e) {
          Logger.error(e)
          return interaction.followUp('Something went wrong')
        }
      })
      .catch((err) => {
        Logger.error(err)
        interaction.editReply({ content: '🐌 You took too long', components: [] })
      })
  },
})
