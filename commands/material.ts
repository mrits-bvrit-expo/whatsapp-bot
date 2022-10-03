import WAWebJS, { Buttons, List } from 'whatsapp-web.js';
import { fail } from '../utils/chalk';

export default {
	name: 'material',
	type: 'user',
	description: 'Study material for the students',
	exec: (client: WAWebJS.Client, message: WAWebJS.Message, args: string[]) => {
		try {
			// // const buttons = new Buttons(
			// // 	'select a button',
			// // 	[
			// // 		{ id: 'cse', body: 'CSE' },
			// // 		{ id: 'it', body: 'IT' },
			// // 		{ id: 'ece', body: 'ECE' },
			// // 	],
			// // 	'Please select your branch'
			// // );
			// const list = new List(
			// 	'please select a branch',
			// 	'Department',
			// 	[
			// 		{
			// 			title: 'Select Your Department',
			// 			rows: [
			// 				{ id: 'cse', title: 'CSE', description: 'Computer Science' },
			// 				{ id: 'it', title: 'IT', description: 'Information Technology' },
			// 			],
			// 		},
			// 	],
			// 	'Select Your Department'
			// );

			const list = [
				{ id: 'cse', title: 'CSE', description: 'Computer Science' },
				{ id: 'it', title: 'IT', description: 'Information Technology' },
				{
					id: 'ece',
					title: 'ECE',
					description: 'Electronics And Communication',
				},
			];

			let msg = `*Please select your branch*\n`;
			list.forEach((li, i) => (msg += `${i + 1}) ${li.title} \n`));
			msg += '\n```Select your option i.e CSE,IT,ECE```';

			client.sendMessage(message.author as string, msg);
			const messageHandler = (message: WAWebJS.Message) => {
				if (message.body.toLowerCase().trim() === 'cse') {
					client.sendMessage(message.from as string, 'selected CSE');
				}
				client.removeListener('message', messageHandler);
			};

			client.on('message', messageHandler);

			//console.log(...client.listeners('message'));
		} catch (err) {
			fail(err);
		}
	},
};
