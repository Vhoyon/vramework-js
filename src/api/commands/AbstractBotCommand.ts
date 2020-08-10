import Discord from 'discord.js';
import { VParsedCommand } from 'vcommand-parser';
import { InitializableTypeWithArgs as TypeWithArgs } from '../../utils/type';
import CommandRouter from '../CommandRouter';
import MessageEventDigger from '../helpers/MessageEventDigger';
import DiscordCommand from './DiscordCommand';
import LinkableCommand from './LinkableCommand';

export abstract class AbstractBotCommand extends LinkableCommand implements DiscordCommand {
	request!: VParsedCommand;
	router!: CommandRouter;
	messageDigger!: MessageEventDigger;
	
	message!: Discord.Message;
	client!: Discord.Client;
	
	constructor(copyCommand?: AbstractBotCommand) {
		super();
		
		if (copyCommand) {
			this.init({
				request: copyCommand.request,
				router: copyCommand.router,
				messageDigger: copyCommand.messageDigger,
			});
		}
	}
	
	init(data: { request: VParsedCommand; router: CommandRouter; messageDigger: MessageEventDigger }): void {
		({
			request: this.request,
			router: this.router,
			messageDigger: this.messageDigger,
		} = data);
		
		this.message = this.messageDigger.message;
		this.client = this.message.client;
	}
	
	getActualCall(): string {
		return this.request.command!;
	}
	
	getGuild(): Discord.Guild | null {
		return this.message.guild;
	}
	
	getTextChannel(): Discord.TextChannel | null {
		const channel = this.getChannel();

		return channel instanceof Discord.TextChannel ? channel : null;
	}
	
	getChannel(): Discord.TextChannel | Discord.DMChannel | Discord.NewsChannel {
		return this.message.channel;
	}
	
	/**
	 * Retrieves the GuildMember that executed the request.
	 */
	getGuildMember(): Discord.GuildMember | null;
	/**
	 * Retrieves a GuildMember in the guild that this command was inputted in using a search criteria.
	 *
	 * @param user The member search criteria
	 */
	getGuildMember(user: Discord.UserResolvable): Discord.GuildMember | null;
	
	getGuildMember(user?: Discord.UserResolvable): Discord.GuildMember | null {
		if (!user) {
			return this.message.member;
		}
		
		return this.getGuild()?.member(user) ?? null;
	}
	
	/**
	 * Retrieves the User that executed the request.
	 */
	getUser(): Discord.User;
	/**
	 * Retrieves a User in the guild that this command was inputted in using a search criteria.
	 *
	 * @param user The user search criteria
	 */
	getUser(user: Discord.UserResolvable): Discord.User | null;
	
	getUser(user?: Discord.UserResolvable): Discord.User | null {
		if (!user) {
			return this.message.author;
		}
		
		return this.getGuild()?.member(user)?.user ?? null;
	}
	
	sendMessage(text: string): Promise<Discord.Message> | null {
		return this.getTextChannel()?.send(text) ?? null;
	}
	
	sendMessageToUser(user: Discord.User, text: string): Promise<Discord.Message> {
		return user.send(text);
	}
	
	replyInDM(text: string): Promise<Discord.Message> {
		return this.sendMessageToUser(this.getUser(), text);
	}
	
	editMessage(message: Discord.MessageResolvable, text: string): Promise<Discord.Message> | null {
		return this.editMessageForChannel(this.getChannel(), message, text);
	}
	
	editMessageForChannel(channel: Discord.TextChannel | Discord.DMChannel | Discord.NewsChannel, message: Discord.MessageResolvable, text: string): Promise<Discord.Message> | null {
		return channel.messages.resolve(message)?.edit(text) ?? null;
	}
	
	async callCommand(command: string): Promise<void | Error> {
		const container = await this.router.commandContainer;
		
		const commandType = container.links.get(command);
		
		if (commandType) {
			const commandInstance = commandType.prototype instanceof AbstractBotCommand
				? new (commandType as unknown as TypeWithArgs<AbstractBotCommand, [AbstractBotCommand]>)(this)
				: new commandType();
			
			return commandInstance.action();
		}
		
		return new Error(`Command '${command}' not found in the given command container.`);
	}
	
	// getHelp(): string {
	// 	throw new Error('Method not implemented.');
	// }
	
	formatCommand(commandToFormat: string): string {
		return `${this.request.commandPrefix}${commandToFormat}`;
	}
	
	formatOption(optionToFormat: string): string {
		return `${this.request.optionPrefix}${optionToFormat}`;
	}
}

export default AbstractBotCommand;
