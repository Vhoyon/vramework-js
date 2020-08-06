import BotManager from './api/BotManager';
import { env, init as initEnv } from './utils/env';

initEnv();

const manager = new BotManager('./src/test-commands');

manager.listener.on('ready', () => {
	console.log(`Logged in as ${manager.client.user?.tag}!`);
});

const token = env<string>('BOT_TOKEN');

if (token) {
	manager.start(token);
}
