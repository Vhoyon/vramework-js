import LinkableCommand from './LinkableCommand';

export abstract class AbstractBotCommand extends LinkableCommand{
	getHelp(): string {
		throw new Error('Method not implemented.');
	}
	formatCommand(_commandToFormat: string): string {
		throw new Error('Method not implemented.');
	}
	formatOption(_optionToFormat: string): string {
		throw new Error('Method not implemented.');
	}
}

export default AbstractBotCommand;
