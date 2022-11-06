import { EmbedBuilder } from 'discord.js'
import { ExtendedCommand } from '../../structures/Command'
import { version as PKG_VERSION } from '../../../package.json'
import { prettifyMS } from '../../util/helpers'

export default new ExtendedCommand({
  name: 'ping',
  category: 'info',
  description: 'check EZbot latency in ms',
  run: async ({ client, interaction }) => {
    const embed = new EmbedBuilder()
      .setTitle(`${client.user.username}`)
      .setThumbnail('https://imgur.com/Lwshqf5.png')
      .setDescription(
        `
        🤖\u200B Version: \u200B\u200B\u200B ** v${PKG_VERSION} **

        ⏳\u200B Ping: \u200B\u200B\u200B\u200B\u200B ** ${client.ws.ping}ms **

        🏠\u200B Servers: \u200B\u200B\u200B ** ${client.guilds.cache.size} **

        ☕\u200B Up time: \u200B\u200B\u200B ** ${prettifyMS(client.uptime)} **

        💻\u200B Memory: \u200B\u200B\u200B ** ${(process.memoryUsage().heapUsed / (1024 * 1024)).toFixed()}MB   **
        `
      )
    await interaction.reply({ embeds: [embed] })
    return
  },
})
