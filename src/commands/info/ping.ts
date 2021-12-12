import { Command } from '../../structures/Command'

export default new Command({
  name: 'ping',
  category: 'info',
  description: 'check EZbot latency in ms ',
  run: async ({ client, interaction }) => {
    return await interaction.reply({ content: `${client.ws.ping}ms` })
  },
})
