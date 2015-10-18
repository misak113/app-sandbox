
import Action from '../Flux/Action';
import ActionCreator from '../Flux/ActionCreator';

export default class StatusActionCreator extends ActionCreator<StatusActionName> {

	protected getActionName() {
		return StatusActionName;
	}

	protected getName() {
		return 'Demo.Status';
	}

	changeStatus() {
		return this.createAction(StatusActionName.CHANGE_STATUS);
	}

	statusChanged() {
		return this.createAction(StatusActionName.STATUS_CHANGED);
	}
}

export enum StatusActionName {
	CHANGE_STATUS,
	STATUS_CHANGED
}