
import Action from '../Flux/Action';
import ActionCreator from '../Flux/ActionCreator';

export default class StatusActionCreator extends ActionCreator<StatusActionName> {

	protected getActionName() {
		return StatusActionName;
	}

	protected getName() {
		return 'Demo.Status';
	}

	changeStatus(): Action {
		return this.createAction(StatusActionName.CHANGE_STATUS);
	}
}

export enum StatusActionName {
	CHANGE_STATUS
}
