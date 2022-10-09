import WAWebJS from 'whatsapp-web.js';
import User from '../Models/user.model';
import { fail } from '../utils/chalk';

export default {
	name: 'rm_user',
	type: 'admin',
	description: 'removes existing user',
	usage: '!rm_user <@mention>\t\n Ex: !rm_user @mandeep',

	exec: async (
		client: WAWebJS.Client,
		message: WAWebJS.Message,
		args: string[]
	) => {
		try {
			let userData = await User.findOne({
				mobileNo: (message.author as string).split('@')[0],
			});
			let taggedUser = await message.getMentions();
			if (userData && userData?.userType === 'admin' && taggedUser[0].number) {
				await User.findOneAndDelete({ mobileNo: taggedUser[0].number });
				client.sendMessage(message.from, 'User deleted successfully');
			} else if (
				userData &&
				userData?.userType === 'faculty' &&
				taggedUser[0].number
			) {
				let requestedUser = await User.findOne({
					mobileNo: taggedUser[0].number,
				});
				if (requestedUser && requestedUser?.userType === 'student') {
					await User.findOneAndDelete({ mobileNo: taggedUser[0].number });
				} else {
					client.sendMessage(message.from, 'User unauthorized');
				}
			} else {
				client.sendMessage(message.from, 'User unauthorized');
			}
			// console.log(message.body);
			// let msgArr = message.body.split('"');
			// console.log(msgArr);
			// console.log(message.mentionedIds);
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
