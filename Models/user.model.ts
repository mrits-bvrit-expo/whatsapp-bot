import { Schema, model } from 'mongoose';
import { AttendanceSchema } from './attendance.model';

interface Attendance {
	semester: number;
	yearOfStudy: number;
	noWorkingDays: number;
	absent: Date[];
}
enum userType {
	admin,
	faculty,
	student,
}
interface user {
	userType: string;
	name: string;
	rollNo: string;
	yearOfStudy: number;
	semester: number;
	attendance: Attendance;
	marks: Schema;
	mobileNo: number;
	branch: string;
	section: string;
}

const UserSchema = new Schema<user>({
	name: {
		type: String,
		required: true,
	},
	userType: {
		type: String,
		enum: userType,
	},
	rollNo: {
		type: String,
		required: true,
	},
	yearOfStudy: {
		type: Number,
		required: true,
	},
	semester: {
		type: Number,
		required: true,
	},
	attendance: {
		type: AttendanceSchema,
	},
	branch: {
		type: String,
		enum: ['CSE', 'ECE', 'IT'],
		required: true,
	},
	section: {
		type: String,
		default: 'A',
	},
	mobileNo: {
		type: Number,
		required: true,
	},
});

export default model('user', UserSchema);
