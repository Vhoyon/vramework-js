export function objectToString(object: unknown): string {
	if (typeof object == 'string') {
		return object;
	}
	if (object instanceof Date) {
		return object.toISOString();
	}
	// eslint-disable-next-line @typescript-eslint/ban-types
	return (object as Object).toString();
}
