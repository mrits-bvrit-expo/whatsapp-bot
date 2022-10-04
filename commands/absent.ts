import WAWebJS from 'whatsapp-web.js';
import { fail } from '../utils/chalk';
import User from '../Models/user.model';

export default {
	name: 'absent',
	type: 'faculty',
	description: 'marking attendance of the students',
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
				for (const rollNo of args) {
					let student = await User.findOne({ rollNo });
					if (
						student?.userType === 'student' &&
						student.attendance &&
						(student.attendance as any).semester === student.semester
					) {
						await User.findOneAndUpdate(
							{ rollNo },
							{ $push: { 'attendance.absent': new Date(Date.now()) } }
						);
					} else if (student?.userType === 'student' && !student.attendance) {
						await User.findOneAndUpdate(
							{ rollNo },
							{
								attendance: {
									semester: student.semester,
									yearOfStudy: student.yearOfStudy,
									noWorkingDays: 100,
									absent: [new Date(Date.now())],
								},
							}
						);
					} else {
						client.sendMessage(
							message.from,
							`Student with rollNo ${rollNo} not found`
						);
					}
				}
				client.sendMessage(message.from, `Updated Attendance successfully`);
			} else {
				client.sendMessage(message.from, 'Unauthorized User');
			}
		} catch (err) {
			fail(err);
		}
	},
};
