import Discord from 'discord.js';
import VCommandParser from 'vcommand-parser';
import AbstractBotCommand from './commands/AbstractBotCommand';
import CommandContainer from './commands/container/CommandContainer';

export class CommandRouter {
	readonly commandContainer: Promise<CommandContainer>;
	
	constructor(commandContainer: CommandContainer | Promise<CommandContainer> | string) {
		this.commandContainer = typeof commandContainer == 'string' ? CommandContainer.createFromDir(commandContainer) : Promise.resolve(commandContainer);
	}
	
	async route(message: Discord.Message): Promise<void> {
		const request = VCommandParser.parseLazy(message.cleanContent, '! ');
		
		const container = await this.commandContainer;
		
		const commandClass = request.command && container.links.get(request.command);
		
		if (commandClass) {
			request.doParseOptions();
			
			const command = new commandClass();
			
			if (command instanceof AbstractBotCommand) {
				command.init(request, this);
			}
			
			command.action();
		}
	}
}

export default CommandRouter;
