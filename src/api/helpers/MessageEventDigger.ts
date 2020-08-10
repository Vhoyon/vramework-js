import Discord from 'discord.js';
import KeyBuilder from './KeyBuilder';

export class MessageEventDigger {
	message: Discord.Message;
	
	constructor(message: Discord.Message) {
		this.message = message;
	}
	
	getGuildKey(): string | null;
	getGuildKey(...objects: unknown[]): string;
	
	getGuildKey(...objects: unknown[]): string | null {
		if (this.message.guild) {
			return KeyBuilder.createGuildKey(this.message.guild, ...objects);
		} else {
			return objects.length ? KeyBuilder.createKey(...objects) : null;
		}
	}
	
	getChannelKey(): string;
	getChannelKey(...objects: unknown[]): string;
	
	getChannelKey(...objects: unknown[]): string {
		return KeyBuilder.createChannelKey(this.message.channel, ...objects);
	}
	
	getUserKey(): string;
	getUserKey(...objects: unknown[]): string;
	
	getUserKey(...objects: unknown[]): string {
		return KeyBuilder.createUserKey(this.message.author, ...objects);
	}
}

export default MessageEventDigger;
