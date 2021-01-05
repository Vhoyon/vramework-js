import VBotManager from '../src/api/VBotManager';
import { env, init as initEnv } from '../src/utils/env';

initEnv();

const manager = new VBotManager('./test-manual/test-commands', {
	commandPrefix: (digger): string => {
		if (digger.message.author.username == 'V-ed') {
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
