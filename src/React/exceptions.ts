
export class InjectorMissingException extends Error {

	public name: string;

	constructor(
		public message: string = null
	) {
		super(message);
		this.name = 'InjectorMissingException';
	}
}
