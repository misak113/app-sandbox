
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
		var namespace = this.socket.Socket.of(this.namespace.value);
		namespace.on('connect', (socket: SocketIO.Socket) => this.bind(socket));
	}

	private bind(socket: SocketIO.Socket) {
		socket.on('action', (name: string, payload?: any) => {
			var action = new Action(name, payload, 'client');
			this.dispatcher.dispatch(action);
		});
		var actionBinding = this.dispatcher.bind('*', (action: Action) => {
			if (action.Source !== 'client') {
				socket.emit('action', action.Name, action.Payload);
			}
		});
		socket.on('disconnect', () => {
			this.dispatcher.unbind(actionBinding);
		});
	}
}
