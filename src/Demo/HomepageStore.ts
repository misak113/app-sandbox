
import {Inject} from 'di-ts';
import Dispatcher from '../Flux/Dispatcher';
import { ChangeStatus } from './HomepageActions';
import { Update } from '../State/StateActions';
import StateStore from '../State/StateStore';
import HomepageState from './HomepageState';
import ResourceFactory from '../Addressing/ResourceFactory';
import Store from '../Flux/Store';

@Inject
export default class HomepageStore extends Store<HomepageState> {

	constructor(
		private dispatcher: Dispatcher,
		private resourceFactory: ResourceFactory,
		private stateStore: StateStore
	) {
		super(HomepageState);
		this.dispatcher.bind(ChangeStatus, () => this.changeStatus());
	}

	getState(params: { [name: string]: string }) {
		const resourceTarget = this.resourceFactory.get(HomepageState, params);
		return this.stateStore.get(resourceTarget);
	}

	private changeStatus() {
		const resourceTarget = this.resourceFactory.get(HomepageState, {});
		const originalState = this.getState({});
		const nextState = originalState.toggleStatus();
		this.dispatcher.dispatch(new Update({
			StateClass: HomepageState,
			resourceTarget,
			originalState,
			nextState
		}));
	}
}
