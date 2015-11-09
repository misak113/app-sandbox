
import Action from './Action';
import Signal from './Signal';

export default class Binding<Payload> {

	getSignals() { return this.signals; }
	getCallback() { return this.callback; }

	constructor(
		private signals: Signal<any>[],
		private callback: (action: Action<Payload>) => void
	) {}
}
