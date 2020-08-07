import Discord from 'discord.js';
import { VParsedCommand } from 'vcommand-parser';
import CommandRouter from '../CommandRouter';
import LinkableCommand from './LinkableCommand';

export abstract class AbstractBotCommand extends LinkableCommand {
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
	// getHelp(): string {
	// 	throw new Error('Method not implemented.');
	// }
	// formatCommand(_commandToFormat: string): string {
	// 	throw new Error('Method not implemented.');
	// }
	// formatOption(_optionToFormat: string): string {
	// 	throw new Error('Method not implemented.');
	// }
}

export default AbstractBotCommand;
