
import Action from '../Flux/Action';
import ActionCreator from '../Flux/ActionCreator';
import ClientTarget from '../Addressing/ClientTarget';
import Convertor from '../Immutable/Convertor';
import IEntityStatic from '../Immutable/IEntityStatic';
import {Inject} from 'di-ts';

@Inject
export default class ClientStateActionCreator extends ActionCreator<ClientStateActionName> {

	constructor(
		private convertor: Convertor
	) {
		super();
	}

	protected getActionName() {
		return ClientStateActionName;
	}

	protected getName() {
		return 'ClientState.ClientState';
	}

	update<IClientState>(
		ClientState: IEntityStatic<IClientState>,
		updateCallback: (clientState: IClientState, clientId: string) => IClientState
	) {
		return this.createAction(ClientStateActionName.UPDATE, {
			ClientState: ClientState,
			updateCallback: updateCallback
		});
	}

	updateClient<IClientState>(
		ClientState: IEntityStatic<IClientState>,
		clientId: string,
		updateCallback: (clientState: IClientState, clientId: string) => IClientState
	) {
		return this.createAction(ClientStateActionName.UPDATE_CLIENT, {
			ClientState: ClientState,
			clientId: clientId,
			updateCallback: updateCallback
		});
	}

	createIfNotExists<IClientState>(
		ClientState: IEntityStatic<IClientState>,
		clientId: string
	) {
		return this.createAction(ClientStateActionName.CREATE_IF_NOT_EXISTS, {
			ClientState: ClientState,
			clientId: clientId
		});
	}

	createdIfNotExists(clientId: string): Action {
		return this.createAction(ClientStateActionName.CREATED_IF_NOT_EXISTS, { clientId: clientId });
	}

	sendDiff<IClientState>(
		ClientState: IEntityStatic<IClientState>,
		originalState: IClientState,
		nextState: IClientState,
		clientId: string
	) {
		var ops = this.convertor.diff(ClientState, originalState, nextState);
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
