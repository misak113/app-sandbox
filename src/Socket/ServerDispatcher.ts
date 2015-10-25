
import {Inject} from 'di-ts';
import ServerSocket from './ServerSocket';
import Action from '../Flux/Action';
import Dispatcher from '../Flux/Dispatcher';
import DispatcherNamespace from './DispatcherNamespace';
import ClientSource from '../Addressing/ClientSource';
import ClientTarget from '../Addressing/ClientTarget';

@Inject
export default class ServerDispatcher {

	constructor(
		private namespace: DispatcherNamespace,
		private socket: ServerSocket,
		private dispatcher: Dispatcher
	) {}

	listen() {
		var namespace = this.socket.Socket.of(this.namespace.value);
		namespace.on('connect', (socket: SocketIO.Socket) => {
			socket.on('clientId', (clientId: string) => this.bind(socket, clientId));
		});
	}

	private bind(socket: SocketIO.Socket, clientId: string) {
		socket.on('action', (name: string, payload?: any) => {
			var action = new Action(name, payload, new ClientSource(clientId));
			this.dispatcher.dispatch(action);
		});
		var actionBinding = this.dispatcher.bind('*', (action: Action) => {
			if (!(action.Source instanceof ClientSource) && this.isTarget(action.Target, clientId)) {
				socket.emit('action', action.Name, action.Payload);
			}
		});
		socket.on('disconnect', () => {
			this.dispatcher.unbind(actionBinding);
		});
		socket.on('error', (error: Error) => console.error(error));
	}

	private isTarget(target: any, clientId: string) {
		if (!target) {
			return true;
		}
		if (target instanceof ClientTarget && target.Id === clientId) {
			return true;
		}
		return false;
	}
}
