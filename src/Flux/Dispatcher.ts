
import {EventEmitter} from 'events';
import Action from './Action';
import Signal from './Signal';
import Binding from './Binding';
import { FluxDispatcherUnbindException } from './exceptions';

export default class Dispatcher {

	private eventEmitter: EventEmitter;

	constructor() {
		this.eventEmitter = new EventEmitter();
	}

	dispatch<Payload>(action: Action<Payload>) {
		setTimeout(() => {
			this.eventEmitter.emit(action.getName(), action);
			// AnySignal = *
			this.eventEmitter.emit('*', action);
		});
		return this;
	}

	bind<Payload>(signal: Signal<any> | Signal<any>[], callback: (action: Action<Payload>) => void) {
		var signals: Signal<any>[] = signal instanceof Signal ? [<Signal<any>>signal] : <Signal<any>[]>signal;
		signals.forEach((signal: Signal<any>) => {
			this.eventEmitter.addListener(signal.getName(), callback);
		});

		return new Binding(signals, callback);
	}

	unbind<Payload>(binding: Binding<Payload>) {
		binding.getSignals().forEach((signal: Signal<any>) => {
			var callback = binding.getCallback();
			if (this.eventEmitter.listeners(signal.getName()).indexOf(callback) === -1) {
				throw new FluxDispatcherUnbindException('Try to unbind not binded Binding', binding);
			}
			this.eventEmitter.removeListener(signal.getName(), callback);
		});
		return this;
	}
}
