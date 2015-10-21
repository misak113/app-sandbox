
import {EventEmitter} from 'events';
import Action from './Action';
import ActionBinding from './ActionBinding';
import {FluxDispatcherUnbindException} from './exceptions';

export default class Dispatcher {

	private eventEmitter: EventEmitter;

	constructor() {
		this.eventEmitter = new EventEmitter();
	}

	dispatch(action: Action) {
		this.eventEmitter.emit(action.Name, action);
		this.eventEmitter.emit('*', action);
		return this;
	}

	bind(actionName: string|string[], actionCallback?: (action: Action) => void) {
		var actionNames: string[] = typeof actionName === 'string' ? [actionName] : actionName;
		actionNames.forEach((actionName: string) => {
			this.eventEmitter.addListener(actionName, actionCallback);
		});

		return new ActionBinding(actionNames, actionCallback);
	}

	unbind(actionBinding: ActionBinding) {
		actionBinding.ActionNames.forEach((actionName: string) => {
			if (this.eventEmitter.listeners(actionName).indexOf(actionBinding.ActionCallback) === -1) {
				throw new FluxDispatcherUnbindException('Try to unbind not binded ActionBinding', actionBinding);
			}
			this.eventEmitter.removeListener(actionName, actionBinding.ActionCallback);
		});
		return this;
	}
}
