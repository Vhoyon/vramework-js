import AbstractBotCommand from '../api/commands/AbstractBotCommand';

export default class Command2 extends AbstractBotCommand {
	async action(): Promise<void> {
		console.log('2');
		// throw new Error('Method not implemented.');
	}
	
	getCalls(): string | string[] {
		return 'command2';
	}
}
