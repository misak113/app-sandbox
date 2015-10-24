
import {Inject} from 'di-ts';
import Dispatcher from '../Flux/Dispatcher';
import Action from '../Flux/Action';
import {UpdateClientStateException} from './exceptions';
import ClientStateActionCreator, {ClientStateActionName} from './ClientStateActionCreator';
import IClientState from './IClientState';
import {Map} from 'immutable';

@Inject
export default class ClientStateStore {

	private clientState: IClientState;

	get ClientState() { return this.clientState; }

	constructor(
		private dispatcher: Dispatcher,
		private clientStateActionCreater: ClientStateActionCreator
	) {
		this.clientState = Map({});
		this.dispatcher.bind(this.clientStateActionCreater.createActionName(ClientStateActionName.UPDATE), (action: Action) => {
			if (typeof action.Payload !== 'function') {
				throw new UpdateClientStateException('Update action of render props needs to have update callback as payload');
			}
			var originalClientState = this.clientState;
			this.clientState = action.Payload(this.clientState);
			this.dispatcher.dispatch(this.clientStateActionCreater.sendDiff(originalClientState, this.clientState));
		});
	}
}
