import Discord from 'discord.js';
import { VParsedCommand } from 'vcommand-parser';
import CommandRouter from '../CommandRouter';
import DiscordCommand from './DiscordCommand';
import LinkableCommand from './LinkableCommand';

export abstract class AbstractBotCommand extends LinkableCommand implements DiscordCommand {
	request!: VParsedCommand;
	router!: CommandRouter;
	message!: Discord.Message;
	client!: Discord.Client;
	
	init(data: { request: VParsedCommand; router: CommandRouter; message: Discord.Message }): void {
		({
			request: this.request,
			router: this.router,
			message: this.message,
		} = data);
		
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
