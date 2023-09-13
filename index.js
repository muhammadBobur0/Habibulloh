const express = require('express')
const { readFileSync, writeFileSync } = require('fs');
const app = express()
const { resolve } = require('path');
const cors = require('cors');
app.use(cors({
	origin :"*"
}))
app.use(express.json())
const PORT = process.env.PORT || 3000;
const TelegramBot = require('node-telegram-bot-api');
const event = new Date();

const telegramBot = new TelegramBot(
	'6377025383:AAHcdFRUIByuX1Bs97YjVcOOSLA6khyGv9E',
);

const keys = ['fio', 'tel', 'shahar'];

const none = 'Неизвестно';

function newMessageOptions(body) {
	if (!body || typeof body != 'object' || keys.some((key) => !body[key])) {
		return undefined;
	}

	return {
		...body,
	};
}

function sendMessage(messageOptions) {
	try {
		return telegramBot.sendMessage(
			-1001595970688,
			`
FIO:   ${messageOptions.fio || none}

telefon: ${messageOptions.tel || none}

sana :   ${event.toLocaleString('en-GB', {
				hour12: false,
			})}

shahar:   ${messageOptions.shahar || none}
    `,
		);
	} catch (e) {
		console.log(e);
	}
}

app.post('/send', async (req, res) => {
	try {
		const messageOptions = newMessageOptions(req.body);
		if (!messageOptions) {
			res.status(400);
			return res.send('incorrect request');
		}
		const mes = await sendMessage(messageOptions);
        console.log(mes);

		let data = JSON.parse(
			readFileSync(resolve('database', 'cars' + '.json'), 'utf-8'),
		);

		data.push({
			id: data[data.length - 1].id + 1 || 1,
			...messageOptions,
			sana: event.toLocaleString('en-GB', {
				hour12: false,
			}),
		});
		writeFileSync(
			resolve('database', 'cars' + '.json'),
			JSON.stringify(data, null, 4),
		);
		res.send({});
	} catch (error) {
		res.status(400);
		return res.send('incorrect request');
	}
});

app.get('/posts', (req, res) => {
	try {
		let data = readFileSync(resolve('database', 'cars' + '.json'), 'utf-8');
		return res.status(200).send(data);
	} catch (eror) {
		return res.send(eror.message);
	}
});

app.get('/posts/:id', (req, res) => {
	try {
		let { id } = req.params;
		let data = JSON.parse(
			readFileSync(resolve('database', 'cars' + '.json'), 'utf-8'),
		);
		let finds = data.find((e) => id == e.id);
		return res.status(200).send(finds);
	} catch (eror) {
		return res.send(eror.message);
	}
});

app.listen(PORT, () => {
	console.log('server start 3000');
});
