
import Action from '../Flux/Action';
import ActionCreator from '../Flux/ActionCreator';
import IClientState from './IClientState';
import ClientTarget from '../Addressing/ClientTarget';
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

	update(updateCallback: (clientState: IClientState, clientId: string) => IClientState): Action {
		return this.createAction(ClientStateActionName.UPDATE, updateCallback);
	}

	getOrCreate(clientId: string, successCallback: (clientState: IClientState, clientId: string) => void): Action {
		return this.createAction(ClientStateActionName.GET_OR_CREATE, { clientId: clientId, successCallback: successCallback });
	}

	sendDiff(originalState: IClientState, nextState: IClientState, clientId: string): Action {
		var ops = diff(originalState, nextState);
		return this.createAction(ClientStateActionName.SEND_DIFF, ops.toJS(), new ClientTarget(clientId));
	}
}

export enum ClientStateActionName {
	UPDATE,
	GET_OR_CREATE,
	SEND_DIFF
}
