// Helper to validate environment variables - mostly to give users more info if they are missing env variables
import { redBright, green } from "chalk"

export const validateEnv = () => {
	if (!process.env.BOT_TOKEN) {
		console.warn(redBright('MISSING ENV VARIABLE: <BOT_TOKEN>'))
		return false
	}

	console.log(green('Found correct environment variables'))
	return true
}