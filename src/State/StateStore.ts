
import {Inject} from 'di-ts';
import Dispatcher from '../Flux/Dispatcher';
import Action from '../Flux/Action';
import { StateSignals, IUpdatePayload } from './State';
import { StateActions } from './State';

@Inject
export default class StateStore {

	constructor(
		private dispatcher: Dispatcher,
		private stateActions: StateActions,
		private stateSignals: StateSignals
	) {
		this.dispatcher.bind(
			this.stateSignals.update(),
			(action: Action<IUpdatePayload>) => this.updateState(action)
		);
	}

	private updateState(action: Action<IUpdatePayload>) {
		var StateClass = action.getPayload().StateClass;
		var originalState = action.getPayload().originalState;
		var nextState = action.getPayload().nextState;
		var resource = action.getPayload().resource;
		var patch = this.stateActions.patch(StateClass, originalState, nextState, resource);
		this.dispatcher.dispatch(patch);
	}
}
