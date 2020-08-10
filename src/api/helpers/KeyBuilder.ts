import Discord from 'discord.js';
import { objectToString } from '../../utils/helpers';

export class KeyBuilder {
	private constructor() {}
	
	static createGuildKey(guild: Discord.Guild): string;
	static createGuildKey(guild: Discord.Guild, ...objects: unknown[]): string;
	
	static createGuildKey(guild: Discord.Guild, ...objects: unknown[]): string {
		return KeyBuilder.createKey(guild.id, ...objects);
	}
	
	static createChannelKey(channel: Discord.TextChannel | Discord.DMChannel | Discord.NewsChannel): string;
	static createChannelKey(channel: Discord.TextChannel | Discord.DMChannel | Discord.NewsChannel, ...objects: unknown[]): string;
	
	static createChannelKey(channel: Discord.TextChannel | Discord.DMChannel | Discord.NewsChannel, ...objects: unknown[]): string {
		const guildKey = channel instanceof Discord.DMChannel ? 'DMChannel' : KeyBuilder.createGuildKey(channel.guild);
		
		return KeyBuilder.createKey(guildKey, channel.id, ...objects);
	}
	
	static createUserKey(user: Discord.User | Discord.GuildMember): string;
	static createUserKey(user: Discord.User | Discord.GuildMember, ...objects: unknown[]): string;
	static createUserKey(user: Discord.UserResolvable, container: Discord.Guild | Discord.TextChannel | Discord.NewsChannel): string;
	static createUserKey(user: Discord.UserResolvable, container: Discord.Guild | Discord.TextChannel | Discord.NewsChannel, ...objects: unknown[]): string;
	
	static createUserKey(user: Discord.UserResolvable, ...objects: unknown[]): string {
		let userKey: string;
		let finalObjects = objects;
		
		if (user instanceof Discord.User || user instanceof Discord.GuildMember) {
			const userObject = user instanceof Discord.GuildMember ? user.user : user;
			
			userKey = userObject.id;
		} else {
			const [guildOrChannel, ...rest] = objects;
			
			let guild: Discord.Guild | undefined = undefined;
			
			let guildOrChannelType: string | undefined = undefined;
			
			if (guildOrChannel instanceof Discord.Guild) {
				guild = guildOrChannel;
				guildOrChannelType = 'Guild';
			} else if (guildOrChannel instanceof Discord.TextChannel
				|| guildOrChannel instanceof Discord.NewsChannel) {
				guild = guildOrChannel.guild;
				guildOrChannelType = 'Channel';
			}
			
			if (guild) {
				const userObject = guild.member(user)?.user;
				
				if (!userObject) {
					throw new Error(`The given resolvable user '${typeof user == 'string' ? user : user.author}' could not be found in the given ${guildOrChannelType}.`);
				}
				
				finalObjects = rest;
				
				return KeyBuilder.createUserKey(userObject, ...rest);
			} else {
				throw new Error('This error should never happen. Please create an issue for vramework-js at https://github.com/Vhoyon/vramework-js/issues');
			}
		}
		
		return KeyBuilder.createKey(userKey, ...finalObjects);
	}
	
	static createKey(...args: (string | unknown | null | undefined)[]): string {
		function stringifyKeyArgs(arg: string | unknown): string {
			if (arg instanceof Discord.Guild) {
				return KeyBuilder.createGuildKey(arg);
			} else if (arg instanceof Discord.TextChannel
					|| arg instanceof Discord.DMChannel
					|| arg instanceof Discord.NewsChannel) {
				return KeyBuilder.createChannelKey(arg);
			} else if (arg instanceof Discord.User
					|| arg instanceof Discord.GuildMember) {
				return KeyBuilder.createUserKey(arg);
			} else if (Array.isArray(arg)) {
				return KeyBuilder.createKey(...arg);
			} else {
				return objectToString(arg);
			}
		}
		
		return args.filter(arg => !!arg).map(arg => stringifyKeyArgs(arg)).join('_');
	}
}

export default KeyBuilder;
