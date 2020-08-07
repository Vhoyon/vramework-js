import VBotManager from './api/VBotManager';
import { env, init as initEnv } from './utils/env';

initEnv();

const manager = new VBotManager('./src/test-commands', {
	commandPrefix: (message): string => {
		if (message.channel.id == message.channel.id + '3') {
			return '!!';
		}
		
		return '!';
	},
	optionPrefix: '+'
});

manager.listener.on('ready', () => {
	console.log(`Logged in as ${manager.client.user?.tag}!`);
});

const token = env<string>('BOT_TOKEN');

if (token) {
	manager.start(token);
}
