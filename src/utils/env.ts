import dotenv from 'dotenv';

export function init(envPath?: string): dotenv.DotenvConfigOutput {
	return dotenv.config({path: envPath});
}

export function env(key: string): boolean | string | number | undefined {
	const envValue = process.env[key];
	
	if (!envValue) {
		return envValue;
	} else {
		const lowerCasedValue = envValue.toLowerCase();
		
		if (lowerCasedValue == 'true') {
			return true;
		} else if (lowerCasedValue == 'false') {
			return false;
		} else if (envValue.match(/^[0-9]+(\\.[0-9]+)?$/)) {
			return +envValue;
		} else {
			return envValue;
		}
	}
}
