
import Action from '../Flux/Action';
import Signal from '../Flux/Signal';
import ActionCreator from '../Flux/ActionCreator';
import SignalCreator from '../Flux/SignalCreator';

const name = 'Demo.Status';

export enum Status {
	changeStatus
}

export class StatusActions extends ActionCreator<Status> {

	constructor() {
		super(name, Status);
	}

	changeStatus(): Action<{}> {
		return this.createAction(Status.changeStatus);
	}
}

export class StatusSignals extends SignalCreator<Status> {

	constructor() {
		super(name, Status);
	}

	changeStatus(): Signal<{}> {
		return this.createSignal(Status.changeStatus);
	}
}
