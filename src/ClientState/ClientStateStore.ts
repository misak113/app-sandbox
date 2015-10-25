
import {Inject} from 'di-ts';
import Dispatcher from '../Flux/Dispatcher';
import Action from '../Flux/Action';
import {UpdateClientStateException} from './exceptions';
import ClientStateActionCreator, {ClientStateActionName} from './ClientStateActionCreator';
import IClientState from './IClientState';
import {Map} from 'immutable';

@Inject
export default class ClientStateStore {

	private clientStateMap: Map<string, IClientState>;

	get Map() { return this.clientStateMap; }

	constructor(
		private dispatcher: Dispatcher,
		private clientStateActionCreater: ClientStateActionCreator
	) {
		this.clientStateMap = Map({});
		this.dispatcher.bind(
			this.clientStateActionCreater.createActionName(ClientStateActionName.UPDATE),
			(action: Action) => this.update(action)
		);
		this.dispatcher.bind(
			this.clientStateActionCreater.createActionName(ClientStateActionName.UPDATE_CLIENT),
			(action: Action) => this.updateClient(action)
		);
		this.dispatcher.bind(
			this.clientStateActionCreater.createActionName(ClientStateActionName.CREATE_IF_NOT_EXISTS),
			(action: Action) => this.createIfNotExists(action)
		);
	}

	getById(clientId: string) {
		return this.clientStateMap.get(clientId);
	}

	private update(action: Action) {
		var updateCallback = action.Payload;
		if (typeof updateCallback !== 'function') {
			throw new UpdateClientStateException('Update action of clientState needs to have update callback as payload');
		}
		var originalClientStateMap = this.clientStateMap;
		var nextClientStateMap = originalClientStateMap.reduce(
			(clientStateMap: Map<string, IClientState>, originalClientState: IClientState, clientId: string) => {
				var nextClientState = updateCallback(originalClientState, clientId);
				if (nextClientState !== originalClientState) {
					clientStateMap = clientStateMap.set(clientId, nextClientState);
				}
				return clientStateMap;
			},
			originalClientStateMap
		);
		if (nextClientStateMap !== originalClientStateMap) {
			this.clientStateMap = nextClientStateMap;
			nextClientStateMap.forEach((nextClientState: IClientState, clientId: string) => {
				var originalClientState = originalClientStateMap.get(clientId);
				if (nextClientState !== originalClientState) {
					this.dispatcher.dispatch(this.clientStateActionCreater.sendDiff(originalClientState, nextClientState, clientId));
				}
			});
		}
	}

	private updateClient(action: Action) {
		var clientId = action.Payload.clientId;
		var updateCallback = action.Payload.updateCallback;
		if (typeof updateCallback !== 'function') {
			throw new UpdateClientStateException('Update client action of clientState needs to have update callback in payload');
		}
		if (!this.clientStateMap.has(clientId)) {
			throw new UpdateClientStateException('Update client action cannot find clientState by id in payload');
		}
		var originalClientState = this.clientStateMap.get(clientId);
		var nextClientState = updateCallback(originalClientState, clientId);
		if (nextClientState !== originalClientState) {
			this.clientStateMap = this.clientStateMap.set(clientId, nextClientState);
			this.dispatcher.dispatch(this.clientStateActionCreater.sendDiff(originalClientState, nextClientState, clientId));
		}
	}

	private createIfNotExists(action: Action) {
		var clientId = action.Payload.clientId;
		if (this.clientStateMap.has(clientId)) {
			var clientState = this.clientStateMap.get(clientId);
		} else {
			var clientState = Map({});
			this.clientStateMap = this.clientStateMap.set(clientId, clientState);
			this.dispatcher.dispatch(this.clientStateActionCreater.created(clientId));
		}
		setTimeout(() => {
			this.dispatcher.dispatch(this.clientStateActionCreater.createdIfNotExists(clientId));
		});
	}
}
