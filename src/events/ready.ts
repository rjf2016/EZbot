import { client } from '..'
import { Event } from '../structures/Event'
import { Table } from 'console-table-printer'

export default new Event('ready', async () => {
  const table: Table = new Table({
    columns: [{ name: 'command', alignment: 'center', title: 'Commands' }],
  })

  client.commands.forEach((command) => {
    table.addRow({ command: `🟢 ... /${command.name}` })
  })

  table.printTable()
})
