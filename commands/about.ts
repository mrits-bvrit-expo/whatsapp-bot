import WAWebJS from 'whatsapp-web.js';
import { fail } from '../utils/chalk';
import { List, Buttons } from 'whatsapp-web.js';

export default {
	name: 'about',
	type: 'user',
	description: 'About this application',
	usage: '!about',
	exec: (client: WAWebJS.Client, message: WAWebJS.Message, args: string[]) => {
		try {
			// let startTime = process.hrtime();
			// let aboutData = `*Designed for Project Expo 2022 by MRITS* \n A.Mandeep \n M.Harshika \n M.Manaswini \n N.Darahaas \n\n Made with ❤️ using JS`;
			// let endTime = process.hrtime(startTime);
			let listData = new Buttons("This is body", [{body:"button1"},{body:"button2"}], null, null)
			client.sendMessage(message.from, listData)
			// message.reply(
			// 	aboutData + `\ntook ${endTime[1]} nano-seconds`,
			// 	message.from
			// );
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
