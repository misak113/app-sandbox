
export class WrongReturnWhileSetProperties extends Error {

	public name: string;

	constructor(
		public message: string = null,
		public data?: any
	) {
		super(message);
		this.name = 'WrongReturnWhileSetProperties';
	}
}