
import * as io from 'socket.io-client';
import {Inject} from 'di-ts';
import HostOptions from '../Http/HostOptions';

@Inject
export default class ClientSocket {

	private sockets: { [namespace: string]: SocketIOClient.Socket } = {};

	constructor(
		private hostOptions: HostOptions
	) {}

	getSocketOf(namespace: string) {
		var uri = this.buildUri(namespace);
		return this.sockets[namespace] = this.sockets[namespace] || io(uri);
	}

	private buildUri(namespace: string) {
		return 'http' + (this.hostOptions.secure ? 's' : '') + '://' + this.hostOptions.host + ':' + this.hostOptions.port + namespace;
	}
}
