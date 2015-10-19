
import Action from '../Flux/Action';
import ActionCreator from '../Flux/ActionCreator';
import IClientState from './IClientState';
var diff = require('immutablediff');

export default class ClientStateActionCreator extends ActionCreator<ClientStateActionName> {

	protected getActionName() {
		return ClientStateActionName;
	}

	protected getName() {
		return 'Router.ClientState';
	}

	update(updateCallback: (clientState: IClientState) => IClientState) {
		return this.createAction(ClientStateActionName.UPDATE, updateCallback);
	}

	sendDiff(originalState: IClientState, nextState: IClientState) {
		var ops = diff(originalState, nextState);
		return this.createAction(ClientStateActionName.SEND_DIFF, ops.toJS());
	}
}

export enum ClientStateActionName {
	UPDATE,
	SEND_DIFF
}
