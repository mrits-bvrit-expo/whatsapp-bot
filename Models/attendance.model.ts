import { Schema } from 'mongoose';

interface attendance {
	semester: number;
	yearOfStudy: number;
	noWorkingDays: number;
	absent: Date[];
}

export const AttendanceSchema = new Schema<attendance>({
	semester: {
		type: Number,
		required: true,
	},
	yearOfStudy: {
		type: Number,
		required: true,
	},
	noWorkingDays: {
		type: Number,
		required: true,
	},
	absent: {
		type: [Date],
	},
});
