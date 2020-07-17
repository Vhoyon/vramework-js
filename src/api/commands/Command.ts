export interface Command{
	action(): void;
	
	getCalls(): string | string[];
}

export default Command;
