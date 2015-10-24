
import {Inject} from 'di-ts';
import Dispatcher from '../Flux/Dispatcher';
import Action from '../Flux/Action';
import {UpdateClientStateException, CreateClientStateException} from './exceptions';
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
			this.clientStateActionCreater.createActionName(ClientStateActionName.UPDATE), (action: Action) => this.update(action)
		);
		this.dispatcher.bind(
			this.clientStateActionCreater.createActionName(ClientStateActionName.CREATE), (action: Action) => this.create(action)
		);
	}

	getById(clientId: string) {
		return this.clientStateMap.get(clientId);
	}

	private update(action: Action) {
		if (typeof action.Payload !== 'function') {
			throw new UpdateClientStateException('Update action of clientState needs to have update callback as payload');
		}
		var originalClientStateMap = this.clientStateMap;
		var nextClientStateMap = originalClientStateMap.reduce(
			(clientStateMap: Map<string, IClientState>, originalClientState: IClientState, clientId: string) => {
				var nextClientState = action.Payload(originalClientState, clientId);
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

	private create(action: Action) {
		if (typeof action.Payload !== 'function') {
			throw new CreateClientStateException('Create action of clientState needs to have created callback as payload');
		}
		var clientId = '' + Math.random();
		var clientState = Map({});
		this.clientStateMap = this.clientStateMap.set(clientId, clientState);
		action.Payload(clientState, clientId);
	}
}
