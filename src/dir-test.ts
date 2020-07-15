import path from 'path';
import readdir from 'recursive-readdir';
import LinkableCommand from './api/commands/LinkableCommand';

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

getLinkableCommandClasses(`./src/test-commands`).then(commandClasses => {
	commandClasses.forEach(commandClass => {
		const command = new commandClass();
		
		console.log(command.getCalls());
	});
});
