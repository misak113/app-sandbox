
export class UpdateClientStateException extends Error {

	public name: string;

	constructor(
		public message: string = null
	) {
		super(message);
		this.name = 'UpdateClientStateException';
	}
}

export class CreateClientStateException extends Error {

	public name: string;

	constructor(
		public message: string = null
	) {
		super(message);
		this.name = 'CreateClientStateException';
	}
}
