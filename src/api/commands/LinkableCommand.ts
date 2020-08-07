import { OptionDef } from 'vcommand-parser';
import Command from './Command';

export abstract class LinkableCommand implements Command {
	abstract async action(): Promise<void>;
	
	abstract getCalls(): string | string[];
	
	getActualCall?(): string;
	
	getCommandDescription?(): string;
	
	//TODO implement when options are a thing!
	getOptions?(): OptionDef[];
	
	getHelp(): string | undefined {
		return undefined;
	}
	
	formatCommand(commandToFormat: string): string {
		return `\\${commandToFormat}`;
	}
	
	formatOption(optionToFormat: string): string {
		return `\\${optionToFormat}`;
	}
}

export default LinkableCommand;
