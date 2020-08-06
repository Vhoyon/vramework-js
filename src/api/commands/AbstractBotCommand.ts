import { VParsedCommand } from 'vcommand-parser';
import CommandRouter from '../CommandRouter';
import LinkableCommand from './LinkableCommand';

export abstract class AbstractBotCommand extends LinkableCommand {
	request!: VParsedCommand;
	router!: CommandRouter;
	
	init(request: VParsedCommand, router: CommandRouter): void {
		this.request = request;
		this.router = router;
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
