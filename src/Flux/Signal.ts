
export default class Signal<Payload> {

	constructor(
		private name: string,
		private payload?: Payload
	) {}

	getName() {
		return this.name;
	}

	getPayload() {
		return this.payload;
	}
}
