import WAWebJS from 'whatsapp-web.js';
import { fail } from '../utils/chalk';

export default {
	name: 'about',
	type: 'user',
	description: 'About this application',
	exec: (client: WAWebJS.Client, message: WAWebJS.Message, args: string[]) => {
		try {
			let startTime = process.hrtime();
			let aboutData = `*Designed for Project Expo 2022 by MRITS* \n A.Mandeep \n M.Manaswini \n N.Darahaas \n\n Made with ❤️ using JS`;
			let endTime = process.hrtime(startTime);
			message.reply(
				aboutData + `\ntook ${endTime[1]} nano-seconds`,
				message.from
			);
		} catch (err) {
			fail(err);
		}
	},
};
