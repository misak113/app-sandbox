
import { Inject } from 'di-ts';
import Dispatcher from '../Flux/Dispatcher';
import Convertor from '../Immutable/Convertor';
import ResourceTarget from '../Addressing/ResourceTarget';
import ResourceFactory from '../Addressing/ResourceFactory';
import { Update, Initialize, Patch, InitialState } from './StateActions';
import { Map } from 'immutable';
import HomepageState from '../Demo/HomepageState';

@Inject
export default class StateStore {

	private states: Map<string, any>;

	constructor(
		private dispatcher: Dispatcher,
		private resourceFactory: ResourceFactory,
		private convertor: Convertor
	) {
		this.states = Map<string, any>();
		this.states = this.states.set('/homepage:{}', new HomepageState()); // TODO
		this.dispatcher.bind(Update, (action: Update) => this.updateState(action));
		this.dispatcher.bind(Initialize, (action: Initialize) => this.initialize(action));
	}

	get(resourceTarget: ResourceTarget) {
		return this.states.get(resourceTarget.getIdentifier());
	}

	private updateState(action: Update) {
		const State = action.getPayload().StateClass;
		const originalState = action.getPayload().originalState;
		const nextState = action.getPayload().nextState;
		const resourceTarget = action.getPayload().resourceTarget;
		this.states = this.states.set(resourceTarget.getIdentifier(), nextState);
		const ops = this.convertor.diff(State, originalState, nextState);
		const patchAction = new Patch(ops, resourceTarget);
		this.dispatcher.dispatch(patchAction);
	}

	private initialize(action: Initialize) {
		const resourceTarget = new ResourceTarget(action.getPayload().identifier);
		const { State } = this.resourceFactory.reverse(resourceTarget);
		const initialState = this.states.get(resourceTarget.getIdentifier());
		const initialStateAction = new InitialState(this.convertor.convertToJS(State, initialState), resourceTarget);
		this.dispatcher.dispatch(initialStateAction);
	}
}
