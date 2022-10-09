import WAWebJS from 'whatsapp-web.js';
import Assignment from '../Models/assignment.model';
import User from '../Models/user.model';
import { fail } from '../utils/chalk';

export default {
	name: 'add_assignment',
	type: 'admin',
	description: 'Creates a new assignment for students',
	usage:
		'!add_assignment ||<branch>||<year>||<semester>||<section>||<subject name>||<assignment no>||<deadline>||<description>\n\t Ex: !add_assignment ||IT||4||1||A||RS&GIS||1||10-10-2022||Remote Sensing assignment 1',
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
				let matchedArr = message.body.split('||');
				matchedArr.shift();

				let assignmentData = await Assignment.findOne({
					branch: matchedArr[0],
					yearOfStudy: +matchedArr[1],
					semester: +matchedArr[2],
				});

				if (!assignmentData) {
					let obj = {
						branch: matchedArr[0],
						yearOfStudy: +matchedArr[1],
						semester: +matchedArr[2],
						section: matchedArr[3],
						assignment: {
							subjectName: matchedArr[4].toUpperCase(),
							assignmentNo: +matchedArr[5],
							deadLine: matchedArr[6],
							description: matchedArr[7],
							submittedStudents: [],
						},
					};
					await Assignment.create(obj);
					client.sendMessage(message.from, 'Assignment added successfully');
				} else {
					let assignmentData = await Assignment.findOne({
						branch: matchedArr[0],
						yearOfStudy: +matchedArr[1],
						semester: +matchedArr[2],
						assignment: {
							$elemMatch: {
								subjectName: matchedArr[4].toUpperCase(),
								assignmentNo: +matchedArr[5],
							},
						},
					});
					if (!assignmentData) {
						let obj = {
							subjectName: matchedArr[4].toUpperCase(),
							assignmentNo: +matchedArr[5],
							deadLine: matchedArr[6],
							description: matchedArr[7],
							submittedStudents: [],
						};
						await Assignment.findOneAndUpdate(
							{
								branch: matchedArr[0],
								yearOfStudy: +matchedArr[1],
								semester: +matchedArr[2],
							},
							{ $push: { assignment: obj } }
						);
						client.sendMessage(message.from, 'Assignment added successfully');
					} else {
						client.sendMessage(message.from, 'Assignment exists already');
					}
				}
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
