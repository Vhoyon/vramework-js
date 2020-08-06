import Discord from 'discord.js';
import { InitializableTypeWithArgs as TypeArgs } from '../utils/type';
import CommandContainer from './commands/container/CommandContainer';
import DiscordEventListener, { DiscordEventListenerOptions } from './listeners/DiscordEventListener';

type BotManagerOptions = {
	client: Discord.Client;
	customDiscordEventListener: TypeArgs<DiscordEventListener, [CommandContainer | Promise<CommandContainer> | string, Discord.Client, Partial<DiscordEventListenerOptions>]>;
	discordEventListenerOptions: Partial<DiscordEventListenerOptions>;
}

export class BotManager {
	readonly client: Discord.Client;
	protected options: BotManagerOptions;
	
	readonly listener: DiscordEventListener;
	
	constructor(commandContainer: CommandContainer | Promise<CommandContainer> | string, options: Partial<BotManagerOptions> = {}) {
		this.client = options.client || new Discord.Client();
		
		const discordEventListenerOptions = options.discordEventListenerOptions || {};
		
		const defaultOptions: BotManagerOptions = {
			client: this.client,
			discordEventListenerOptions: discordEventListenerOptions,
			customDiscordEventListener: DiscordEventListener,
		};
		
		const fullOptions = {...defaultOptions, ...options};
		
		this.options = fullOptions;
		
		this.listener = new fullOptions.customDiscordEventListener(commandContainer, this.client, discordEventListenerOptions);
	}
	
	start(token: string): void {
		this.client.login(token);
	}
	
	stop(): void {
		this.client.destroy();
	}
}

export default BotManager;
