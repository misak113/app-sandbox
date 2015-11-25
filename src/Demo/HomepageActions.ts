
import Action from '../Flux/Action';
import Signal from '../Flux/Signal';
import ActionCreator from '../Flux/ActionCreator';
import SignalCreator from '../Flux/SignalCreator';

const name = 'Demo.Homepage';

export enum HomepageAction {
	changeStatus
}

export class HomepageActions extends ActionCreator<HomepageAction> {

	constructor() {
		super(name, HomepageAction);
	}

	changeStatus(): Action<{}> {
		return this.createAction(HomepageAction.changeStatus);
	}
}

export class HomepageSignals extends SignalCreator<HomepageAction> {

	constructor() {
		super(name, HomepageAction);
	}

	changeStatus(): Signal<{}> {
		return this.createSignal(HomepageAction.changeStatus);
	}
}
