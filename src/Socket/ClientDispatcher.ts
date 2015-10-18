
import {Inject} from 'di-ts';
import ClientSocket from './ClientSocket';
import Action from '../Flux/Action';
import Dispatcher from '../Flux/Dispatcher';
import DispatcherNamespace from './DispatcherNamespace';

@Inject
export default class ClientDispatcher {

	constructor(
		private namespace: DispatcherNamespace,
		private socket: ClientSocket,
		private dispatcher: Dispatcher
	) {}

	listen() {
		var socket = this.socket.getSocketOf(this.namespace.value);
		socket.on('action', (name: string, payload?: any) => {
			var action = new Action(name, payload);
			this.dispatcher.dispatch(action);
		});
		this.dispatcher.bind('*', (action: Action) => {
			socket.emit('action', action.Name, action.Payload);
		});
	}
}
