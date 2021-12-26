import { client } from '..'
import { Event } from '../structures/Event'
import { Table } from 'console-table-printer'
import { green } from 'chalk'

export default new Event('ready', async () => {
  console.log(green('Ezbot has logged in'))
  const table: Table = new Table({
    columns: [{ name: 'command', alignment: 'center', title: 'Commands' }],
  })

  client.commands.forEach((command) => {
    table.addRow({ command: `🟢  /${command.name}` })
  })

  table.printTable()
})
