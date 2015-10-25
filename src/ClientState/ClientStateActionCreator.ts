
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

	updateClient(clientId: string, updateCallback: (clientState: IClientState, clientId: string) => IClientState): Action {
		return this.createAction(ClientStateActionName.UPDATE_CLIENT, { clientId: clientId, updateCallback: updateCallback });
	}

	createIfNotExists(clientId: string): Action {
		return this.createAction(ClientStateActionName.CREATE_IF_NOT_EXISTS, { clientId: clientId });
	}

	createdIfNotExists(clientId: string) {
		return this.createAction(ClientStateActionName.CREATED_IF_NOT_EXISTS, { clientId: clientId });
	}

	sendDiff(originalState: IClientState, nextState: IClientState, clientId: string): Action {
		var ops = diff(originalState, nextState);
		return this.createAction(ClientStateActionName.SEND_DIFF, ops.toJS(), new ClientTarget(clientId));
	}

	created(clientId: string) {
		return this.createAction(ClientStateActionName.CREATED, { clientId: clientId });
	}
}

export enum ClientStateActionName {
	UPDATE,
	UPDATE_CLIENT,
	CREATE_IF_NOT_EXISTS,
	CREATED_IF_NOT_EXISTS,
	SEND_DIFF,
	CREATED
}
