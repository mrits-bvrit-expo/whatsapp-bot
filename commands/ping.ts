import WAWebJS from 'whatsapp-web.js';
import { fail } from '../utils/chalk';

export default {
	name: 'ping',
	type: 'user',
	description: 'Ping status of the application',
	exec: (client: WAWebJS.Client, message: WAWebJS.Message, args: string[]) => {
		try {
			let startTime = process.hrtime();
			let endTime = process.hrtime(startTime);
			message.reply(`took ${endTime[0]} seconds`, message.from);
		} catch (err) {
			fail(err);
		}
	},
};
