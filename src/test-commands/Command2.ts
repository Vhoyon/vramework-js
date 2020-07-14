import LinkableCommand from '../api/commands/LinkableCommand';

export default class Command2 extends LinkableCommand {
	action(): void {
		console.log('2');
		// throw new Error('Method not implemented.');
	}
	
	getCalls(): string | string[] {
		return 'command2';
	}
}
