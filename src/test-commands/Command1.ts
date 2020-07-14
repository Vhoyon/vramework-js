import LinkableCommand from '../api/commands/LinkableCommand';

export default class Command1 extends LinkableCommand {
	action(): void {
		console.log('1');
		// throw new Error('Method not implemented.');
	}
	
	getCalls(): string | string[] {
		return ['command1', 'c'];
	}
}
