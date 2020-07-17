import AbstractCommand from './AbstractCommand';

export default class AACommand extends AbstractCommand {
	action(): void {
		throw new Error('Method not implemented.');
	}
	
	getCalls(): string | string[] {
		return 'thx';
	}
}
