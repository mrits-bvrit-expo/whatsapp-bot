import WAWebJS, { MessageMedia } from 'whatsapp-web.js';
import QuickChart from 'quickchart-js';
import { fail } from '../utils/chalk';
import User from '../Models/user.model';

export default {
	name: 'attendance',
	type: 'student',
	description: 'for fetching attendance details',
	exec: async (
		client: WAWebJS.Client,
		message: WAWebJS.Message,
		args: string[]
	) => {
		try {
			let taggedUser = await message.getMentions();
			let userData: any;
			if (args.length > 0 && taggedUser.length > 0) {
				userData = await User.findOne({
					mobileNo: taggedUser[0]['number'],
				});
			} else if (args.length === 1 && taggedUser.length === 0) {
				userData = await User.findOne({ rollNo: args[0] });
			} else {
				userData = await User.findOne({
					mobileNo: (message.author as string).split('@')[0],
				});
			}
			if (userData && userData.userType === 'student') {
				let userPresent =
					userData.attendance.noWorkingDays - userData.attendance.absent.length;

				let avg = await User.aggregate([
					{
						$group: {
							_id: {
								yearOfStudy: '$yearOfStudy',
								branch: '$branch',
								semester: '$semester',
							},
							avg: { $avg: { $size: '$attendance.absent' } },
						},
					},
				]);
				let requiredArr = avg.filter(
					(data) =>
						data._id.yearOfStudy === userData?.yearOfStudy &&
						data._id.branch === userData?.branch &&
						data._id.semester === userData?.semester
				);
				let averageAttendance =
					userData.attendance.noWorkingDays - requiredArr[0].avg;

				const myChart = new QuickChart();
				myChart.setConfig({
					type: 'bar',
					data: {
						datasets: [
							{
								label: 'current attendance',
								data: [userPresent],
							},
							{ label: 'avg attendance', data: [averageAttendance] },
							{
								label: 'total working days',
								data: [userData.attendance.noWorkingDays],
							},
						],
					},
				});
				let chartBin = await myChart.toBinary();
				const media = new MessageMedia(
					'image/png',
					Buffer.from(chartBin).toString('base64')
				);
				client.sendMessage(message.from, media, {
					caption: `*Name*: ${userData.name}\n*Branch*: ${userData.branch}\n*Year*: ${userData.yearOfStudy}\n*Section*: ${userData.section}`,
				});
			} else {
				client.sendMessage(message.from, 'User Not found or not a student');
			}
		} catch (err) {
			fail(err);
		}
	},
};
