
import {Inject} from 'di-ts';
import Dispatcher from '../Flux/Dispatcher';
import Action from '../Flux/Action';
import ResourceTarget from '../Addressing/ResourceTarget';
import ResourceFactory from '../Addressing/ResourceFactory';
import { StateSignals, IUpdatePayload, IInitializePayload } from './State';
import { StateActions } from './State';
import { Map } from 'immutable';
import HomepageState from '../Demo/HomepageState';

@Inject
export default class StateStore {

	private states: Map<string, any>;

	constructor(
		private dispatcher: Dispatcher,
		private stateActions: StateActions,
		private stateSignals: StateSignals,
		private resourceFactory: ResourceFactory
	) {
		this.states = Map<string, any>();
		this.states = this.states.set('/homepage:{}', new HomepageState()); // TODO
		this.dispatcher.bind(
			this.stateSignals.update(),
			(action: Action<IUpdatePayload>) => this.updateState(action)
		);
		this.dispatcher.bind(
			this.stateSignals.initialize(),
			(action: Action<IInitializePayload>) => this.initialize(action)
		);
	}

	get(resourceTarget: ResourceTarget) {
		return this.states.get(resourceTarget.getIdentifier());
	}

	private updateState(action: Action<IUpdatePayload>) {
		var State = action.getPayload().StateClass;
		var originalState = action.getPayload().originalState;
		var nextState = action.getPayload().nextState;
		var resourceTarget = action.getPayload().resource;
		this.states = this.states.set(resourceTarget.getIdentifier(), nextState);
		var patchAction = this.stateActions.patch(State, originalState, nextState, resourceTarget);
		this.dispatcher.dispatch(patchAction);
	}

	private initialize(action: Action<IInitializePayload>) {
		var resourceTarget = new ResourceTarget(action.getPayload().identifier);
		var { State } = this.resourceFactory.reverse(resourceTarget);
		var initialState = this.states.get(resourceTarget.getIdentifier());
		var initialStateAction = this.stateActions.initialState(State, initialState, resourceTarget);
		this.dispatcher.dispatch(initialStateAction);
	}
}
