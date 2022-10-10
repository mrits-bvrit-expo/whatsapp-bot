import WAWebJS from 'whatsapp-web.js';
import User from '../Models/user.model';
import { fail } from '../utils/chalk';

export default {
	name: 'cr_user',
	type: 'admin',
	description: 'Creates new user',
	usage:
		'!cr_user <@mention>||<name>||<role>||<roll no>||<year>||<semester>||<branch>\n\t Ex: !cr_user @mandeep ||Mandeep Andey||student||19S11A1218||4||1||IT',
	exec: async (
		client: WAWebJS.Client,
		message: WAWebJS.Message,
		args: string[]
	) => {
		try {
			let userData = await User.findOne({
				mobileNo: (message.author as string).split('@')[0],
			});
			if (userData && userData.userType !== 'student') {
				let matchedArr = message.body.split('||') as string[];
				matchedArr.shift();

				let mobileNum = (message.mentionedIds as Array<string>)[0];
				mobileNum = mobileNum.split('@')[0];

				if (userData.userType === 'faculty' && matchedArr![1] === 'admin')
					client.sendMessage(
						message.from,
						'Unauthorized creation of admin by faculty'
					);
				let userobj = {
					name: matchedArr![0],
					userType: matchedArr![1],
					rollNo: matchedArr![2],
					yearOfStudy: matchedArr![3],
					semester: matchedArr![4],
					branch: matchedArr![5],
					section: matchedArr![6] || 'A',
					mobileNo: +mobileNum,
				};

				await User.create(userobj);

				client.sendMessage(message.from, 'User Created Successfully');
			} else {
				client.sendMessage(message.from, 'User unauthorized');
			}
			
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
