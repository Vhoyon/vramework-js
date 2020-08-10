import Discord from 'discord.js';
import VCommandParser, { OptionPrefix } from 'vcommand-parser';
import AbstractBotCommand from './commands/AbstractBotCommand';
import CommandContainer from './commands/container/CommandContainer';
import MessageEventDigger from './helpers/MessageEventDigger';

export type RouterPrefixFunction<T> = (digger: MessageEventDigger) => T;

export type CommandRouterOptions = {
	commandPrefix?: string | RouterPrefixFunction<string>;
	optionPrefix?: OptionPrefix | RouterPrefixFunction<OptionPrefix>;
};

export class CommandRouter {
	readonly commandContainer: Promise<CommandContainer>;
	
	protected options: CommandRouterOptions;
	
	constructor(commandContainer: CommandContainer | Promise<CommandContainer> | string, options: Partial<CommandRouterOptions> = {}) {
		this.commandContainer = typeof commandContainer == 'string' ? CommandContainer.createFromDir(commandContainer) : Promise.resolve(commandContainer);
		
		const defaultOptions: CommandRouterOptions = {
			commandPrefix: VCommandParser.DEFAULT_COMMAND_PREFIX,
			optionPrefix: VCommandParser.DEFAULT_OPTION_PREFIX,
		};
		
		this.options = {...defaultOptions, ...options};
	}
	
	async route(message: Discord.Message): Promise<void> {
		const messageDigger = new MessageEventDigger(message);
		
		const commandPrefix = typeof this.options.commandPrefix != 'function' ? this.options.commandPrefix : this.options.commandPrefix(messageDigger) ;
		const optionPrefix = typeof this.options.optionPrefix != 'function' ? this.options.optionPrefix : this.options.optionPrefix(messageDigger);
		
		const request = VCommandParser.parseLazy(message.cleanContent, commandPrefix, optionPrefix);
		
		const container = await this.commandContainer;
		
		const commandClass = request.command && container.links.get(request.command);
		
		if (commandClass) {
			request.doParseOptions();
			
			const command = new commandClass();
			
			if (command instanceof AbstractBotCommand) {
				command.init({
					request: request,
					router: this,
					messageDigger: messageDigger
				});
			}
			
			command.action();
		}
	}
}

export default CommandRouter;
