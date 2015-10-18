
export default class Action {

	get Name() { return this.name; }
	get Payload() { return this.payload; }

	constructor(
		private name: string,
		private payload?: any
	) {}
}
