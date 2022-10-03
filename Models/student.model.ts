import { Schema, model } from 'mongoose';
import { AttendanceSchema } from '../Models/attendance.model';

interface student {
	name: string;
	rollNo: string;
	yearOfStudy: number;
	semester: number;
	attendance: Schema;
	marks: Schema;
	mobileNo: number;
}

const StudentSchema = new Schema<student>({
	name: {
		type: String,
		required: true,
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

export default model('student', StudentSchema);
