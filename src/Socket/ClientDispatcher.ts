
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
		socket.on('connect', () => this.bind(socket));
	}

	private bind(socket: SocketIOClient.Socket) {
		socket.on('action', (name: string, payload?: any) => {
			var action = new Action(name, payload, 'server');
			this.dispatcher.dispatch(action);
		});
		var actionBinding = this.dispatcher.bind('*', (action: Action) => {
			if (action.Source !== 'server') {
				socket.emit('action', action.Name, action.Payload);
			}
		});
		socket.on('disconnect', () => {
			this.dispatcher.unbind(actionBinding);
		});
		socket.on('error', (error: Error) => console.error(error));
	}
}
