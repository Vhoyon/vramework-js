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
	
	const commandClasses: (new (...args: unknown[]) => LinkableCommand)[] = defaultImports.filter(commandInstance => {
		return commandInstance && commandInstance.prototype instanceof LinkableCommand;
	});
	
	return commandClasses;
}

export class CommandContainer {
	readonly links: ReadonlyMap<string, new (...args: unknown[]) => LinkableCommand>;
	
	private constructor(classes: ((new (...args: unknown[]) => LinkableCommand)[])) {
		this.links = this.createLinkableCommandsMap(classes);
	}
	
	protected createLinkableCommandsMap(classes: ((new (...args: unknown[]) => LinkableCommand)[])): Map<string, new (...args: unknown[]) => LinkableCommand> {
		const linkMap = new Map<string, new (...args: unknown[]) => LinkableCommand>();
		
		const initLink = (link: string, linkClass: new (...args: unknown[]) => LinkableCommand): void => {
			linkMap.set(link, linkClass);
		};
		
		classes.forEach(commandClass => {
			try {
				const commandInstance = new commandClass();
				const calls = commandInstance.getCalls();
				
				if (typeof calls == 'string') {
					initLink(calls, commandClass);
				} else {
					calls.forEach(call => {
						initLink(call, commandClass);
					});
				}
			} catch {
				// Simply skip abstract / unformed LinkableCommand classes
			}
		});
		
		return linkMap;
	}
	
	static async createFromDir(dirPath: string): Promise<CommandContainer> {
		return new this(await getLinkableCommandClasses(dirPath));
	}
	
	static async createFromClasses(classes: ((new (...args: unknown[]) => LinkableCommand)[])): Promise<CommandContainer> {
		return new this(classes);
	}
}

export default CommandContainer;
