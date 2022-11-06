import { ExtendedCommand } from '../../structures/Command'
import { ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, Events, SelectMenuBuilder } from 'discord.js'
import { QueryType } from 'discord-player'
import { colors } from '../../config'

export default new ExtendedCommand({
  name: 'search',
  category: 'music',
  description: 'search a track',
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

    const res = await player.search(song, {
      requestedBy: interaction.member,
      searchEngine: QueryType.AUTO,
    })

    if (!res || !res.tracks.length)
      return interaction.reply({ content: `No results found ${interaction.member}... try again ? ❌`, ephemeral: true })

    const maxTracks = res.tracks.slice(0, 5)

    const mapped = maxTracks.map(({ title, author, url, source }) => ({
      label: `${title} | ${author}`,
      description: source,
      value: url,
    }))

    const row = new ActionRowBuilder<SelectMenuBuilder>().addComponents(
      new SelectMenuBuilder().setCustomId('select-search').setPlaceholder('Nothing selected').addOptions(mapped)
    )

    interaction.reply({ content: `Search results for \`${song}\``, components: [row] })
  },
})
