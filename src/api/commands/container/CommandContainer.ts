import path from 'path';
import readdir from 'recursive-readdir';
import { InitializableType as Type } from '../../../utils/type';
import LinkableCommand from '../LinkableCommand';

/**
 *
 * @param dirPath 	Path to the directory that contains the LinkableCommand classes.
 * 					The path is resolved using Node's `path.resolve()` function.
 */
async function getLinkableCommandClasses(dirPath: string): Promise<Type<LinkableCommand>[]> {
	const fullDirPath = path.resolve(dirPath);
	
	const filePaths = await readdir(fullDirPath, ['!*.+(ts|js)']);
	
	const defaultImports: unknown[] = (await Promise.all(filePaths.map(async filePath => (await import(filePath)).default)));
	
	const commandClasses: Type<LinkableCommand>[] = defaultImports.filter(commandInstance => {
		return typeof commandInstance == 'function' && commandInstance.prototype instanceof LinkableCommand;
	}).map(commandInstance => commandInstance as Type<LinkableCommand>);
	
	return commandClasses;
}

export class CommandContainer {
	readonly links: ReadonlyMap<string, Type<LinkableCommand>>;
	
	private constructor(classes: Type<LinkableCommand>[]) {
		this.links = this.createLinkableCommandsMap(classes);
	}
	
	injectLinkableCommands(...classes: Type<LinkableCommand>[]): void {
		const linkMap = this.createLinkableCommandsMap(classes);
		
		linkMap.forEach((linkableCommand, call) => {
			(this.links as Map<string, Type<LinkableCommand>>).set(call, linkableCommand);
		});
	}
	
	protected createLinkableCommandsMap(classes: Type<LinkableCommand>[]): Map<string, Type<LinkableCommand>> {
		const linkMap = new Map<string, Type<LinkableCommand>>();
		
		const initLink = (link: string, linkClass: Type<LinkableCommand>): void => {
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
	
	/**
	 *
	 * @param dirPath The path of the folder (relative or absolute) generate the links from.
	 * @param additionalClasses Any additional folders / `LinkableCommand` classes to add to the container.
	 */
	static async createFromDir(dirPath: string, additionalClasses?: (Type<LinkableCommand> | string)[]): Promise<CommandContainer> {
		const linkableTypes: Type<LinkableCommand>[] = [];
		
		linkableTypes.push(...await getLinkableCommandClasses(dirPath));
		
		if (additionalClasses) {
			const additionalLinkableTypesArray = await Promise.all(additionalClasses.map(async additionalClass => {
				if (typeof additionalClass == 'string') {
					return await getLinkableCommandClasses(additionalClass);
				} else {
					return new Array(additionalClass);
				}
			}));
			
			additionalLinkableTypesArray.forEach(additionalLinkableTypes => linkableTypes.push(...additionalLinkableTypes));
		}
		
		return new this(linkableTypes);
	}
	
	static async createFromClasses(classes: Type<LinkableCommand>[]): Promise<CommandContainer> {
		return new this(classes);
	}
}

export default CommandContainer;
