
import Action from '../Flux/Action';
import ActionCreator from '../Flux/ActionCreator';
import IClientState from './IClientState';
/* tslint:disable */
var diff = require('immutablediff');
/* tslint:enable */

export default class ClientStateActionCreator extends ActionCreator<ClientStateActionName> {

	protected getActionName() {
		return ClientStateActionName;
	}

	protected getName() {
		return 'Router.ClientState';
	}

	update(updateCallback: (clientState: IClientState) => IClientState): Action {
		return this.createAction(ClientStateActionName.UPDATE, updateCallback);
	}

	sendDiff(originalState: IClientState, nextState: IClientState): Action {
		var ops = diff(originalState, nextState);
		return this.createAction(ClientStateActionName.SEND_DIFF, ops.toJS());
	}
}

export enum ClientStateActionName {
	UPDATE,
	SEND_DIFF
}
