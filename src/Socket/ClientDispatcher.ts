
import {Inject} from 'di-ts';
import ClientSocket from './ClientSocket';
import Action from '../Flux/Action';
import Dispatcher from '../Flux/Dispatcher';
import DispatcherNamespace from './DispatcherNamespace';
import ServerSource from '../Addressing/ServerSource';

@Inject
export default class ClientDispatcher {

	constructor(
		private namespace: DispatcherNamespace,
		private socket: ClientSocket,
		private dispatcher: Dispatcher
	) {}

	listen(clientId: string) {
		var socket = this.socket.getSocketOf(this.namespace.value);
		socket.on('connect', () => {
			socket.emit('clientId', clientId);
			this.bind(socket);
		});
	}

	private bind(socket: SocketIOClient.Socket) {
		socket.on('action', (name: string, payload?: any) => {
			var action = new Action(name, payload, new ServerSource());
			this.dispatcher.dispatch(action);
		});
		var actionBinding = this.dispatcher.bind('*', (action: Action) => {
			if (!(action.Source instanceof ServerSource)) {
				socket.emit('action', action.Name, action.Payload);
			}
		});
		socket.on('disconnect', () => {
			this.dispatcher.unbind(actionBinding);
		});
		socket.on('error', (error: Error) => console.error(error));
	}
}
