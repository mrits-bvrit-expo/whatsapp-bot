import { Schema, model } from 'mongoose';

interface subAssignment {
	subjectName: string;
	assignmentNo: number;
	deadLine: Date;
	description: string;
	submittedStudents: Schema.Types.ObjectId[];
}
interface assignment {
	yearOfStudy: number;
	semester: number;
	branch: string;
	section: string;
	assignment: subAssignment[];
}

const AssignmentSchema = new Schema<assignment>({
	yearOfStudy: {
		type: Number,
		required: true,
	},
	semester: {
		type: Number,
		required: true,
	},
	branch: {
		type: String,
		required: true,
	},
	section: {
		type: String,
		required: true,
		default: 'A',
	},
	assignment: {
		type: [],
		required: true,
		ref: 'user',
	},
});

export default model('assignment', AssignmentSchema);
