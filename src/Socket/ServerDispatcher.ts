
import {Inject} from 'di-ts';
import ServerSocket from './ServerSocket';
import Action from '../Flux/Action';
import AnySignal from '../Flux/AnySignal';
import Dispatcher from '../Flux/Dispatcher';
import DispatcherNamespace from './DispatcherNamespace';
import ClientSource from '../Addressing/ClientSource';
import ResourceTarget from '../Addressing/ResourceTarget';
import { StateSignals, ISubscribePayload, IUnsubscribePayload } from '../State/State';
import { Map } from 'immutable';

@Inject
export default class ServerDispatcher {

	private socketMap = Map<string, SocketIO.Socket>();

	constructor(
		private namespace: DispatcherNamespace,
		private socket: ServerSocket,
		private dispatcher: Dispatcher,
		private stateSignals: StateSignals
	) {
		this.dispatcher.bind(
			this.stateSignals.subscribe(),
			(action: Action<ISubscribePayload>) => this.subscribe(action)
		);
		this.dispatcher.bind(
			this.stateSignals.unsubscribe(),
			(action: Action<IUnsubscribePayload>) => this.unsubscribe(action)
		);
	}

	private subscribe(action: Action<ISubscribePayload>) {
		if (!(action.getSource() instanceof ClientSource)) {
			throw new Error(); // TODO
		}
		var socket = this.socketMap.get(action.getSource().getId());
		if (!socket) {
			throw new Error(); // TODO
		}
		socket.join(action.getPayload().identifier);
	}

	private unsubscribe(action: Action<IUnsubscribePayload>) {
		if (!(action.getSource() instanceof ClientSource)) {
			throw new Error(); // TODO
		}
		var socket = this.socketMap.get(action.getSource().getId());
		if (!socket) {
			throw new Error(); // TODO
		}
		socket.leave(action.getPayload().identifier);
	}

	listen() {
		var namespace = this.socket.Socket.of(this.namespace.value);
		namespace.on('connect', (socket: SocketIO.Socket) => {
			socket.on('clientId', (clientId: string) => this.bind(socket, clientId));
		});
		this.dispatcher.bind(new AnySignal(), (action: Action<any>) => {
			if (!(action.getSource() instanceof ClientSource)) {
				var target = action.getTarget();
				if (target instanceof ResourceTarget) {
					namespace.to(target.getIdentifier()).emit('action', action.getName(), action.getPayload());
				}
			}
		});
	}

	private bind(socket: SocketIO.Socket, clientId: string) {
		socket.on('action', (name: string, payload?: any) => {
			var action = new Action(name, payload, new ClientSource(clientId));
			this.dispatcher.dispatch(action);
		});
		socket.on('disconnect', () => {
			this.socketMap = this.socketMap.remove(clientId);
		});
		socket.on('error', (error: Error) => console.error(error));
		this.socketMap = this.socketMap.set(clientId, socket);
	}
}
