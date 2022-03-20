import { ExtendedCommand } from '../../structures/Command'

export default new ExtendedCommand({
  name: 'ping',
  category: 'info',
  description: 'check EZbot latency in ms',
  run: async ({ client, interaction }) => {
    return await interaction.reply({ content: `${client.ws.ping}ms` })
  },
})
