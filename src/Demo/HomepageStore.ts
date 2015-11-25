
import {Inject} from 'di-ts';
import Dispatcher from '../Flux/Dispatcher';
import { HomepageSignals } from './HomepageActions';
import { StateActions } from '../State/State';
import StateStore from '../State/StateStore';
import HomepageState from './HomepageState';
import ResourceFactory from '../Addressing/ResourceFactory';
import Store from '../Flux/Store';

@Inject
export default class HomepageStore extends Store<HomepageState> {

	constructor(
		private dispatcher: Dispatcher,
		private statusSignals: HomepageSignals,
		private stateActions: StateActions,
		private resourceFactory: ResourceFactory,
		private stateStore: StateStore
	) {
		super(HomepageState);
		this.dispatcher.bind(this.statusSignals.changeStatus(), () => this.changeStatus());
	}

	getState(params: { [name: string]: string }) {
		var resourceTarget = this.resourceFactory.get(HomepageState, params);
		return this.stateStore.get(resourceTarget);
	}

	private changeStatus() {
		var resourceTarget = this.resourceFactory.get(HomepageState, {});
		var originalState = this.getState({});
		var nextState = originalState.toggleStatus();
		this.dispatcher.dispatch(this.stateActions.update(
			HomepageState,
			originalState,
			nextState,
			resourceTarget
		));
	}
}
