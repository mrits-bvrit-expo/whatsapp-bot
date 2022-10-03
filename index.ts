import * as qrcode from 'qrcode-terminal';
import WAWebJS, { Client, LocalAuth } from 'whatsapp-web.js';
import { success, fail, db } from './utils/chalk';
import { messageCheck } from './utils/messageChecker';
import { readdirSync } from 'fs';
import { join } from 'path';

const command = new Map();
const commandFiles = readdirSync(join(__dirname, 'commands'));
commandFiles.forEach(async (commands) => {
	const cmd = (await import(`./commands/${commands}`)).default;
	command.set(cmd.name, cmd);
});

const client = new Client({
	authStrategy: new LocalAuth(),
	puppeteer: {
		args: ['--no-sandbox'],
	},
});

client.on('qr', (qr: string) => {
	try {
		qrcode.generate(qr, { small: true });
	} catch (err) {
		console.log(err);
	}
});

client.on('ready', () => {
	try {
		success('Client Connected Successfully');
	} catch (err) {
		fail(err);
	}
});

client.on('message', (message: WAWebJS.Message) => {
	try {
		if (message.from === '120363026778678050@g.us') {
			let msgCheck = messageCheck(message.body);
			if (msgCheck.status) {
				if (!command.has(msgCheck.cmd)) return;
				command.get(msgCheck.cmd).exec(client, message, msgCheck.args);
			}
		}
	} catch (err) {
		fail(err);
	}
});

client.initialize();
