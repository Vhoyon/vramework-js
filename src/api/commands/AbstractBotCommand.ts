import LinkableCommand from './LinkableCommand';

export abstract class AbstractBotCommand extends LinkableCommand{
	getCalls(): string | string[] {
		throw new Error('Method not implemented.');
	}
	getHelp(): string {
		throw new Error('Method not implemented.');
	}
	formatCommand(_commandToFormat: string): string {
		throw new Error('Method not implemented.');
	}
	formatOption(_optionToFormat: string): string {
		throw new Error('Method not implemented.');
	}
	action(): void {
		throw new Error('Method not implemented.');
	}
}

export default AbstractBotCommand;
