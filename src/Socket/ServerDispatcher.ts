
import {Inject} from 'di-ts';
import ServerSocket from './ServerSocket';
import Action from '../Flux/Action';
import Dispatcher from '../Flux/Dispatcher';
import DispatcherNamespace from './DispatcherNamespace';

@Inject
export default class ServerDispatcher {

	constructor(
		private namespace: DispatcherNamespace,
		private socket: ServerSocket,
		private dispatcher: Dispatcher
	) {}

	listen() {
		var socket = this.socket.Socket.of(this.namespace.value);
		socket.on('action', (name: string, payload?: any) => {
			var action = new Action(name, payload);
			this.dispatcher.dispatch(action);
		});
		this.dispatcher.bind('*', (action: Action) => {
			socket.emit('action', action.Name, action.Payload);
		});
	}
}
