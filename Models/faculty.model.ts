import { Schema, model } from 'mongoose';

interface faculty {
	employeeId: string;
	name: string;
	branch: string;
	attendance: Schema;
	timeTable: Schema;
}
