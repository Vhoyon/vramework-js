import { AbstractBotCommand } from '../../src/index';

export default class Command1 extends AbstractBotCommand {
	async action(): Promise<void> {
		console.log('Option content from command1 :', this.request.getOption('c')?.content);
		// throw new Error('Method not implemented.');
		
		this.callCommand('command2');
	}
	
	getCalls(): string[] {
		return ['command1', 'c'];
	}
}
