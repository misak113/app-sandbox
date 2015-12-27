
export default class Action<Payload> {

	constructor(
		private payload?: Payload,
		private source?: any,
		private target?: any
	) {}

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
