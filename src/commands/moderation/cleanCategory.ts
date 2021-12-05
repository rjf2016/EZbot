import { Command } from '../../structures/Command'
import { protectedChannels } from '../../../config.json'
import { MessageActionRow, MessageButton } from 'discord.js'

//@Todo : This command can & probly should be cleaned up. Too many 'if - else' & !dry

export default new Command({
  name: 'clean',
  description: 'Delete a channel or category',
  options: [
    {
      name: 'channel',
      description: 'Delete a channel',
      type: 'SUB_COMMAND',
      options: [
        {
          name: 'channel',
          description: 'The channel to delete',
          type: 'CHANNEL',
          required: true,
          channelTypes: ['GUILD_TEXT', 'GUILD_VOICE'],
        },
      ],
    },
    {
      name: 'category',
      description: 'Delete all channels within a category',
      type: 'SUB_COMMAND',
      options: [
        {
          name: 'category',
          description: 'The category to clear',
          type: 'CHANNEL',
          required: true,
          channelTypes: ['GUILD_CATEGORY'],
        },
      ],
    },
  ],

  run: async ({ interaction }) => {
    const subCommand: string = interaction.options.getSubcommand()
    const row = new MessageActionRow().addComponents(
      new MessageButton().setCustomId('confirm').setLabel('Just do it').setStyle('SUCCESS'),
      new MessageButton().setCustomId('cancel').setLabel('Marty Im scared').setStyle('DANGER')
    )

    let message: string
    let deletable = []
    let successfulDelete: boolean = false

    if (subCommand === 'channel') {
      const CHANNEL = interaction.options.getChannel('channel')
      if (protectedChannels.includes(CHANNEL.name || CHANNEL.id)) {
        await interaction.reply({
          content: `❌ Can't delete the channel: <#${CHANNEL.id}> because it's listed as protected`,
          ephemeral: true,
        })
        return
      }
      deletable.push(CHANNEL.id)
      message = `Are you sure you want to delete <#${CHANNEL.id}>?\nThis cannot be un-done`
    } else if (subCommand == 'category') {
      const CATEGORY: any = interaction.options.getChannel('category')
      deletable = CATEGORY.children.filter(
        (channel) => !protectedChannels.includes(channel.name || channel.id)
      )
      if (protectedChannels.includes(CATEGORY.name || CATEGORY.id) || deletable.length === 0) {
        await interaction.reply({
          content: `❌ Either the category: <#${CATEGORY.id}> is protected, or I'm unable to delete any channels within it`,
          ephemeral: true,
        })
        return
      }
      message = `Are you sure you want to delete the following channels from ${CATEGORY} :\n${deletable
        .map((channel) => `${channel}\t`)
        .join('')}`
    }

    if (!message || !deletable) {
      await interaction.reply({
        content: "Uh-oh I've encountered an un-expected error 😞",
        ephemeral: true,
      })
      return
    }

    const confirm: any = await interaction.reply({
      content: message,
      components: [row],
      fetchReply: true,
    })
    const collector = await confirm.createMessageComponentCollector({
      componentType: 'BUTTON',
      time: 15000,
      max: 1,
    })

    collector.on('collect', async (ButtonInteraction) => {
      if (ButtonInteraction.customId === 'confirm') {
        try {
          await deletable.forEach((channel) => channel.delete())
        } catch (error) {
          console.error(error)
          await confirm.edit({
            content: 'Uh-oh I encountered an error while trying to clean',
            components: [],
          })
          collector.stop()
          return
        }
        successfulDelete = true
        await confirm.edit({ content: '🧼 Cleanse is complete 🧼', components: [] })
        collector.stop()
        return
      } else if (ButtonInteraction.customId === 'cancel') {
        await confirm.edit({ content: 'Cleanse aborted.. Phew that was close 😨', components: [] })
      }
    })

    collector.on('end', async (collected) => {
      if (successfulDelete) return
      await confirm.edit({ content: 'Cleanse aborted.. Phew that was close 😨', components: [] })
    })
  },
})
