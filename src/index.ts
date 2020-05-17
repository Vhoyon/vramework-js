import Discord from 'discord.js';
import { env, init as initEnv } from './utils/env';

initEnv();

const client = new Discord.Client();

client.on('ready', () => {
	console.log(`Logged in as ${client.user?.tag}!`);
});

client.on('message', msg => {
	if (msg.content === 'ping') {
		// msg.reply('Pong!');
		msg.channel.send('test');
	}
});

const token = env('BOT_TOKEN') as string | undefined;

client.login(token);
