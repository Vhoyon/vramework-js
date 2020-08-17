import Discord from 'discord.js';
import { InitializableTypeWithArgs as TypeArgs } from '../utils/type';
import { CommandRouterOptions } from './CommandRouter';
import CommandContainer from './commands/container/CommandContainer';
import DiscordEventListener, { DiscordEventListenerOptions } from './listeners/DiscordEventListener';

export type VBotManagerOptions = {
	client: Discord.Client;
	customDiscordEventListener: TypeArgs<DiscordEventListener, [CommandContainer | Promise<CommandContainer> | string, Discord.Client, Partial<DiscordEventListenerOptions>]>;
	discordEventListenerOptions: Partial<DiscordEventListenerOptions>;
} & CommandRouterOptions;

export class VBotManager {
	readonly client: Discord.Client;
	protected options: VBotManagerOptions;
	
	readonly listener: DiscordEventListener;
	
	constructor(commandContainer: CommandContainer, options: Partial<VBotManagerOptions>);
	constructor(commandContainer: Promise<CommandContainer>, options: Partial<VBotManagerOptions>);
	constructor(commandContainer: string, options: Partial<VBotManagerOptions>);
	
	constructor(commandContainer: CommandContainer | Promise<CommandContainer> | string, options: Partial<VBotManagerOptions> = {}) {
		this.client = options.client || new Discord.Client();
		
		const discordEventListenerOptions = options.discordEventListenerOptions || {};
		
		const defaultOptions: VBotManagerOptions = {
			client: this.client,
			discordEventListenerOptions: discordEventListenerOptions,
			customDiscordEventListener: DiscordEventListener,
		};
		
		const fullOptions = {...defaultOptions, ...options};
		
		this.options = fullOptions;
		
		discordEventListenerOptions.commandPrefix = discordEventListenerOptions.commandPrefix ?? fullOptions.commandPrefix;
		discordEventListenerOptions.optionPrefix = discordEventListenerOptions.optionPrefix ?? fullOptions.optionPrefix;
		
		this.listener = new fullOptions.customDiscordEventListener(commandContainer, this.client, discordEventListenerOptions);
	}
	
	start(token: string | undefined): Promise<string> {
		return this.client.login(token);
	}
	
	stop(): void {
		return this.client.destroy();
	}
}

export default VBotManager;
