import AbstractBotCommand from '../api/commands/AbstractBotCommand';

export default class Command1 extends AbstractBotCommand {
	action(): void {
		console.log('Option content from command1 :', this.request.getOption('c')?.content);
		// throw new Error('Method not implemented.');
	}
	
	getCalls(): string[] {
		return ['command1', 'c'];
	}
}
