import Discord from 'discord.js';
import VCommandParser from 'vcommand-parser';
import CommandContainer from './api/commands/container/CommandContainer';
import { env, init as initEnv } from './utils/env';

initEnv();

CommandContainer.createFromDir('./src/test-commands').then(commandContainer => {
	const client = new Discord.Client();
	
	client.on('ready', () => {
		console.log(`Logged in as ${client.user?.tag}!`);
	});
	
	client.on('message', msg => {
		if(!msg.author.bot){
			const request = VCommandParser.parseLazy(msg.cleanContent);
			
			if(request.command) {
				request.doParseOptions();
				
				const commandClass = commandContainer.links[request.command];
				
				const command = new commandClass();
				
				command.action();
			}
		}
	});
	
	const token = env('BOT_TOKEN') as string | undefined;
	
	client.login(token);
});
