import WAWebJS, { MessageMedia } from 'whatsapp-web.js';
import { resolve } from 'path';
import { fail } from '../utils/chalk';
import User from '../Models/user.model';
export default {
	name: 'profile',
	type: 'user',
	description: 'Displays the user information',
	usage:
		'!profile or !profile <@mention> or !profile <roll no>\n\t Ex: !profile 19S11A1218 or !acal @mandeep',
	exec: async (
		client: WAWebJS.Client,
		message: WAWebJS.Message,
		args: string[]
	) => {
		try {
			let userData;
			let taggedUser = await message.getMentions();
			if (args.length === 1 && taggedUser.length === 1) {
				userData = await User.findOne({
					mobileNo: taggedUser[0]['number'],
				});
			} else if (args.length === 1 && taggedUser.length === 0) {
				userData = await User.findOne({ rollNo: args[0] });
			} else if (args.length === 0 && taggedUser.length === 0) {
				userData = await User.findOne({
					mobileNo: (message.author as string).split('@')[0],
				});
			}
			if (userData && userData.name) {
				let msg = '*Details* \n\n';
				msg += `🟢*Name*: ${userData.name}\n🟢*Branch*: ${userData.branch}\n🟢*Year*:${userData.yearOfStudy}\n🟢*Semester*: ${userData.semester}\n🟢*roll no*: ${userData.rollNo}\n🟢*mobile*: ${userData.mobileNo}`;
				client.sendMessage(message.from, msg);
			} else {
				client.sendMessage(message.from, 'User not found');
			}
		} catch (err) {
			client.sendMessage(message.from, `${err}`);
			fail(err);
			client.sendMessage(message.from, `User not found`);
		}
	},
};
