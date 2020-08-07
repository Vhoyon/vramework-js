import AbstractBotCommand from '../../api/commands/AbstractBotCommand';

export default class Command3 extends AbstractBotCommand {
	async action(): Promise<void> {
		console.log('3');
		// throw new Error('Method not implemented.');
	}
	
	getCalls(): string | string[] {
		return ['command3', '3'];
	}
}
