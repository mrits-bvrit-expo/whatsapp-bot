import WAWebJS from 'whatsapp-web.js';
import User from '../Models/user.model';
import { fail } from '../utils/chalk';

export default {
	name: 'cr-user',
	type: 'admin',
	description: 'Creates new user',
	exec: async (
		client: WAWebJS.Client,
		message: WAWebJS.Message,
		args: string[]
	) => {
		try {
			const bodyExp = new RegExp(/(?:"[^"]*"|^[^"]*$)/gi);
			let matchedArr = message.body.match(bodyExp);
			for (let i = 0; i < matchedArr!.length; i++) {
				matchedArr![i] = matchedArr![i].replace(/"/g, '');
			}

			let mobileNum = (message.mentionedIds as Array<string>)[0];
			mobileNum = mobileNum.split('@')[0];

			console.log(matchedArr);
			let userobj = {
				name: matchedArr![0],
				userType: matchedArr![1],
				rollNo: matchedArr![2],
				yearOfStudy: matchedArr![3],
				semester: matchedArr![4],
				mobileNo: +mobileNum,
			};

			let data = await User.create(userobj);
			console.log(data);
			client.sendMessage(message.from, 'User Created Successfully');
			// console.log(message.body);
			// let msgArr = message.body.split('"');
			// console.log(msgArr);
			// console.log(message.mentionedIds);
		} catch (err) {
			fail(err);
		}
	},
};
