import dotenv from 'dotenv';

export function init(envPath?: string): dotenv.DotenvConfigOutput {
	return dotenv.config({path: envPath});
}

export function env<T extends boolean | string | number>(key: string, defaultValue?: T): T | undefined {
	const envValue = process.env[key];
	
	if (!envValue) {
		return defaultValue;
	} else {
		const lowerCasedValue = envValue.toLowerCase();
		
		if (lowerCasedValue == 'true') {
			return true as T;
		} else if (lowerCasedValue == 'false') {
			return false as T;
		} else if (/^[0-9]+(\\.[0-9]+)?$/.test(envValue)) {
			return +envValue as T;
		} else {
			return envValue as T;
		}
	}
}
