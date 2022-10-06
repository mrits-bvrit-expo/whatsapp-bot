import WAWebJS from 'whatsapp-web.js';
import Assignment from '../Models/assignment.model';
import User from '../Models/user.model';
import { fail } from '../utils/chalk';

export default {
	name: 'assignment',
	type: 'user',
	description: 'Lists assignments and submits assignments',
	usage: '!assignment',
	exec: async (
		client: WAWebJS.Client,
		message: WAWebJS.Message,
		args: string[]
	) => {
		try {
			let msg = `*Choose one of the options below*\n\na)List assignments\nb)Submit Assignment\nc)List students who submitted`;
			client.sendMessage(message.from, msg);

			const messageHandler1 = async (message2: WAWebJS.Message) => {
				if (message2.body.toLowerCase().trim() === 'a') {
					let userData = await User.findOne({
						mobileNo: (message.author as string).split('@')[0],
					});
					if (userData) {
						let assignmentData = await Assignment.findOne({
							yearOfStudy: userData.yearOfStudy,
							branch: userData.branch,
							semester: userData.semester,
						});
						if (assignmentData && assignmentData.assignment.length > 0) {
							let msg = '*Your assignments*\n\n';
							assignmentData.assignment.forEach((assgn, i) => {
								msg += `${i + 1})${assgn.subjectName}(${
									assgn.description
								})\t[__${assgn.deadLine}__]\n`;
							});
							client.sendMessage(message.from, msg);
							client.removeListener('message', messageHandler1);
						} else {
							client.sendMessage(
								message.from,
								`You don't have any assignments currently`
							);
							client.removeListener('message', messageHandler1);
						}
					} else {
						client.sendMessage(
							message.from,
							`Student not found, please register`
						);
						client.removeListener('message', messageHandler1);
					}
				} else if (message2.body.toLowerCase().trim() === 'b') {
					let userData = await User.findOne({
						mobileNo: (message.author as string).split('@')[0],
					});

					if (userData) {
						let assignmentData = await Assignment.findOne({
							yearOfStudy: userData.yearOfStudy,
							branch: userData.branch,
							semester: userData.semester,
						});
						if (assignmentData && assignmentData.assignment.length > 0) {
							let msg = '*Your assignments*\n\n';
							assignmentData.assignment.forEach((assgn, i) => {
								msg += `${i + 1})${assgn.subjectName}(${
									assgn.description
								})\t[__${assgn.deadLine}__]\n`;
							});
							msg +=
								'\n*Select the option of the assignment you like to submit*\n';

							client.sendMessage(message.from, msg);
							client.removeListener('message', messageHandler1);
							const messageHandler2 = async (message2: WAWebJS.Message) => {
								if (
									parseInt(message2.body) &&
									assignmentData!.assignment.length >=
										parseInt(message2.body) - 1
								) {
									let msg = `*Please upload you ${
										assignmentData!.assignment[parseInt(message2.body) - 1]
											.subjectName
									} assignment*`;
									client.sendMessage(message.from, msg);
									client.removeListener('message', messageHandler2);
									const mediaMessageHandler = async (
										message3: WAWebJS.Message
									) => {
										if (message3.hasMedia) {
											await Assignment.findOneAndUpdate(
												{
													yearOfStudy: userData!.yearOfStudy,
													branch: userData!.branch,
													semester: userData!.semester,
													assignment: {
														$elemMatch: {
															subjectName:
																assignmentData?.assignment[
																	parseInt(message2.body) - 1
																].subjectName,
															assignmentNo:
																assignmentData?.assignment[
																	parseInt(message2.body) - 1
																].assignmentNo,
														},
													},
												},
												{
													$push: {
														'assignment.$.submittedStudents': userData?._id,
													},
												}
											);
											client.sendMessage(
												message.from,
												'Successfully submitted the assignment'
											);
										}
										client.removeListener('message', mediaMessageHandler);
									};
									client.on('message', mediaMessageHandler);
								} else {
									client.sendMessage(
										message.from,
										`There are no assignments or wrong option selected`
									);
									client.removeListener('message', messageHandler2);
								}
							};
							client.on('message', messageHandler2);
						} else {
							client.sendMessage(
								message.from,
								`You don't have any assignments currently`
							);
						}
					} else {
						client.sendMessage(
							message.from,
							`Student not found, please register`
						);
					}
				} else if (message2.body.toLowerCase().trim() === 'c') {
					let userData = await User.findOne({
						mobileNo: (message.author as string).split('@')[0],
					});
					if (userData) {
						let assignmentData = await Assignment.findOne({
							yearOfStudy: userData.yearOfStudy,
							branch: userData.branch,
							semester: userData.semester,
						});
						if (assignmentData && assignmentData.assignment.length > 0) {
							let msg = '*Your assignments*\n\n';
							assignmentData.assignment.forEach((assgn, i) => {
								msg += `${i + 1})${assgn.subjectName}(${
									assgn.description
								})\t[__${assgn.deadLine}__]\n`;
							});
							client.sendMessage(message.from, msg);

							const messageHandler1 = async (message1: WAWebJS.Message) => {
								if (
									parseInt(message1.body) &&
									assignmentData!.assignment.length >=
										parseInt(message1.body) - 1
								) {
									let data = await Assignment.findOne({
										yearOfStudy: userData!.yearOfStudy,
										branch: userData!.branch,
										semester: userData!.semester,
										assignment: {
											$elemMatch: {
												subjectName:
													assignmentData?.assignment[
														parseInt(message1.body) - 1
													].subjectName,
												assignmentNo:
													assignmentData?.assignment[
														parseInt(message1.body) - 1
													].assignmentNo,
											},
										},
									}).populate({
										path: 'assignment.submittedStudents',
									});
									if (data && data.assignment.length > 0) {
										let msg = '*Students List*\n\n';
										let filteredArr = data.assignment.filter(
											(assgn) =>
												assgn.subjectName ===
													assignmentData?.assignment[
														parseInt(message1.body) - 1
													].subjectName &&
												assgn.assignmentNo ===
													assignmentData?.assignment[
														parseInt(message1.body) - 1
													].assignmentNo
										);

										filteredArr.forEach((arr) => {
											arr.submittedStudents.forEach((student: any, i) => {
												msg += `${i + 1})${student.name} [${student.rollNo}]`;
											});
										});
										client.sendMessage(message.from, msg);
										client.removeListener('message', messageHandler1);
									} else {
										client.sendMessage(
											message.from,
											'0 students have submitted'
										);
										client.removeListener('message', messageHandler1);
									}
								}
							};
							client.on('message', messageHandler1);
						} else {
							client.sendMessage(message.from, `No assignments found`);
						}
					}
				}
				//client.removeListener('message', messageHandler1);
			};

			client.on('message', messageHandler1);
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
