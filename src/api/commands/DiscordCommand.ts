import Discord from 'discord.js';

export interface DiscordCommand {
	getGuild(): Discord.Guild | null;
	
	getTextChannel(): Discord.TextChannel | null;
	
	getChannel(): Discord.TextChannel | Discord.DMChannel | Discord.NewsChannel;
	
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
	
	sendMessage(text: string): Promise<Discord.Message> | null;
	
	sendMessageToUser(user: Discord.User, text: string): Promise<Discord.Message>;
	
	replyInDM(text: string): Promise<Discord.Message>;
}

export default DiscordCommand;
