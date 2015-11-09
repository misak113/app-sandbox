
import {Inject} from 'di-ts';
import Dispatcher from '../Flux/Dispatcher';
import { StatusSignals } from './Status';
import { StateActions } from '../State/State';
import HomepageState from './HomepageState';
import ResourceFactory from '../Addressing/ResourceFactory';
import Store from '../Flux/Store';

@Inject
export default class StatusStore extends Store<HomepageState> {

	private status: boolean;

	get Status() { return this.status; }

	constructor(
		private dispatcher: Dispatcher,
		private statusSignals: StatusSignals,
		private stateActions: StateActions,
		private resourceFactory: ResourceFactory
	) {
		super(HomepageState);
		this.dispatcher.bind(this.statusSignals.changeStatus(), () => this.changeStatus());
	}

	getState(params: { [name: string]: string }) {
		var state = new HomepageState();
		state = state.setStatus(this.status);
		return state;
	}

	private changeStatus() {
		var resourceTarget = this.resourceFactory.get(StatusStore, {});
		var originalState = this.getState({});
		this.status = !this.status;
		var nextState = this.getState({});
		this.dispatcher.dispatch(this.stateActions.update(
			HomepageState,
			originalState,
			nextState,
			resourceTarget
		));
	}
}
