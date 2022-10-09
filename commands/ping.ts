import WAWebJS from 'whatsapp-web.js';
import { fail } from '../utils/chalk';

export default {
	name: 'ping',
	type: 'user',
	description: 'Ping status of the application',
	usage: '!ping',
	exec: (client: WAWebJS.Client, message: WAWebJS.Message, args: string[]) => {
		try {
			let startTime = process.hrtime();
			let endTime = process.hrtime(startTime);
			message.reply(`took ${endTime[1]} nano-seconds`, message.from);
		} catch (err) {
			fail(err);
			client.sendMessage(message.from, `${err}`);
			client.sendMessage(
				message.from,
				'Error occured, please contact developer'
			);
		}
	},
};
