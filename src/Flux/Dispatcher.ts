
import {EventEmitter} from 'events';
import Action from './Action';
import IClassStatic from './IClassStatic';
import Binding from './Binding';
import ResourceTarget from '../Addressing/ResourceTarget';
import { FluxDispatcherUnbindException } from './exceptions';

export default class Dispatcher {

	private eventEmitter: EventEmitter;

	constructor() {
		this.eventEmitter = new EventEmitter();
	}

	dispatch<A extends Action<any>>(action: A) {
		setTimeout(() => {
			this.eventEmitter.emit(action.constructor.toString(), action);
			// AnySignal = *
			this.eventEmitter.emit('*', action);
		});
		return this;
	}

	bind<A extends Action<any>>(
		ActionStatic: IClassStatic<A> | IClassStatic<A>[],
		callback: (action: A) => void,
		resourceTarget?: ResourceTarget // TODO
	) {
		const ActionStatics: IClassStatic<A>[] = typeof ActionStatic === 'Array'
			? ActionStatic as IClassStatic<A>[]
			: [ActionStatic as IClassStatic<A>];
		ActionStatics.forEach((ActionStatic: IClassStatic<A>) => {
			this.eventEmitter.addListener(ActionStatic.toString(), callback);
		});

		return new Binding(ActionStatics, callback);
	}

	unbind<A extends Action<any>>(binding: Binding<A>) {
		binding.getActionStatics().forEach((ActionStatic: IClassStatic<A>) => {
			const callback = binding.getCallback();
			if (this.eventEmitter.listeners(ActionStatic.toString()).indexOf(callback) === -1) {
				throw new FluxDispatcherUnbindException('Try to unbind not binded Binding', binding);
			}
			this.eventEmitter.removeListener(ActionStatic.toString(), callback);
		});
		return this;
	}
}
