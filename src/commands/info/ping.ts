import { Command } from "../../structures/Command"

export default new Command({
	name: 'ping',
	description: 'replis with pong',
	run: async({ interaction }) => {
		interaction.followUp('Pong')
	}
})