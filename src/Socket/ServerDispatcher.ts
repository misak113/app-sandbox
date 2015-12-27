/// <reference path="../../node_modules/reflect-metadata/reflect-metadata.d.ts"/>

import 'reflect-metadata';
import {Inject} from 'di-ts';
import ServerSocket from './ServerSocket';
import Action from '../Flux/Action';
import Dispatcher from '../Flux/Dispatcher';
import DispatcherNamespace from './DispatcherNamespace';
import ClientSource from '../Addressing/ClientSource';
import ResourceTarget from '../Addressing/ResourceTarget';
import { Subscribe, Unsubscribe } from '../State/StateActions';
import { Map } from 'immutable';
import * as actionAnnotation from './action';

@Inject
export default class ServerDispatcher {

	private socketMap = Map<string, SocketIO.Socket>();

	constructor(
		private namespace: DispatcherNamespace,
		private socket: ServerSocket,
		private dispatcher: Dispatcher
	) {
		this.dispatcher.bind(Subscribe, (action: Subscribe) => this.subscribe(action));
		this.dispatcher.bind(Unsubscribe, (action: Unsubscribe) => this.unsubscribe(action));
	}

	private subscribe(action: Subscribe) {
		if (!(action.getSource() instanceof ClientSource)) {
			throw new Error(); // TODO
		}
		const socket = this.socketMap.get(action.getSource().getId());
		if (!socket) {
			throw new Error(); // TODO
		}
		socket.join(action.getPayload().identifier);
	}

	private unsubscribe(action: Unsubscribe) {
		if (!(action.getSource() instanceof ClientSource)) {
			throw new Error(); // TODO
		}
		const socket = this.socketMap.get(action.getSource().getId());
		if (!socket) {
			throw new Error(); // TODO
		}
		socket.leave(action.getPayload().identifier);
	}

	listen() {
		const namespace = this.socket.Socket.of(this.namespace.value);
		namespace.on('connect', (socket: SocketIO.Socket) => {
			socket.on('clientId', (clientId: string) => this.bind(socket, clientId));
		});
		this.dispatcher.bind(Action, (action: Action<any>) => {
			if (!(action.getSource() instanceof ClientSource)) {
				const target = action.getTarget();
				if (target instanceof ResourceTarget) {
					namespace.to(target.getIdentifier()).emit('action', this.getActionName(action), action.getPayload());
				}
			}
		});
	}

	private bind(socket: SocketIO.Socket, clientId: string) {
		socket.on('action', (name: string, payload?: any) => {
			const action = new Action(name, payload, new ClientSource(clientId));
			this.dispatcher.dispatch(action);
		});
		socket.on('disconnect', () => {
			this.socketMap = this.socketMap.remove(clientId);
		});
		socket.on('error', (error: Error) => console.error(error));
		this.socketMap = this.socketMap.set(clientId, socket);
	}

	private getActionName(action: Action<any>) {
		if (!Reflect.hasMetadata(actionAnnotation, action.constructor)) {
			throw new Error('Action needs to have annotation'); // TODO
		}
		return Reflect.getMetadata(actionAnnotation, action.constructor);
	}
}
