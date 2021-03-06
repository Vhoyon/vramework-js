import Discord from 'discord.js';
import { InitializableTypeWithArgs as TypeArgs } from '../../utils/type';
import CommandRouter, { CommandRouterOptions } from '../CommandRouter';
import CommandContainer from '../commands/container/CommandContainer';

export type DiscordEventListenerOptions = {
	customCommandRouter: TypeArgs<CommandRouter, [CommandContainer | Promise<CommandContainer> | string, Partial<CommandRouterOptions>]>;
} & CommandRouterOptions;

export class DiscordEventListener {
	readonly client: Discord.Client;
	readonly commandRouter: CommandRouter;
	
	protected options: DiscordEventListenerOptions;
	
	constructor(commandContainer: CommandContainer | Promise<CommandContainer> | string, client: Discord.Client, options: Partial<DiscordEventListenerOptions> = {}) {
		this.client = client;
		
		const defaultOptions: DiscordEventListenerOptions = {
			customCommandRouter: CommandRouter
		};
		
		this.options = {...defaultOptions, ...options};
		
		const commandRouterOptions: CommandRouterOptions = {
			commandPrefix: options.commandPrefix,
			optionPrefix: options.optionPrefix,
		};
		
		this.commandRouter = new this.options.customCommandRouter(commandContainer, commandRouterOptions);
		
		this.on('message', this.onMessage.bind(this));
	}
	
	onMessage(message: Discord.Message): void {
		if (!message.author.bot) {
			this.commandRouter.route(message);
		}
	}
	
	on<K extends keyof Discord.ClientEvents>(event: K, listener: (...args: Discord.ClientEvents[K]) => void): void {
		this.client.on(event, listener);
	}
}

export default DiscordEventListener;
