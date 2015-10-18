
import {Inject} from 'di-ts';
import Dispatcher from '../Flux/Dispatcher';
import StatusActionCreator, {StatusActionName} from './StatusActionCreator';

@Inject
export default class StatusStore {

	private status: boolean;

	get Status() { return this.status; }

	constructor(
		private dispatcher: Dispatcher,
		private actionCreater: StatusActionCreator
	) {
		this.dispatcher.bind(this.actionCreater.createActionName(StatusActionName.CHANGE_STATUS), () => {
			this.status = !this.status;
			this.dispatcher.dispatch(this.actionCreater.statusChanged());
		});
	}
}
