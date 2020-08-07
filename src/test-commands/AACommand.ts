import AbstractCommand from './AbstractCommand';

export default class AACommand extends AbstractCommand {
	async action(): Promise<void> {
		throw new Error('Method not implemented.');
	}
	
	getCalls(): string | string[] {
		return 'thx';
	}
}
