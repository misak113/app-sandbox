/// <reference path="../../node_modules/reflect-metadata/reflect-metadata.d.ts"/>

import 'reflect-metadata';
import {Inject} from 'di-ts';
import ClientSocket from './ClientSocket';
import Action from '../Flux/Action';
import Dispatcher from '../Flux/Dispatcher';
import DispatcherNamespace from './DispatcherNamespace';
import ServerSource from '../Addressing/ServerSource';
import * as actionAnnotation from './action';

@Inject
export default class ClientDispatcher {

	constructor(
		private namespace: DispatcherNamespace,
		private socket: ClientSocket,
		private dispatcher: Dispatcher
	) {}

	listen(clientId: string) {
		const socket = this.socket.getSocketOf(this.namespace.value);
		socket.on('connect', () => {
			socket.emit('clientId', clientId);
		});
		this.bind(socket);
	}

	private bind(socket: SocketIOClient.Socket) {
		socket.on('action', (name: string, payload?: any) => {
			const action = new Action(name, payload, new ServerSource());
			this.dispatcher.dispatch(action);
		});
		const actionBinding = this.dispatcher.bind(Action, (action: Action<any>) => {
			if (!(action.getSource() instanceof ServerSource)) {
				socket.emit('action', this.getActionName(action), action.getPayload());
			}
		});
		socket.on('disconnect', () => {
			this.dispatcher.unbind(actionBinding);
		});
		socket.on('error', (error: Error) => console.error(error));
	}

	private getActionName(action: Action<any>) {
		if (!Reflect.hasMetadata(actionAnnotation, action.constructor)) {
			throw new Error('Action needs to have annotation'); // TODO
		}
		return Reflect.getMetadata(actionAnnotation, action.constructor);
	}
}
