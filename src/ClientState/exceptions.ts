
export class UpdateClientStateException extends Error {

	public name: string;

	constructor(
		public message: string = null
	) {
		super(message);
		this.name = 'UpdateClientStateException';
	}
}
