
import {Inject} from 'di-ts';
import Dispatcher from '../Flux/Dispatcher';
import StatusActionCreator, {StatusActionName} from './StatusActionCreator';
import ClientStateActionCreator from '../ClientState/ClientStateActionCreator';
import IClientState from '../ClientState/IClientState';

@Inject
export default class StatusStore {

	private status: boolean;

	get Status() { return this.status; }

	constructor(
		private dispatcher: Dispatcher,
		private statusActionCreater: StatusActionCreator,
		private clientStateActionCreator: ClientStateActionCreator
	) {
		this.dispatcher.bind(this.statusActionCreater.createActionName(StatusActionName.CHANGE_STATUS), () => {
			this.status = !this.status;
			this.update();
		});
	}

	private update() {
		this.dispatcher.dispatch(this.clientStateActionCreator.update((renderProps: IClientState) => {
			renderProps = renderProps.setIn(['status'], this.status);
			return renderProps;
		}));
	}
}
