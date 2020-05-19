export default abstract class LinkableCommand implements Command {
	abstract action(): void;

	abstract getCalls(): string | string[];

	getActualCall?(): string;

	getCommandDescription?(): string;

	//TODO implement when options are a thing!
	getOptions?(): string[];

	getHelp(): string {
		return 'undefined';
	}

	formatCommand(commandToFormat: string): string {
		return `\\${commandToFormat}`;
	}

	formatOption(optionToFormat: string): string{
		return `\\${optionToFormat}`;
	}
}
