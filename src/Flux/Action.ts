
export default class Action<Payload> {

	constructor(
		private name: string,
		private payload?: Payload,
		private source?: any,
		private target?: any
	) {}

	getName() {
		return this.name;
	}

	getPayload() {
		return this.payload;
	}

	getSource() {
		return this.source;
	}

	getTarget() {
		return this.target;
	}
}
