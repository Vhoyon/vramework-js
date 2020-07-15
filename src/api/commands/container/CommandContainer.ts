import path from 'path';
import readdir from 'recursive-readdir';
import LinkableCommand from '../LinkableCommand';

/**
 *
 * @param dirPath 	Path to the directory that contains the LinkableCommand classes.
 * 					Can be either a full path or a relative path (from the package.json location).
 * 					On Windows, the full path must have the drive letter lower cased.
 */
async function getLinkableCommandClasses(dirPath: string): Promise<(new (...args: unknown[]) => LinkableCommand)[]> {
	const fullDirPath = path.resolve(dirPath);
	
	const filePaths = await readdir(fullDirPath, ['!*.+(ts|js)']);
	
	const defaultImports = (await Promise.all(filePaths.map(async filePath => (await import(filePath)).default)));
	
	const commandClasses: (new (...args: unknown[]) => LinkableCommand)[] = defaultImports.filter(commandInstance => commandInstance && commandInstance.prototype instanceof LinkableCommand);
	
	return commandClasses;
}

export class CommandContainer {
	readonly links: { [key: string]: new (...args: unknown[]) => LinkableCommand };
	
	private constructor(classes: ((new (...args: unknown[]) => LinkableCommand)[])) {
		this.links = {};
		
		classes.forEach(commandClass => {
			const calls = new commandClass().getCalls();
			
			if (typeof calls == 'string') {
				this.links[calls] = commandClass;
			} else {
				calls.forEach(call => {
					this.links[call] = commandClass;
				});
			}
		});
	}
	
	static async createFromDir(dirPath: string): Promise<CommandContainer> {
		return new this(await getLinkableCommandClasses(dirPath));
	}
	
	static async createFromClasses(classes: ((new (...args: unknown[]) => LinkableCommand)[])): Promise<CommandContainer> {
		return new this(classes);
	}
}

export default CommandContainer;
