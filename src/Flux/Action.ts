
export default class Action {

	get Name() { return this.name; }
	get Payload() { return this.payload; }
	get Source() { return this.source; }

	constructor(
		private name: string,
		private payload?: any,
		private source?: any
	) {}
}
