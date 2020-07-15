import AbstractBotCommand from '../api/commands/AbstractBotCommand';

export default class Command1 extends AbstractBotCommand {
	action(): void {
		console.log('1');
		// throw new Error('Method not implemented.');
	}
	
	getCalls(): string | string[] {
		return ['command1', 'c'];
	}
}
