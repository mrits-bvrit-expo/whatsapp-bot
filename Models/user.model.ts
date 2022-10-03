import { Schema, model } from 'mongoose';
import { AttendanceSchema } from './attendance.model';

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
	attendance: Schema;
	marks: Schema;
	mobileNo: number;
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
	mobileNo: {
		type: Number,
		required: true,
	},
});

export default model('user', UserSchema);
