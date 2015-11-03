
import {Inject} from 'di-ts';
import Dispatcher from '../Flux/Dispatcher';
import Action from '../Flux/Action';
import StatusActionCreator, {StatusActionName} from './StatusActionCreator';
import ClientStateActionCreator, {ClientStateActionName} from '../ClientState/ClientStateActionCreator';
import ClientState from './ClientState';

@Inject
export default class StatusStore {

	private status: boolean;

	get Status() { return this.status; }

	constructor(
		private dispatcher: Dispatcher,
		private statusActionCreater: StatusActionCreator,
		private clientStateActionCreator: ClientStateActionCreator
	) {
		this.dispatcher.bind(this.statusActionCreater.createActionName(StatusActionName.CHANGE_STATUS), () => this.changeStatus());
		this.dispatcher.bind(
			this.clientStateActionCreator.createActionName(ClientStateActionName.CREATED),
			(action: Action) => this.update(action.Payload.clientId)
		);
	}

	private changeStatus() {
		this.status = !this.status;
		this.update();
	}

	private update(clientId?: string) {
		if (clientId) {
			var action = this.clientStateActionCreator.updateClient(
				ClientState,
				clientId,
				(clientState: ClientState) => this.getUpdatedClientState(clientState)
			);
		} else {
			var action = this.clientStateActionCreator.update(
				ClientState,
				(clientState: ClientState) => this.getUpdatedClientState(clientState)
			);
		}
		this.dispatcher.dispatch(action);
	}

	private getUpdatedClientState(clientState: ClientState) {
		clientState = clientState.setStatus(this.status);
		return clientState;
	}
}
